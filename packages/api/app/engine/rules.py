import re
from typing import List, Dict, Tuple, Set
from ..schemas import ScamTypeEnum, TacticEnum

# Defensive warning patterns that indicate a LEGITIMATE bank message warning the user
DEFENSIVE_OTP_PATTERNS = [
    r'(?:do\s+not|never|don\'?t)\s+share\s+(?:this\s+|your\s+)?(?:otp|pin|password|cvv)',
    r'bank\s+never\s+asks\s+for\s+(?:otp|pin|password)',
    r'bank\s+officials?\s+never\s+ask',
    r'kisi\s+se\s+(?:bhi\s+)?(?:otp|pin)\s+share\s+na\s+kare',
    r'kisi\s+ke\s+saath\s+saajha\s+na\s+kare',
    r'kisi\s+ko\s+na\s+bataye',
    r'yarondigu\s+hanchikollabedi',
    r'ಯಾರೊಂದಿಗೂ\s+ಹಂಚಿಕೊಳ್ಳಬೇಡಿ',
    r'ಸಾಜಾ\s+ಮಾಡಬೇಡಿ',
    r'साझा\s+न\s+करें'
]

def is_defensive_otp_warning(text: str) -> bool:
    """Returns True if the message is advising NOT to share OTP/PIN rather than asking for it."""
    lower = text.lower()
    if '[call warning signals:' in lower:
        return False
    return any(re.search(pat, lower) for pat in DEFENSIVE_OTP_PATTERNS)

def evaluate_rules(text: str, url_flags: List[str]) -> Tuple[int, ScamTypeEnum, List[str], List[TacticEnum], bool]:
    """
    Evaluates text against deterministic multilingual rules.
    Returns: (score, scam_type, red_flags, tactics, has_critical_flag)
    """
    lower = text.lower()
    is_call_signals = '[call warning signals:' in lower
    is_defensive = not is_call_signals and is_defensive_otp_warning(text)

    score = 0
    red_flags: List[str] = list(url_flags)
    tactics: Set[TacticEnum] = set()
    scam_types: List[Tuple[ScamTypeEnum, int]] = []
    has_critical_flag = False

    # Dedicated Call Warning Signals Evaluation
    if is_call_signals:
        if re.search(r'arrest|court summons|police case|digital arrest|ಬಂಧನ|गिरफ्तारी', lower):
            score += 65
            has_critical_flag = True
            red_flags.append("Caller threatened legal arrest, police detention, or court summons.")
            tactics.add(TacticEnum.AUTHORITY)
            tactics.add(TacticEnum.LOSS_AVERSION)
            scam_types.append((ScamTypeEnum.AUTHORITY_IMPERSONATION, 70))

        if re.search(r'secret otp|upi pin|bank details|password|ರಹಸ್ಯ ಓಟಿಪಿ|गोपनीय ओटीपी', lower):
            score += 65
            has_critical_flag = True
            red_flags.append("Caller demanded confidential credentials, secret OTP, UPI PIN, or bank password.")
            tactics.add(TacticEnum.CREDENTIAL_PHISHING)
            scam_types.append((ScamTypeEnum.PHISHING, 75))

        if re.search(r'money transfer|payment to clear|penalties|fees|ಹಣ ವರ್ಗಾವಣೆ|पैसे ट्रांसफर|दंड|ಜುಲ್ಮಾನೆ', lower):
            score += 60
            has_critical_flag = True
            red_flags.append("Caller demanded immediate money transfer or fees to clear alleged penalties.")
            tactics.add(TacticEnum.LOSS_AVERSION)
            scam_types.append((ScamTypeEnum.PAYMENT_SCAM, 65))

        if re.search(r'cbi|police|customs|bank|trai|courier|ಕಸ್ಟಮ್ಸ್|ಸಿಬಿಐ|कस्टम्स|सीबीआई', lower):
            score += 55
            red_flags.append("Caller falsely claimed to represent law enforcement, bank, or government agencies.")
            tactics.add(TacticEnum.AUTHORITY)
            scam_types.append((ScamTypeEnum.AUTHORITY_IMPERSONATION, 60))

        if re.search(r'act urgently|not to consult family|ತುರ್ತು|तुरंत|परिवार', lower):
            score += 45
            tactics.add(TacticEnum.URGENCY)
            red_flags.append("Caller imposed extreme urgency and warned against consulting family or advisors.")

    # 1. Credential & OTP Demands (CRITICAL)
    if not is_defensive:
        otp_demand_patterns = [
            r'\b(?:share|send|tell|give|asked|demanded|demands|demanding|requesting|request)\s+(?:me\s+)?(?:your\s+)?(?:the\s+)?(?:for\s+)?(?:secret\s+)?(?:otp|pin|password|cvv)\b',
            r'\b(?:otp|pin|password)\s+(?:bhejo|bataye|bhejiye|darj\s+kare|kodi|thilisi|maanga)\b',
            r'(?:ओटीपी|पिन|पासवर्ड)\s+(?:बताएं|भेजें|दर्ज\s+करें|मांगा)',
            r'(?:ಓಟಿಪಿ|ಪಿನ್|ಪಾಸ್ವರ್ಡ್)\s+(?:ನೀಡಿ|ದಾಖಲಿಸಿ|ತಿಳಿಸಿ|ಕೇಳಿದರು)'
        ]
        if any(re.search(pat, lower) for pat in otp_demand_patterns):
            score += 65
            has_critical_flag = True
            red_flags.append("Explicit request to share secret OTP, UPI PIN, or password.")
            tactics.add(TacticEnum.CREDENTIAL_PHISHING)
            scam_types.append((ScamTypeEnum.PHISHING, 65))

    # 2. Digital Arrest / Law Enforcement / Authority Threat (CRITICAL)
    authority_patterns = [
        r'\b(?:cbi|police|customs|court|rbi|trai|narcotics)\b.*?\b(?:arrest|warrant|seized|illegal|jail|case\s+filed|drugs)\b',
        r'\b(?:claimed|claiming|pretending)\s+to\s+be\s+(?:cbi|police|customs|bank|trai|courier|inspector|officer|rbi)\b',
        r'\bdigital\s+arrest\b',
        r'\bparcel\s+(?:held|seized|intercepted)\s+by\s+customs\b',
        r'\bpolice\s+(?:girftari|action|warrant)\b',
        r'(?:डिजिटल\s+अरेस्ट|गिरफ्तारी\s+वारंट|पुलिस\s+कार्रवाई)',
        r'(?:ಡಿಜಿಟಲ್\s+ಬಂಧನ|ಪೊಲೀಸ್\s+ಕ್ರಮ|ಬಂಧನ\s+ವಾರಂಟ್)'
    ]
    if any(re.search(pat, lower) for pat in authority_patterns):
        score += 65
        has_critical_flag = True
        red_flags.append("Threat of police arrest, court action, or customs parcel seizure (Authority Impersonation).")
        tactics.add(TacticEnum.AUTHORITY)
        tactics.add(TacticEnum.LOSS_AVERSION)
        scam_types.append((ScamTypeEnum.AUTHORITY_IMPERSONATION, 65))

    # 3. Demanded Money / Fine Under Coercion
    money_demand_patterns = [
        r'\b(?:demanded|demands|demanding|transfer)\s+(?:money|payment|cash|funds|penalties|fees)\b',
        r'\bpay\s+(?:fine|penalty|bail|clearance)\b'
    ]
    if any(re.search(pat, lower) for pat in money_demand_patterns):
        score += 55
        red_flags.append("Demand for immediate fund transfer or penalty payment under pressure.")
        tactics.add(TacticEnum.LOSS_AVERSION)
        scam_types.append((ScamTypeEnum.PAYMENT_SCAM, 55))

    # 4. Bank Account / KYC / Electricity / SIM Disconnection Urgency
    threat_patterns = [
        r'\b(?:account|pan|kyc|sim|card)\s+(?:will\s+be\s+)?(?:blocked|suspended|deactivated|frozen|terminated)\b',
        r'\belectricity\s+(?:power\s+)?will\s+be\s+(?:disconnected|cutoff|cut\s+off)\s+(?:tonight|today)\b',
        r'\bupdate\s+(?:your\s+)?(?:pan|kyc)\s+(?:immediately|urgent|within\s+\d+\s+hours?)\b',
        r'\b(?:khata|bijli)\s+(?:band|kat|stagit)\b',
        r'(?:बिजली\s+काट\s+दी\s+जाएगी|खाता\s+बंद|केवाईसी\s+अपडेट)',
        r'(?:ವಿದ್ಯುತ್\s+ಕಡಿತ|ಖಾತೆ\s+ಸ್ಥಗಿತ|ಕೆವೈಸಿ\s+ನವೀಕರಣ)'
    ]
    if any(re.search(pat, lower) for pat in threat_patterns):
        score += 50
        red_flags.append("Fear-inducing deadline threatening bank block, power cutoff, or SIM deactivation.")
        tactics.add(TacticEnum.URGENCY)
        tactics.add(TacticEnum.LOSS_AVERSION)
        scam_types.append((ScamTypeEnum.BANK_FRAUD, 50))

    # 5. QR Code / UPI Collect Trick ("Scan QR to receive money" or "enter PIN to receive")
    upi_trick_patterns = [
        r'\bscan\s+(?:this\s+)?qr\s+(?:code\s+)?to\s+(?:receive|accept|credit|get|claim)\b',
        r'\bapprove\s+(?:upi\s+)?collect\s+request\s+to\s+receive\b',
        r'\benter\s+(?:your\s+)?(?:upi\s+)?pin\s+to\s+(?:receive|claim|get|credit)\b',
        r'(?:पैसे\s+पाने\s+के\s+लिए\s+क्यूआर\s+स्कैन\s+करें|पिन\s+दर्ज\s+करें)',
        r'(?:ಹಣ\s+ಸ್ವೀಕರಿಸಲು\s+ಕ್ಯೂಆರ್\s+ಸ್ಕ್ಯಾನ್\s+ಮಾಡಿ|ಪಿನ್\s+ನಮೂದಿಸಿ)'
    ]
    if any(re.search(pat, lower) for pat in upi_trick_patterns):
        score += 70
        has_critical_flag = True
        red_flags.append("UPI reversal deception: scanning QR or entering PIN always SENDS money, never receives it.")
        tactics.add(TacticEnum.CREDENTIAL_PHISHING)
        tactics.add(TacticEnum.REWARD)
        scam_types.append((ScamTypeEnum.PAYMENT_SCAM, 70))

    # 6. Part-time Job / YouTube Tasks / Advance Fee
    job_patterns = [
        r'\b(?:part\s*time|work\s+from\s+home)\s+job\b.*?\b(?:daily|earn|salary)\s+(?:rs\.?|inr|\$)?\s*\d+',
        r'\blike\s+youtube\s+videos\s+and\s+earn\b',
        r'\btelegram\s+task\b',
        r'\bpay\s+(?:registration|security|processing|training)\s+fee\b',
        r'(?:घर\s+बैठे\s+कमाएं|पार्ट\s+टाइम\s+जॉब|टेलीग्राम\s+टास्क)',
        r'(?:ಮನೆಯಲ್ಲೇ\s+ಕುಳಿತು\s+ಗಳಿಸಿ|ಭಾಗಶಃ\s+ಸಮಯದ\s+ಉದ್ಯೋಗ)'
    ]
    if any(re.search(pat, lower) for pat in job_patterns):
        score += 45
        red_flags.append("Unrealistic part-time job offer requiring fee payment or Telegram tasks.")
        tactics.add(TacticEnum.REWARD)
        scam_types.append((ScamTypeEnum.JOB_SCAM, 45))

    # 7. Lottery / Prize / Subsidy / Scholarship
    lottery_patterns = [
        r'\bcongratulations.*?\b(?:won|selected|winner)\b.*?(?:lakh|crore|prize|lottery|reward|cash)\b',
        r'\bkbc\s+lottery\b',
        r'\bfree\s+(?:laptop|recharge|scholarship)\s+scheme\b',
        r'(?:बधाई\s+हो|लॉटरी\s+जीती|इनाम)',
        r'(?:ಅಭಿನಂದನೆಗಳು|ಲಾಟರಿ\s+ಗೆದ್ದಿದ್ದೀರಿ|ಬಹುಮಾನ)'
    ]
    if any(re.search(pat, lower) for pat in lottery_patterns):
        score += 40
        red_flags.append("Unsolicited lottery, prize, or government scheme reward claim.")
        tactics.add(TacticEnum.REWARD)
        scam_types.append((ScamTypeEnum.LOTTERY, 40))

    # 8. Mild Generic Urgency (Keep score low if lone signal)
    mild_urgency_patterns = [
        r'\b(?:urgent|immediately|act\s+fast|hurry|valid\s+only\s+today|within\s+24\s+hrs)\b',
        r'(?:तुरंत|जल्दी\s+करें|ತಕ್ಷಣ)'
    ]
    if any(re.search(pat, lower) for pat in mild_urgency_patterns) and TacticEnum.URGENCY not in tactics:
        score += 15
        tactics.add(TacticEnum.URGENCY)
        if not red_flags:
            red_flags.append("Urgent time pressure encouraging quick reaction without verification.")

    # URL flags bonus
    if url_flags:
        score += 20 * len(url_flags)

    # Synergy Bonus if 2+ distinct tactics are present
    if len(tactics) >= 2:
        score += 15

    # If it is a confirmed defensive warning with no other malicious triggers, score is 0
    if is_defensive and not url_flags and not has_critical_flag:
        score = 0
        tactics.clear()
        red_flags.clear()
        scam_types.clear()

    # Cap score
    score = min(score, 100)

    # Determine primary scam type
    if scam_types:
        scam_types.sort(key=lambda x: x[1], reverse=True)
        primary_type = scam_types[0][0]
    elif url_flags:
        primary_type = ScamTypeEnum.PHISHING
    elif score > 0:
        primary_type = ScamTypeEnum.OTHER
    else:
        primary_type = ScamTypeEnum.SAFE

    return score, primary_type, red_flags, list(tactics), has_critical_flag
