"""
Quick verification test for the multilingual language detector.
Run: .\\backend\\.venv\\Scripts\\python test_lang.py
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from backend.ai.language.detector import detect_language, get_insufficient_context_message

TESTS = [
    # (query, expected_lang_code, label)
    ("What medicines is my father taking?",         "en",    "English"),
    ("Ma nanna ki em medicines unnayi?",            "te-en", "Tenglish"),
    ("Mere father ka blood group kya hai?",         "hi-en", "Hinglish"),
    ("Mom ka latest blood report kya hai?",         "hi-en", "Hinglish"),
    ("Last HbA1c report lo value entha undi?",      "te-en", "Tenglish"),
    ("Ma father ki BP medicines enti?",             "te-en", "Tenglish"),
    ("Nanna ki diabetes eppudu diagnose ayyindi?",  "te-en", "Tenglish"),
]

# Unicode / pure-Indic script tests
INDIC_TESTS = [
    ("మా నాన్న ఏ మందులు వాడుతున్నారు?",           "te",    "Telugu"),
    ("మెరే పిటాజీ కి అల్లర్జీస్ క్యా హైన్?",      "te",    "Telugu"),  # may detect te
    ("मेरे पिताजी कौन सी दवाइयाँ लेते हैं?",      "hi",    "Hindi"),
    ("அப்பாவுக்கு என்ன மருந்துகள் இருக்கின்றன?",  "ta",    "Tamil"),
    ("ನಮ್ಮ ತಂದೆಗೆ ಯಾವ ಔಷಧಿ ಇದೆ?",                 "kn",    "Kannada"),
    ("അച്ഛന്റെ മരുന്ന് എന്ത്?",                   "ml",    "Malayalam"),
    ("বাবার ওষুধ কী?",                              "bn",    "Bengali"),
]

all_pass = True

print("=" * 65)
print("ROMANISED / MIXED-SCRIPT TESTS")
print("=" * 65)
for query, expected, label in TESTS:
    code, name = detect_language(query)
    ok = "PASS" if code == expected else "FAIL"
    if code != expected:
        all_pass = False
    print(f"[{ok}] {label:12s} expected={expected} got={code}")
    print(f"      {query}")
    print()

print("=" * 65)
print("PURE INDIC SCRIPT TESTS")
print("=" * 65)
for query, expected, label in INDIC_TESTS:
    code, name = detect_language(query)
    ok = "PASS" if code == expected else "FAIL"
    if code != expected:
        all_pass = False
    print(f"[{ok}] {label:12s} expected={expected} got={code}")
    print(f"      {query}")
    print()

print("=" * 65)
print("INSUFFICIENT CONTEXT MESSAGES")
print("=" * 65)
for lc in ["en", "te", "hi", "hi-en", "te-en", "ta", "kn", "ml"]:
    print(f"[{lc}] {get_insufficient_context_message(lc)[:75]}")
print()

print("=" * 65)
print("RESULT: ALL PASS" if all_pass else "RESULT: SOME TESTS FAILED")
print("=" * 65)
