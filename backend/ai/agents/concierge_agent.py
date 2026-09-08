from typing import List, Dict, Any, Optional
from backend.ai.gemini.client import gemini_client
from backend.ai.language.detector import get_insufficient_context_message


class ConciergeAgent:
    """
    Agentic clinical health concierge.
    Retrieves grounded context from family records and answers user questions
    with clinical formatting and strict safety guardrails.

    Supports multilingual responses — automatically responds in the same
    language as the user's query. Medical facts (names, dosages, values,
    allergies) are always preserved verbatim regardless of response language.
    """

    async def respond(
        self,
        query: str,
        target_member: Dict[str, Any],
        retrieved_contexts: List[Dict[str, Any]],
        family_members: List[Dict[str, Any]],
        reports: Optional[List[Dict[str, Any]]] = None,
        timeline_events: Optional[List[Dict[str, Any]]] = None,
        conversation_history: Optional[List[Dict[str, Any]]] = None,
        lang_code: str = "en",
        lang_name: str = "English",
    ) -> Dict[str, Any]:
        member_id        = str(target_member.get("id", ""))
        member_name      = target_member.get("name", "Family Member")
        relation         = target_member.get("relation", "")
        blood_group      = target_member.get("bloodGroup") or target_member.get("blood_group", "O+")
        emergency_contact = target_member.get("emergencyContact") or target_member.get("emergency_contact", {})

        def _clean_list(raw: Any) -> List[str]:
            if not raw:
                return []
            if isinstance(raw, str):
                raw = [raw]
            res = []
            for item in raw:
                if not item:
                    continue
                s = str(item).strip()
                if s.lower() in ("dontknow", "don't know", "dont know", "none", "n/a", "null", "undefined", ""):
                    continue
                res.append(s)
            return res

        allergies   = _clean_list(target_member.get("allergies", []))
        chronic     = _clean_list(target_member.get("chronicDiseases") or target_member.get("chronic_diseases", []))
        medications = _clean_list(target_member.get("currentMedications") or target_member.get("current_medications", []))

        # ---------------------------------------------------------------
        # Collect member-specific reports and timeline events
        # ---------------------------------------------------------------
        target_reports = []
        if reports:
            for r in reports:
                r_mid = str(r.get("memberId") or r.get("member_id") or "")
                if r_mid == member_id or (not member_id and r.get("title")):
                    target_reports.append(r)

        target_timeline = []
        if timeline_events:
            for t in timeline_events:
                t_mid = str(t.get("memberId") or t.get("member_id") or "")
                if t_mid == member_id:
                    target_timeline.append(t)

        # ---------------------------------------------------------------
        # Build patient profile context block
        # ---------------------------------------------------------------
        context_str = f"""
PATIENT PROFILE:
- Name: {member_name} ({relation})
- Blood Group: 🩸 {blood_group}
- Known Allergies: {', '.join(allergies) if allergies else 'None Reported in Profile'}
- Chronic Diagnoses: {', '.join(chronic) if chronic else 'None Reported in Profile'}
- Active Medications: {', '.join(medications) if medications else 'None Reported in Profile'}
- Emergency Contact: {emergency_contact.get('name', 'N/A')} ({emergency_contact.get('relation', 'Contact')}) - {emergency_contact.get('phone', 'N/A')}
"""

        # ---------------------------------------------------------------
        # Build clinical reports & lab investigations block
        # ---------------------------------------------------------------
        if target_reports:
            context_str += "\nCLINICAL REPORTS & LAB INVESTIGATIONS (VERIFIED RECORDS):\n"
            for i, rep in enumerate(target_reports):
                title = rep.get("title", "Diagnostic Report")
                cat = rep.get("category", "General")
                date = rep.get("date", "N/A")
                hosp = rep.get("hospital", "Medical Facility")
                doc = rep.get("doctor", "Physician")
                summary = rep.get("summary", "No narrative summary provided.")
                ext = rep.get("extractedData") or rep.get("extracted_data") or {}

                context_str += f"\n--- Report {i+1}: {title} ---\n"
                context_str += f"- Category: {cat} | Date: {date}\n"
                context_str += f"- Facility & Doctor: {hosp} (Attending: {doc})\n"
                context_str += f"- Clinical Summary: {summary}\n"

                if isinstance(ext, dict):
                    ext_diseases = _clean_list(ext.get("diseases", []))
                    ext_meds = _clean_list(ext.get("medications", []))
                    ext_vals = ext.get("values", {})

                    if ext_diseases:
                        context_str += f"- Diagnosed Conditions: {', '.join(ext_diseases)}\n"
                    if ext_meds:
                        context_str += f"- Prescribed Medications: {', '.join(ext_meds)}\n"
                    if ext_vals and isinstance(ext_vals, dict):
                        context_str += "- Measured Biomarkers & Lab Values:\n"
                        for vk, vv in ext_vals.items():
                            context_str += f"  * {vk}: {vv}\n"
        else:
            context_str += "\nCLINICAL REPORTS & LAB INVESTIGATIONS:\nNo uploaded lab or hospital reports recorded yet for this member.\n"

        # ---------------------------------------------------------------
        # Build timeline context block
        # ---------------------------------------------------------------
        if target_timeline:
            context_str += "\nMEDICAL TIMELINE EVENTS:\n"
            for ev in target_timeline:
                context_str += f"- [{ev.get('year', '') or ev.get('date', '')}] ({ev.get('type', 'event').upper()}): {ev.get('title', '')} — {ev.get('description', '')}\n"

        # ---------------------------------------------------------------
        # Build semantic search context block
        # ---------------------------------------------------------------
        if retrieved_contexts:
            context_str += "\nADDITIONAL RELEVANT DOCUMENT EXCERPTS (RAG):\n"
            for i, ctx in enumerate(retrieved_contexts):
                score = ctx.get("score", 0)
                context_str += (
                    f"[Excerpt {i+1} — Relevance: {score:.2f}]:\n{ctx.get('text', '')}\n"
                )

        # ---------------------------------------------------------------
        # Build language-aware system instruction
        # ---------------------------------------------------------------
        is_english = lang_code == "en"
        lang_instruction = (
            "" if is_english else
            f"\n\nLANGUAGE RULES:\n"
            f"- The user's message is in {lang_name}.\n"
            f"- You MUST respond entirely in {lang_name}.\n"
            f"- Keep all medicine names, dosages, lab test names, lab values, dates, "
            f"and allergy names exactly as they appear in the medical records — do NOT translate them.\n"
            f"- If information is not available in the records, respond clearly in {lang_name} that "
            f"sufficient information is not documented.\n"
            f"- Do NOT switch to English unless the user's question contains English medical terms "
            f"that should be kept as-is."
        )

        system_instruction = (
            "You are the 'Family Health Concierge AI', an expert, empathetic medical information "
            "retrieval assistant powered by Gemini. "
            "Your job is to organize, synthesize, and clearly present verified patient history from "
            "their stored medical records, diagnostic lab panels, and health profiles.\n"
            "CRITICAL RULES:\n"
            "1. Ground all answers strictly in the patient's verified profile, clinical reports, "
            "lab biomarker values, and retrieved document records.\n"
            "2. When asked for a medical summary, health overview, or test results of a member, "
            "provide a thorough, well-structured synthesis highlighting:\n"
            "   - Profile vitals (Blood group, documented allergies, emergency contact)\n"
            "   - Specific lab reports on file (report title, date, testing facility, clinical summary)\n"
            "   - Biomarkers and values measured (e.g. cholesterol levels, glucose, HbA1c, etc.)\n"
            "   - Documented diagnoses or findings\n"
            "   - Active or prescribed medications\n"
            "3. DO NOT fabricate or hallucinate medical information. If an item is truly not present, "
            "accurately state that it is not documented.\n"
            "4. Highlight critical drug allergies with ⚠️ warnings and blood groups with 🩸 icons.\n"
            "5. Maintain a professional, comforting, concise tone with clean markdown formatting."
            + lang_instruction
        )

        prompt = f"""
{context_str}

USER QUESTION:
"{query}"

Please provide a clear, comprehensive, empathetic response based on the patient's verified clinical records and profile. Format key lists in clean markdown.
"""

        # ---------------------------------------------------------------
        # Emergency summary card (language-agnostic structured data)
        # ---------------------------------------------------------------
        clinical_cards = None
        q_low = query.lower()
        if "emergency" in q_low or "summary card" in q_low or "అత్యవసర" in query or "आपातकाल" in query:
            clinical_cards = [{
                "title": f"Emergency Clinical Summary — {member_name}",
                "items": [
                    {"label": "Relation",          "value": relation},
                    {"label": "Blood Group",        "value": f"🩸 {blood_group}"},
                    {"label": "Allergies",          "value": ", ".join(allergies) if allergies else "None Known"},
                    {"label": "Chronic Conditions", "value": ", ".join(chronic) if chronic else "None"},
                    {"label": "Active Medications", "value": "; ".join(medications) if medications else "None"},
                    {"label": "Emergency Contact",  "value": (
                        f"{emergency_contact.get('name', '')} "
                        f"({emergency_contact.get('relation', '')}) — "
                        f"{emergency_contact.get('phone', '')}"
                    )},
                ]
            }]

        # ---------------------------------------------------------------
        # Generate AI response
        # ---------------------------------------------------------------
        if gemini_client.is_configured():
            ai_text = await gemini_client.generate_text(prompt, system_instruction=system_instruction)
            return {
                "reply": ai_text,
                "clinicalCards": clinical_cards,
                "targetMemberId": target_member.get("id"),
                "detectedLanguage": lang_code,
                "detectedLanguageName": lang_name,
            }

        # Fallback (API not configured)
        return self._fallback_reply(query, target_member, clinical_cards, lang_code)

    # -----------------------------------------------------------------------
    # Fallback when Gemini API is unavailable
    # -----------------------------------------------------------------------
    def _fallback_reply(
        self,
        query: str,
        target: Dict[str, Any],
        clinical_cards: Any,
        lang_code: str = "en"
    ) -> Dict[str, Any]:
        q       = query.lower()
        name    = target.get("name", "Family Member")
        meds    = target.get("currentMedications") or target.get("current_medications", [])
        allergies = target.get("allergies", [])
        chronic = target.get("chronicDiseases") or target.get("chronic_diseases", [])
        blood   = target.get("bloodGroup") or target.get("blood_group", "O+")

        if any(kw in q for kw in ("medication", "medicine", "pill", "medicines", "మందు", "दवा")):
            meds_list = "\n".join([f"- **{m}**" for m in meds]) if meds else "No active medications recorded."
            reply = f"Active medications documented for **{name}**:\n\n{meds_list}\n\n*Verified against current clinical files.*"
        elif any(kw in q for kw in ("allergy", "allergies", "అలర్జీ", "एलर्जी")):
            alg_list = "\n".join([f"- **{a}**" for a in allergies]) if allergies else "No known drug or environmental allergies."
            reply = (
                f"Documented allergies for **{name}**:\n\n{alg_list}\n\n"
                "⚠️ **Clinical Safety Warning**: Please alert attending physicians before administering antibiotics or injections."
            )
        elif any(kw in q for kw in ("emergency", "card", "అత్యవసర", "आपातकाल")):
            reply = (
                f"🚨 **Emergency Clinical Summary** for **{name}**\n\n"
                f"* Blood Group: 🩸 **{blood}**\n"
                f"* Allergies: {', '.join(allergies) if allergies else 'None'}\n"
                f"* Chronic Conditions: {', '.join(chronic) if chronic else 'None'}\n"
                f"* Active Medications: {'; '.join(meds) if meds else 'None'}"
            )
        else:
            reply = (
                f"I have scanned the medical knowledge vault for **{name}** ({target.get('relation', '')}).\n\n"
                f"* **Blood Group**: 🩸 {blood}\n"
                f"* **Allergies**: {', '.join(allergies) if allergies else 'None'}\n"
                f"* **Chronic Conditions**: {', '.join(chronic) if chronic else 'None'}\n"
                f"* **Active Medications**: {'; '.join(meds) if meds else 'None'}\n\n"
                "Ask me about specific diagnostic lab values, prescriptions, or past timeline events."
            )

        return {
            "reply": reply,
            "clinicalCards": clinical_cards,
            "targetMemberId": target.get("id"),
            "detectedLanguage": lang_code,
        }


concierge_agent = ConciergeAgent()
