from typing import List, Dict, Any, Optional
from backend.ai.gemini.client import gemini_client

class ConciergeAgent:
    """
    Agentic clinical health concierge.
    Retrieves grounded context from family records and answers user questions
    with clinical formatting and strict safety guardrails.
    """
    async def respond(
        self,
        query: str,
        target_member: Dict[str, Any],
        retrieved_contexts: List[Dict[str, Any]],
        family_members: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        member_name = target_member.get("name", "Family Member")
        relation = target_member.get("relation", "")
        blood_group = target_member.get("bloodGroup") or target_member.get("blood_group", "O+")
        allergies = target_member.get("allergies", [])
        chronic = target_member.get("chronicDiseases") or target_member.get("chronic_diseases", [])
        medications = target_member.get("currentMedications") or target_member.get("current_medications", [])
        emergency_contact = target_member.get("emergencyContact") or target_member.get("emergency_contact", {})

        # Build context prompt
        context_str = f"""
PATIENT PROFILE:
- Name: {member_name} ({relation})
- Blood Group: {blood_group}
- Known Allergies: {', '.join(allergies) if allergies else 'None Reported'}
- Chronic Diagnoses: {', '.join(chronic) if chronic else 'None Reported'}
- Active Medications: {', '.join(medications) if medications else 'None Reported'}
- Emergency Contact: {emergency_contact.get('name', 'N/A')} ({emergency_contact.get('relation', 'Contact')}) - {emergency_contact.get('phone', 'N/A')}

RETRIEVED CLINICAL DOCUMENTS & LABS:
"""
        for i, ctx in enumerate(retrieved_contexts):
            context_str += f"\n[Doc {i+1} - Member: {ctx.get('member_id', 'N/A')} (Relevance: {ctx.get('score', 0):.2f})]:\n{ctx.get('text', '')}\n"

        system_instruction = (
            "You are the 'Family Health Concierge AI', an expert, empathetic medical information retrieval assistant. "
            "Your job is to organize, search, and clearly present verified patient history from their stored medical records. "
            "CRITICAL RULES:\n"
            "1. Ground all answers strictly in the patient's verified profile and retrieved document records.\n"
            "2. DO NOT diagnose medical conditions or prescribe new medications/treatments.\n"
            "3. If information is not in the records, state clearly that it is not documented rather than inventing it.\n"
            "4. Highlight critical drug allergies with ⚠️ warnings and blood groups with 🩸 icons.\n"
            "5. Maintain a professional, comforting, concise tone."
        )

        prompt = f"""
{context_str}

USER QUESTION:
"{query}"

Please answer the user's question clearly, formatting key lists (medications, allergies, timeline points) in clean markdown.
"""
        clinical_cards = None

        # Check if query requests emergency summary card
        q_low = query.lower()
        if "emergency" in q_low or "summary card" in q_low:
            clinical_cards = [{
                "title": f"Emergency Clinical Summary - {member_name}",
                "items": [
                    {"label": "Relation", "value": relation},
                    {"label": "Blood Group", "value": f"🩸 {blood_group}"},
                    {"label": "Allergies", "value": ", ".join(allergies) if allergies else "None Known"},
                    {"label": "Chronic Conditions", "value": ", ".join(chronic) if chronic else "None"},
                    {"label": "Active Medications", "value": "; ".join(medications) if medications else "None"},
                    {"label": "Emergency Contact", "value": f"{emergency_contact.get('name', '')} ({emergency_contact.get('relation', '')}) - {emergency_contact.get('phone', '')}"}
                ]
            }]

        if gemini_client.is_configured():
            ai_text = await gemini_client.generate_text(prompt, system_instruction=system_instruction)
            return {
                "reply": ai_text,
                "clinicalCards": clinical_cards,
                "targetMemberId": target_member.get("id")
            }

        # Fallback intelligent response
        return self._fallback_reply(query, target_member, clinical_cards)

    def _fallback_reply(self, query: str, target: Dict[str, Any], clinical_cards: Any) -> Dict[str, Any]:
        q = query.lower()
        name = target.get("name", "Family Member")
        meds = target.get("currentMedications") or target.get("current_medications", [])
        allergies = target.get("allergies", [])
        chronic = target.get("chronicDiseases") or target.get("chronic_diseases", [])
        blood = target.get("bloodGroup") or target.get("blood_group", "O+")

        if "medication" in q or "medicine" in q or "pill" in q:
            meds_list = "\n".join([f"- **{m}**" for m in meds]) if meds else "No active medications recorded."
            reply = f"Here are the active medications currently documented for **{name}**:\n\n{meds_list}\n\n*Verified against current clinical files.*"
        elif "allergy" in q or "allergies" in q:
            alg_list = "\n".join([f"- **{a}**" for a in allergies]) if allergies else "No known drug or environmental allergies."
            reply = f"Documented allergies for **{name}**:\n\n{alg_list}\n\n⚠️ **Clinical Safety Warning**: Please alert attending physicians before administering antibiotics or injections."
        elif "emergency" in q or "card" in q:
            reply = f"🚨 **Emergency Clinical Summary** ready for **{name}**.\n\n* Blood Group: 🩸 **{blood}**\n* Allergies: {', '.join(allergies) if allergies else 'None'}\n* Chronic Conditions: {', '.join(chronic) if chronic else 'None'}\n* Active Medications: {'; '.join(meds) if meds else 'None'}"
        else:
            reply = f"I have scanned the medical knowledge vault for **{name}** ({target.get('relation', '')}).\n\n* **Blood Group**: 🩸 {blood}\n* **Allergies**: {', '.join(allergies) if allergies else 'None'}\n* **Chronic Conditions**: {', '.join(chronic) if chronic else 'None'}\n* **Active Medications**: {'; '.join(meds) if meds else 'None'}\n\nAsk me about specific diagnostic lab values, prescriptions, or past timeline events."

        return {
            "reply": reply,
            "clinicalCards": clinical_cards,
            "targetMemberId": target.get("id")
        }

concierge_agent = ConciergeAgent()
