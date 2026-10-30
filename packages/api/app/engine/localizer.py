from typing import Dict, List, Tuple
from ..schemas import ScamTypeEnum, VerdictEnum, DisplayContent

LOCALIZED_CONTENT = {
    "en": {
        "safe_headline": "Low Risk / Likely Safe",
        "safe_body": "No prominent scam patterns or malicious solicitations were detected in this message.",
        "safe_action": "No immediate threat found. Always stay cautious and never share OTPs or passwords.",
        "safe_bullets": [
            "Verify sender identity if requesting confidential information.",
            "Never share bank credentials or OTPs under any circumstances."
        ],
        "suspicious_headline": "Moderate Risk / Proceed with Caution",
        "suspicious_body": "This message exhibits suspicious indicators such as unverified links, unsolicited rewards, or artificial urgency.",
        "suspicious_action": "Do not click links or make payments. Verify directly via an official app or website.",
        "suspicious_bullets": [
            "Do not call phone numbers provided inside the message.",
            "Cross-check directly through the official website or verified customer care number."
        ],
        "danger_headline": "High Risk / Potential Scam Detected",
        "danger_body": "Critical scam tactics detected, such as credential theft, fake authority threats, or payment deception.",
        "danger_action": "Do NOT share OTP/PIN, transfer money, or click links. Block the sender immediately.",
        "danger_bullets": [
            "Banks and law enforcement never ask for OTPs or demand immediate online payment.",
            "Block sender and report to the National Cyber Crime Portal (1930 or cybercrime.gov.in)."
        ]
    },
    "hi": {
        "safe_headline": "कम जोखिम / संभवतः सुरक्षित",
        "safe_body": "इस संदेश में कोई स्पष्ट धोखाधड़ी या संदिग्ध संकेत नहीं मिले हैं।",
        "safe_action": "कोई खतरा नहीं दिखा। फिर भी सतर्क रहें और कभी भी ओटीपी या पासवर्ड साझा न करें।",
        "safe_bullets": [
            "गोपनीय जानकारी मांगने पर प्रेषक की पहचान सत्यापित करें।",
            "किसी भी परिस्थिति में बैंक विवरण या ओटीपी साझा न करें।"
        ],
        "suspicious_headline": "मध्यम जोखिम / सावधानी बरतें",
        "suspicious_body": "इस संदेश में संदिग्ध संकेत जैसे असत्यापित लिंक या अनुचित जल्दबाजी पाई गई है।",
        "suspicious_action": "लिंक पर क्लिक न करें और कोई भुगतान न करें। आधिकारिक ऐप या वेबसाइट से पुष्टि करें।",
        "suspicious_bullets": [
            "संदेश में दिए गए फोन नंबर पर कॉल न करें।",
            "आधिकारिक वेबसाइट या बैंक हेल्पलाइन नंबर से सीधे जांच करें।"
        ],
        "danger_headline": "उच्च जोखिम / धोखाधड़ी का गंभीर खतरा",
        "danger_body": "संदेश में गंभीर धोखे के संकेत मिले हैं, जैसे ओटीपी चोरी, डिजिटल अरेस्ट या फर्जी बैंक धमकी।",
        "danger_action": "ओटीपी/पिन कभी साझा न करें, पैसे न भेजें। प्रेषक को तुरंत ब्लॉक करें।",
        "danger_bullets": [
            "बैंक या पुलिस कभी भी फोन पर ओटीपी या तुरंत पैसे की मांग नहीं करते।",
            "नंबर ब्लॉक करें और राष्ट्रीय साइबर अपराध पोर्टल (1930) पर शिकायत दर्ज करें।"
        ]
    },
    "kn": {
        "safe_headline": "ಕಡಿಮೆ ಅಪಾಯ / ಸುರಕ್ಷಿತವಾಗಿದೆ",
        "safe_body": "ಈ ಸಂದೇಶದಲ್ಲಿ ಯಾವುದೇ ಸ್ಪಷ್ಟ ವಂಚನೆ ಅಥವಾ ಅನುಮಾನಾಸ್ಪದ ಸಂಕೇತಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.",
        "safe_action": "ಯಾವುದೇ ಬೆದರಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ. ಯಾವಾಗಲೂ ಜಾಗರೂಕರಾಗಿರಿ ಮತ್ತು ಓಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
        "safe_bullets": [
            "ಗೌಪ್ಯ ಮಾಹಿತಿ ಕೇಳಿದರೆ ಕಳುಹಿಸುವವರ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಿ.",
            "ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಬ್ಯಾಂಕ್ ವಿವರ ಅಥವಾ ಓಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ."
        ],
        "suspicious_headline": "ಮಧ್ಯಮ ಅಪಾಯ / ಎಚ್ಚರಿಕೆಯಿಂದ ಮುಂದುವರಿಯಿರಿ",
        "suspicious_body": "ಈ ಸಂದೇಶದಲ್ಲಿ ಪರಿಶೀಲಿಸದ ಲಿಂಕ್ ಅಥವಾ ಅನಗತ್ಯ ತುರ್ತಿನಂತಹ ಅನುಮಾನಾಸ್ಪದ ಅಂಶಗಳಿವೆ.",
        "suspicious_action": "ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಅಥವಾ ಹಣ ಪಾವತಿಸಬೇಡಿ. ಅಧಿಕೃತ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ.",
        "suspicious_bullets": [
            "ಸಂದೇಶದಲ್ಲಿ ನೀಡಲಾದ ಫೋನ್ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಬೇಡಿ.",
            "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಗ್ರಾಹಕ ಸಹಾಯವಾಣಿ ಮೂಲಕ ನೇರವಾಗಿ ಪರಿಶೀಲಿಸಿ."
        ],
        "danger_headline": "ಹೆಚ್ಚಿನ ಅಪಾಯ / ಗಂಭೀರ ವಂಚನೆ ಪತ್ತೆಯಾಗಿದೆ",
        "danger_body": "ಸಂದೇಶದಲ್ಲಿ ಓಟಿಪಿ ಕಳ್ಳತನ, ಡಿಜಿಟಲ್ ಬಂಧನ ಅಥವಾ ನಕಲಿ ಬೆದರಿಕೆಯಂತಹ ವಂಚನೆಯ ಲಕ್ಷಣಗಳಿವೆ.",
        "danger_action": "ಓಟಿಪಿ/ಪಿನ್ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ, ಹಣ ಕಳುಹಿಸಬೇಡಿ. ಕಳುಹಿಸಿದವರನ್ನು ತಕ್ಷಣ ಬ್ಲಾಕ್ ಮಾಡಿ.",
        "danger_bullets": [
            "ಬ್ಯಾಂಕ್ ಅಥವಾ ಪೊಲೀಸರು ಎಂದಿಗೂ ಫೋನ್‌ನಲ್ಲಿ ಓಟಿಪಿ ಅಥವಾ ತಕ್ಷಣದ ಹಣ ಪಾವತಿಗೆ ಕೇಳುವುದಿಲ್ಲ.",
            "ಕರೆ/ಸಂದೇಶ ಬ್ಲಾಕ್ ಮಾಡಿ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ಸಹಾಯವಾಣಿಗೆ (1930) ದೂರು ನೀಡಿ."
        ]
    }
}

def localize_verdict_content(verdict: VerdictEnum, lang: str) -> Tuple[str, str, str, List[str]]:
    """Returns (headline, explanation, safe_action, bullets) for the requested language."""
    data = LOCALIZED_CONTENT.get(lang, LOCALIZED_CONTENT["en"])
    if verdict == VerdictEnum.SAFE:
        return data["safe_headline"], data["safe_body"], data["safe_action"], data["safe_bullets"]
    elif verdict == VerdictEnum.SUSPICIOUS:
        return data["suspicious_headline"], data["suspicious_body"], data["suspicious_action"], data["suspicious_bullets"]
    else:
        return data["danger_headline"], data["danger_body"], data["danger_action"], data["danger_bullets"]
