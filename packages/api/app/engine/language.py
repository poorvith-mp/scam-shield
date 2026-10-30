import re

def detect_input_language(text: str) -> str:
    """
    Detects language script from submitted text:
    - Devanagari script -> 'hi' (Hindi)
    - Kannada script -> 'kn' (Kannada)
    - Romanized markers -> 'hi' or 'kn'
    - Default -> 'en' (English)
    """
    if re.search(r'[\u0C80-\u0CFF]', text):
        return "kn"
    if re.search(r'[\u0900-\u097F]', text):
        return "hi"

    # Romanized Hindi indicators
    lower = text.lower()
    hindi_keywords = ["aapka", "karein", "kijiye", "paisa", "bhejo", "turant", "dhyan", "khata", "sampark"]
    if any(k in lower for k in hindi_keywords):
        return "hi"

    # Romanized Kannada indicators
    kannada_keywords = ["nimma", "kodi", "hana", "thakshana", "khate", "samparkisi"]
    if any(k in lower for k in kannada_keywords):
        return "kn"

    return "en"
