"""
Language Detector for Family Health Concierge AI
=================================================
Detects the language of an incoming user query using langdetect.
Special-cases Hinglish (Hindi + English mixed) and Tenglish (Telugu + English mixed)
by analyzing character scripts in the text.

Supports:
  Telugu (te), Hindi (hi), Tamil (ta), Kannada (kn), Malayalam (ml),
  Marathi (mr), Bengali (bn), Gujarati (gu), Punjabi (pa), Urdu (ur),
  English (en), Hinglish (hi-en), Tenglish (te-en)
"""

import re
import unicodedata
from typing import Tuple

try:
    from langdetect import detect, DetectorFactory
    from langdetect.lang_detect_exception import LangDetectException
    DetectorFactory.seed = 0  # Deterministic results
    _LANGDETECT_AVAILABLE = True
except ImportError:
    _LANGDETECT_AVAILABLE = False
    print("[LanguageDetector] langdetect not installed — falling back to script analysis only")


# ---------------------------------------------------------------------------
# Unicode block ranges for Indic scripts
# ---------------------------------------------------------------------------
DEVANAGARI_RANGE  = (0x0900, 0x097F)   # Hindi, Marathi
TELUGU_RANGE      = (0x0C00, 0x0C7F)
TAMIL_RANGE       = (0x0B80, 0x0BFF)
KANNADA_RANGE     = (0x0C80, 0x0CFF)
MALAYALAM_RANGE   = (0x0D00, 0x0D7F)
BENGALI_RANGE     = (0x0980, 0x09FF)
GUJARATI_RANGE    = (0x0A80, 0x0AFF)
GURMUKHI_RANGE    = (0x0A00, 0x0A7F)   # Punjabi
ARABIC_RANGE      = (0x0600, 0x06FF)   # Urdu uses Arabic script


LANGUAGE_NAMES = {
    "en":    "English",
    "hi":    "Hindi",
    "te":    "Telugu",
    "ta":    "Tamil",
    "kn":    "Kannada",
    "ml":    "Malayalam",
    "mr":    "Marathi",
    "bn":    "Bengali",
    "gu":    "Gujarati",
    "pa":    "Punjabi",
    "ur":    "Urdu",
    "hi-en": "Hinglish",
    "te-en": "Tenglish",
}

INSUFFICIENT_CONTEXT_MESSAGES = {
    "en":    "I don't have enough information in the available medical records to answer this accurately.",
    "hi":    "इस प्रश्न का सही उत्तर देने के लिए उपलब्ध मेडिकल रिकॉर्ड में पर्याप्त जानकारी नहीं है।",
    "te":    "ఈ ప్రశ్నకు ఖచ్చితంగా సమాధానం ఇవ్వడానికి అందుబాటులో ఉన్న వైద్య రికార్డుల్లో తగినంత సమాచారం లేదు.",
    "ta":    "இந்த கேள்விக்கு சரியாக பதிலளிக்க கிடைக்கக்கூடிய மருத்துவ பதிவுகளில் போதுமான தகவல் இல்லை.",
    "kn":    "ಈ ಪ್ರಶ್ನೆಗೆ ನಿಖರವಾಗಿ ಉತ್ತರಿಸಲು ಲಭ್ಯವಿರುವ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳಲ್ಲಿ ಸಾಕಷ್ಟು ಮಾಹಿತಿಯಿಲ್ಲ.",
    "ml":    "ഈ ചോദ്യത്തിന് കൃത്യമായി ഉത്തരം നൽകാൻ ലഭ്യമായ മെഡിക്കൽ രേഖകളിൽ മതിയായ വിവരങ്ങൾ ഇല്ല.",
    "mr":    "या प्रश्नाचे अचूक उत्तर देण्यासाठी उपलब्ध वैद्यकीय नोंदींमध्ये पुरेशी माहिती नाही.",
    "bn":    "এই প্রশ্নের সঠিক উত্তর দেওয়ার জন্য উপলব্ধ মেডিকেল রেকর্ডে পর্যাপ্ত তথ্য নেই।",
    "gu":    "આ પ્રશ્નનો સચોટ જવાબ આપવા માટે ઉપલબ્ધ મેડિકલ રેકોર્ડ્સમાં પૂરતી માહિતી નથી.",
    "pa":    "ਇਸ ਸਵਾਲ ਦਾ ਸਹੀ ਜਵਾਬ ਦੇਣ ਲਈ ਉਪਲਬਧ ਮੈਡੀਕਲ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ।",
    "ur":    "اس سوال کا درست جواب دینے کے لیے دستیاب طبی ریکارڈ میں کافی معلومات نہیں ہیں۔",
    "hi-en": "Available medical records mein itni information nahi hai ki is question ka sahi jawab de sakein.",
    "te-en": "Available medical records lo ee question ki correct answer ivvadam ki poori information ledu.",
}


def _count_script_chars(text: str, lo: int, hi: int) -> int:
    """Count characters in `text` that fall within a Unicode codepoint range."""
    return sum(1 for ch in text if lo <= ord(ch) <= hi)


def _is_latin(ch: str) -> bool:
    return 'LATIN' in unicodedata.name(ch, '')


def detect_language(query: str) -> Tuple[str, str]:
    """
    Detect the language of a user query.

    Returns:
        (lang_code, lang_name)  e.g. ("te", "Telugu") or ("hi-en", "Hinglish")
    """
    if not query or not query.strip():
        return "en", "English"

    text = query.strip()

    # -----------------------------------------------------------------------
    # Step 1: Count characters per script to detect Indic content
    # -----------------------------------------------------------------------
    te_count  = _count_script_chars(text, *TELUGU_RANGE)
    hi_count  = _count_script_chars(text, *DEVANAGARI_RANGE)
    ta_count  = _count_script_chars(text, *TAMIL_RANGE)
    kn_count  = _count_script_chars(text, *KANNADA_RANGE)
    ml_count  = _count_script_chars(text, *MALAYALAM_RANGE)
    bn_count  = _count_script_chars(text, *BENGALI_RANGE)
    gu_count  = _count_script_chars(text, *GUJARATI_RANGE)
    gu_count2 = _count_script_chars(text, *GURMUKHI_RANGE)   # Punjabi
    ar_count  = _count_script_chars(text, *ARABIC_RANGE)

    total = len(text.replace(" ", ""))
    if total == 0:
        return "en", "English"

    latin_count = sum(1 for ch in text if ch.isalpha() and ord(ch) < 256)
    indic_total = te_count + hi_count + ta_count + kn_count + ml_count + bn_count + gu_count + gu_count2 + ar_count

    # -----------------------------------------------------------------------
    # Step 2: Pure Indic script detection (no/minimal Latin chars)
    # -----------------------------------------------------------------------
    if indic_total > 0 and (latin_count / max(indic_total, 1)) < 0.4:
        # Dominant script wins
        max_indic = max(
            (te_count, "te"), (hi_count, "hi"), (ta_count, "ta"),
            (kn_count, "kn"), (ml_count, "ml"), (bn_count, "bn"),
            (gu_count, "gu"), (gu_count2, "pa"), (ar_count, "ur"),
            key=lambda x: x[0]
        )
        lang_code = max_indic[1]
        # Marathi uses Devanagari — use langdetect to disambiguate hi vs mr
        if lang_code == "hi" and _LANGDETECT_AVAILABLE:
            try:
                ld = detect(text)
                if ld == "mr":
                    lang_code = "mr"
            except Exception:
                pass
        return lang_code, LANGUAGE_NAMES.get(lang_code, "Hindi")

    # -----------------------------------------------------------------------
    # Step 3: Mixed-script detection — Hinglish / Tenglish
    # -----------------------------------------------------------------------
    if indic_total > 0 and latin_count > 0:
        if te_count > 0 and te_count >= max(hi_count, ta_count, kn_count, ml_count):
            return "te-en", "Tenglish"
        if hi_count > 0:
            return "hi-en", "Hinglish"
        # Other mixed Indic + Latin → use base Indic lang
        max_indic = max(
            (ta_count, "ta"), (kn_count, "kn"), (ml_count, "ml"),
            (bn_count, "bn"), (gu_count, "gu"), (gu_count2, "pa"), (ar_count, "ur"),
            key=lambda x: x[0]
        )
        if max_indic[0] > 0:
            return max_indic[1], LANGUAGE_NAMES.get(max_indic[1], "English")

    # -----------------------------------------------------------------------
    # Step 4: Romanised / Latin-only text — use langdetect + Hinglish heuristics
    # -----------------------------------------------------------------------
    HINGLISH_KEYWORDS = {
        "nanna", "amma", "akka", "anna", "thatha", "ajji",
        "maa", "papa", "bhai", "didi", "bhaiya", "beti", "beta",
        "kya", "hai", "mera", "meri", "mere", "aapke", "unka",
        "blood", "report", "medicine", "doctor", "hospital",
        "kab", "kaise", "kyun", "kitna", "iska", "uska",
        "nahi", "haan", "theek",
    }
    TENGLISH_KEYWORDS = {
        "nanna", "amma", "akka", "anna", "thatha", "naana",
        "enti", "emi", "em", "ela", "evari", "eppudu",
        "cheppandi", "chudandi", "unnayi", "ledu", "avutundi",
        "ki", "lo", "ku", "tho", "gurinchi",
        # Additional Tenglish medical query patterns
        "entha", "undi", "untundi", "cheyandi", "chuskundam",
        "report", "medication", "medicine",  # Often used Tenglish-style
        "anni", "meeru", "mee", "mana", "miru",
    }

    words_lower = set(re.findall(r'\b[a-z]+\b', text.lower()))

    tenglish_hits = len(words_lower & TENGLISH_KEYWORDS)
    hinglish_hits = len(words_lower & HINGLISH_KEYWORDS)

    if tenglish_hits >= 2:
        return "te-en", "Tenglish"
    if hinglish_hits >= 2:
        return "hi-en", "Hinglish"

    # Use langdetect for remaining Latin-script queries
    if _LANGDETECT_AVAILABLE:
        try:
            ld_code = detect(text)
            # Map langdetect codes we care about
            supported = {"en", "hi", "te", "ta", "kn", "ml", "mr", "bn", "gu", "pa", "ur"}
            if ld_code in supported:
                return ld_code, LANGUAGE_NAMES.get(ld_code, "English")
        except LangDetectException:
            pass

    return "en", "English"


def get_insufficient_context_message(lang_code: str) -> str:
    """Return the 'no information found' message in the given language."""
    return INSUFFICIENT_CONTEXT_MESSAGES.get(lang_code, INSUFFICIENT_CONTEXT_MESSAGES["en"])
