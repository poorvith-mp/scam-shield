import re
from typing import List, Dict, Any, Tuple

# Suspicious TLDs frequently used in phishing campaigns
SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".click", ".tk", ".ml", ".ga", ".cf", ".gq",
    ".link", ".live", ".loan", ".work", ".stream", ".bid", ".download"
}

URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly", "cutt.ly"
}

def sanitize_text(text: str) -> str:
    """Removes zero-width and bidirectional control characters used for evasion."""
    # Strip zero-width characters: \u200B, \u200C, \u200D, \uFEFF, \u202A-\u202E
    cleaned = re.sub(r'[\u200B-\u200D\uFEFF\u202A-\u202E]', '', text)
    return cleaned.strip()

def extract_indicators(text: str) -> Tuple[List[str], List[str], List[str]]:
    """
    Extracts URLs, suspicious URL flags, and phone numbers.
    Returns (urls, url_red_flags, phone_numbers).
    """
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    urls = re.findall(url_pattern, text, re.IGNORECASE)

    url_flags = []
    for u in urls:
        u_lower = u.lower()
        if any(u_lower.endswith(tld) or f"{tld}/" in u_lower for tld in SUSPICIOUS_TLDS):
            url_flags.append(f"Suspicious unverified domain extension in link: {u}")
        if any(shortener in u_lower for shortener in URL_SHORTENERS):
            url_flags.append(f"Obfuscated short link hiding destination: {u}")
        if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', u_lower):
            url_flags.append(f"Direct raw IP address in link: {u}")
        if u_lower.startswith("http://"):
            url_flags.append(f"Insecure unencrypted HTTP link: {u}")

    # Indian phone extraction
    phone_pattern = r'(?:\+91[\s-]?)?[6-9]\d{9}\b|0\d{10}\b'
    phone_numbers = re.findall(phone_pattern, text)

    return urls, url_flags, phone_numbers
