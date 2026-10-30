export const translations = {
  en: {
    app_title: "Scam Shield",
    app_tagline: "Pause and check before responding to suspicious messages, calls, or payment requests.",
    system_status: "Active Engine",
    theme_toggle_dark: "Switch to light theme",
    theme_toggle_light: "Switch to dark theme",
    tabs: {
      sms: "SMS & Message",
      call: "Phone Call",
      payment: "Payment Request"
    },
    sms_placeholder: "Paste the suspicious SMS, WhatsApp message, email, or web link here...",
    sms_helper: "Include full text, URLs, or phone numbers mentioned in the message.",
    call_instruction: "Select all warning signs that occurred during the call:",
    call_signals: {
      arrest: "Threatened arrest, court summons, or police case (Digital Arrest)",
      money: "Demanded money transfer or payment to clear penalties/fees",
      otp: "Asked for secret OTP, UPI PIN, bank details, or password",
      urgency: "Pressured you to act urgently or warned you not to consult family",
      authority: "Claimed to be CBI, Police, Customs, Bank, TRAI, or Courier"
    },
    call_notes_placeholder: "Optional notes: What did the caller say? What company or department did they claim to be?",
    payment_placeholder: "Paste or describe the payment request, UPI collect request, QR code message, or refund offer...",
    payment_helper: "Include requested amounts, UPI handles, or scanning instructions.",
    samples_label: "Try a realistic test sample:",
    samples: {
      safe_otp: "Bank OTP Advisory (Legitimate Safe Alert)",
      digital_arrest: "Digital Arrest (Police Threat Scam)",
      qr_scam: "QR Code Cashback (UPI Reversal Scam)",
      job_scam: "Part-time Job (Telegram Fee Scam)"
    },
    char_count: "characters",
    clear_btn: "Clear",
    analyze_btn: "Analyze Risk",
    analyzing_btn: "Analyzing Message...",
    result_title: "Analysis Verdict",
    risk_score_label: "Calculated Risk Score",
    risk_bands: {
      safe: "Low Risk / Likely Safe",
      suspicious: "Moderate Risk / Suspicious",
      danger: "High Risk / Danger"
    },
    scam_types: {
      safe: "Legitimate Communication",
      phishing: "Credential Phishing",
      lottery: "Lottery & Prize Scam",
      job_scam: "Fake Employment Offer",
      bank_fraud: "Bank & KYC Threat",
      payment_scam: "UPI & Payment Reversal Scam",
      authority_impersonation: "Law Enforcement Impersonation",
      other: "Unverified Suspicious Message"
    },
    section_flags: "Identified Warning Signs",
    section_explanation: "Plain Language Breakdown",
    section_safe_action: "Recommended Safe Next Step",
    section_checklist: "Safety Action Checklist",
    check_another_btn: "Check Another Message",
    disclaimer: "Scam Shield provides automated heuristic risk guidance, not a legal guarantee. Always verify financial or legal matters directly with your bank, local police station, or official service provider.",
    errors: {
      empty: "Please enter a message, select call signals, or describe a payment request.",
      too_long: "Input exceeds maximum limit of 5,000 characters.",
      rate_limited: "Analysis rate limit reached. Please wait a minute before checking another message.",
      network: "Unable to reach Scam Shield engine. Please check your connection.",
      server: "An unexpected error occurred during analysis. Please try again."
    }
  },
  hi: {
    app_title: "स्कैम शील्ड (Scam Shield)",
    app_tagline: "संदिग्ध संदेश, कॉल या भुगतान अनुरोध पर जवाब देने से पहले रुकें और जांचें।",
    system_status: "सक्रिय सुरक्षा",
    theme_toggle_dark: "लाइट थीम पर बदलें",
    theme_toggle_light: "डार्क थीम पर बदलें",
    tabs: {
      sms: "एसएमएस और संदेश",
      call: "फोन कॉल",
      payment: "भुगतान अनुरोध"
    },
    sms_placeholder: "संदिग्ध एसएमएस, व्हाट्सएप संदेश, ईमेल या वेब लिंक यहाँ पेस्ट करें...",
    sms_helper: "संदेश में उल्लिखित पूरा टेक्स्ट, लिंक या फोन नंबर शामिल करें।",
    call_instruction: "कॉल के दौरान आए सभी चेतावनी संकेतों को चुनें:",
    call_signals: {
      arrest: "गिरफ्तारी, कोर्ट समन या पुलिस केस की धमकी दी (डिजिटल अरेस्ट)",
      money: "जुर्माना या फीस हटाने के नाम पर तुरंत पैसे ट्रांसफर करने की मांग की",
      otp: "गोपनीय ओटीपी, यूपीआई पिन, बैंक विवरण या पासवर्ड मांगा",
      urgency: "तुरंत कार्रवाई करने का दबाव डाला या परिवार से बात न करने को कहा",
      authority: "सीबीआई, पुलिस, कस्टम्स, बैंक, ट्राई या कूरियर अधिकारी होने का दावा किया"
    },
    call_notes_placeholder: "वैकल्पिक विवरण: कॉलर ने क्या कहा? उसने खुद को किस विभाग या कंपनी का बताया?",
    payment_placeholder: "भुगतान अनुरोध, यूपीआई कलेक्ट रिक्वेस्ट, क्यूआर कोड संदेश या रिफंड ऑफर यहाँ लिखें...",
    payment_helper: "मांगी गई राशि, यूपीआई आईडी या क्यूआर स्कैनिंग निर्देश शामिल करें।",
    samples_label: "परीक्षण हेतु उदाहरण:",
    samples: {
      safe_otp: "बैंक ओटीपी सूचना (सुरक्षित अलर्ट)",
      digital_arrest: "डिजिटल अरेस्ट (पुलिस धमकी स्कैम)",
      qr_scam: "क्यूआर कैशबैक (यूपीआई फ्रॉड)",
      job_scam: "पार्ट-टाइम जॉब (टेलीग्राम स्कैम)"
    },
    char_count: "अक्षर",
    clear_btn: "साफ़ करें",
    analyze_btn: "जोखिम जांचें",
    analyzing_btn: "जांच जारी है...",
    result_title: "जांच का परिणाम",
    risk_score_label: "अनुमानित जोखिम स्कोर",
    risk_bands: {
      safe: "कम जोखिम / संभवतः सुरक्षित",
      suspicious: "मध्यम जोखिम / संदिग्ध",
      danger: "उच्च जोखिम / गंभीर खतरा"
    },
    scam_types: {
      safe: "वैध संचार",
      phishing: "ओटीपी व क्रेडेंशियल चोरी (फ़िशिंग)",
      lottery: "फर्जी लॉटरी व इनाम",
      job_scam: "नकली नौकरी का झांसा",
      bank_fraud: "बैंक व केवाईसी धमकी",
      payment_scam: "यूपीआई व क्यूआर कोड धोखा",
      authority_impersonation: "पुलिस व सरकारी अधिकारी का झूठा रूप",
      other: "संदिग्ध संचार"
    },
    section_flags: "पाए गए चेतावनी संकेत",
    section_explanation: "सरल भाषा में विश्लेषण",
    section_safe_action: "सुरक्षित अगला कदम",
    section_checklist: "सुरक्षा चेकलिस्ट",
    check_another_btn: "दूसरा संदेश जांचें",
    disclaimer: "स्कैम शील्ड स्वचालित मार्गदर्शन प्रदान करता है, कोई कानूनी गारंटी नहीं। वित्तीय या कानूनी मामलों में हमेशा अपने बैंक या आधिकारिक हेल्पलाइन से पुष्टि करें।",
    errors: {
      empty: "कृपया संदेश दर्ज करें, कॉल संकेत चुनें, या भुगतान अनुरोध लिखें।",
      too_long: "इनपुट 5,000 अक्षरों की अधिकतम सीमा से अधिक है।",
      rate_limited: "अनुरोध सीमा पार हो गई है। कृपया एक मिनट बाद पुनः प्रयास करें।",
      network: "सर्वर से संपर्क नहीं हो पा रहा है। कृपया अपना इंटरनेट जांचें।",
      server: "जांच के दौरान त्रुटि हुई। कृपया पुनः प्रयास करें।"
    }
  },
  kn: {
    app_title: "ಸ್ಕ್ಯಾಮ್ ಶೀಲ್ಡ್ (Scam Shield)",
    app_tagline: "ಅನುಮಾನಾಸ್ಪದ ಸಂದೇಶ, ಕರೆ ಅಥವಾ ಪಾವತಿ ವಿನಂತಿಗೆ ಉತ್ತರಿಸುವ ಮುನ್ನ ನಿಲ್ಲಿಸಿ ಪರಿಶೀಲಿಸಿ.",
    system_status: "ಸಕ್ರಿಯ ರಕ್ಷಣೆ",
    theme_toggle_dark: "ಬೆಳಕಿನ ಥೀಮ್‌ಗೆ ಬದಲಾಯಿಸಿ",
    theme_toggle_light: "ಡಾರ್ಕ್ ಥೀಮ್‌ಗೆ ಬದಲಾಯಿಸಿ",
    tabs: {
      sms: "ಎಸ್‌ಎಂಎಸ್ ಮತ್ತು ಸಂದೇಶ",
      call: "ಫೋನ್ ಕರೆ",
      payment: "ಪಾವತಿ ವಿನಂತಿ"
    },
    sms_placeholder: "ಅನುಮಾನಾಸ್ಪದ ಎಸ್‌ಎಂಎಸ್, ವಾಟ್ಸಾಪ್ ಸಂದೇಶ, ಇಮೇಲ್ ಅಥವಾ ಲಿಂಕ್ ಅನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ...",
    sms_helper: "ಸಂದೇಶದಲ್ಲಿ ಬಂದ ಪೂರ್ಣ ಮಾಹಿತಿ, ಲಿಂಕ್ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಸೇರಿಸಿ.",
    call_instruction: "ಕರೆಯ ಸಮಯದಲ್ಲಿ ಕಂಡುಬಂದ ಎಲ್ಲಾ ಎಚ್ಚರಿಕೆ ಚಿಹ್ನೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    call_signals: {
      arrest: "ಬಂಧನ, ನ್ಯಾಯಾಲಯದ ಸಮನ್ಸ್ ಅಥವಾ ಪೊಲೀಸ್ ಕೇಸ್ ಬೆದರಿಕೆ (ಡಿಜಿಟಲ್ ಬಂಧನ)",
      money: "ದಂಡ ಅಥವಾ ಶುಲ್ಕ ರದ್ದುಪಡಿಸಲು ತಕ್ಷಣ ಹಣ ವರ್ಗಾವಣೆ ಮಾಡಲು ಒತ್ತಾಯಿಸಿದರು",
      otp: "ರಹಸ್ಯ ಓಟಿಪಿ, ಯುಪಿಐ ಪಿನ್, ಬ್ಯಾಂಕ್ ವಿವರ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಕೇಳಿದರು",
      urgency: "ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳಲು ಒತ್ತಡ ಹೇರಿದರು ಅಥವಾ ಕುಟುಂಬದವರೊಂದಿಗೆ ಮಾತನಾಡದಂತೆ ತಡೆದರು",
      authority: "ಸಿಬಿಐ, ಪೊಲೀಸ್, ಕಸ್ಟಮ್ಸ್, ಬ್ಯಾಂಕ್ ಅಥವಾ ಕೊರಿಯರ್ ಅಧಿಕಾರಿ ಎಂದು ಹೇಳಿಕೊಂಡರು"
    },
    call_notes_placeholder: "ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ: ಕರೆ ಮಾಡಿದವರು ಏನು ಹೇಳಿದರು? ಯಾವ ಸಂಸ್ಥೆಯ ಹೆಸರನ್ನು ಹೇಳಿದರು?",
    payment_placeholder: "ಹಣದ ವಿನಂತಿ, ಯುಪಿಐ ಕಲೆಕ್ಟ್ ರಿಕ್ವೆಸ್ಟ್, ಕ್ಯೂಆರ್ ಕೋಡ್ ಅಥವಾ ರಿಫಂಡ್ ವಿವರ ನಮೂದಿಸಿ...",
    payment_helper: "ಹಣದ ಮೊತ್ತ, ಯುಪಿಐ ಐಡಿ ಅಥವಾ ಸ್ಕ್ಯಾನಿಂಗ್ ಸೂಚನೆಗಳನ್ನು ಸೇರಿಸಿ.",
    samples_label: "ಪರೀಕ್ಷಾ ಮಾದರಿಗಳು:",
    samples: {
      safe_otp: "ಬ್ಯಾಂಕ್ ಓಟಿಪಿ ಎಚ್ಚರಿಕೆ (ಸುರಕ್ಷಿತ ಮಾದರಿ)",
      digital_arrest: "ಡಿಜಿಟಲ್ ಬಂಧನ (ನಕಲಿ ಪೊಲೀಸ್ ವಂಚನೆ)",
      qr_scam: "ಕ್ಯೂಆರ್ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ (ಯುಪಿಐ ವಂಚನೆ)",
      job_scam: "ಭಾಗಶಃ ಕೆಲಸ (ಟೆಲಿಗ್ರಾಮ್ ವಂಚನೆ)"
    },
    char_count: "ಅಕ್ಷರಗಳು",
    clear_btn: "ತೆರವುಗೊಳಿಸಿ",
    analyze_btn: "ಅಪಾಯ ಪರಿಶೀಲಿಸಿ",
    analyzing_btn: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    result_title: "ಪರಿಶೀಲನಾ ಫಲಿತಾಂಶ",
    risk_score_label: "ಅಪಾಯದ ಅಂಕ",
    risk_bands: {
      safe: "ಕಡಿಮೆ ಅಪಾಯ / ಸುರಕ್ಷಿತವಾಗಿದೆ",
      suspicious: "ಮಧ್ಯಮ ಅಪಾಯ / ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ",
      danger: "ಹೆಚ್ಚಿನ ಅಪಾಯ / ಗಂಭೀರ ವಂಚನೆ"
    },
    scam_types: {
      safe: "ಅಧಿಕೃತ ಸಂವಹನ",
      phishing: "ಓಟಿಪಿ ಹಾಗೂ ಪಾಸ್‌ವರ್ಡ್ ಕಳ್ಳತನ (ಫಿಶಿಂಗ್)",
      lottery: "ನಕಲಿ ಲಾಟರಿ ಹಾಗೂ ಬಹುಮಾನ",
      job_scam: "ನಕಲಿ ಉದ್ಯೋಗದ ಆಮಿಷ",
      bank_fraud: "ಬ್ಯಾಂಕ್ ಹಾಗೂ ಕೆವೈಸಿ ಬೆದರಿಕೆ",
      payment_scam: "ಯುಪಿಐ ಹಾಗೂ ಕ್ಯೂಆರ್ ಕೋಡ್ ವಂಚನೆ",
      authority_impersonation: "ಪೊಲೀಸ್ ಅಥವಾ ಅಧಿಕಾರಿಯ ಸೋಗು",
      other: "ಅನುಮಾನಾಸ್ಪದ ಸಂವಹನ"
    },
    section_flags: "ಪತ್ತೆಯಾದ ಎಚ್ಚರಿಕೆ ಸಂಕೇತಗಳು",
    section_explanation: "ಸರಳ ವಿವರಣೆ",
    section_safe_action: "ಸುರಕ್ಷಿತ ಮುಂದಿನ ಕ್ರಮ",
    section_checklist: "ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು",
    check_another_btn: "ಮತ್ತೊಂದು ಸಂದೇಶ ಪರಿಶೀಲಿಸಿ",
    disclaimer: "ಸ್ಕ್ಯಾಮ್ ಶೀಲ್ಡ್ ಸ್ವಯಂಚಾಲಿತ ಮಾರ್ಗದರ್ಶನವನ್ನು ನೀಡುತ್ತದೆ, ಯಾವುದೇ ಕಾನೂನು ಖಾತರಿಯಲ್ಲ. ಹಣಕಾಸಿನ ಅಥವಾ ತುರ್ತು ವಿಷಯಗಳಲ್ಲಿ ಯಾವಾಗಲೂ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    errors: {
      empty: "ದಯವಿಟ್ಟು ಸಂದೇಶ ನಮೂದಿಸಿ, ಕರೆ ಸಂಕೇತಗಳನ್ನು ಆರಿಸಿ ಅಥವಾ ಪಾವತಿ ವಿವರ ನೀಡಿ.",
      too_long: "ಇನ್‌ಪುಟ್ 5,000 ಅಕ್ಷರಗಳ ಮಿತಿಯನ್ನು ಮೀರಿದೆ.",
      rate_limited: "ವಿನಂತಿಗಳ ಮಿತಿ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
      network: "ಸರ್ವರ್ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ಪರಿಶೀಲಿಸಿ.",
      server: "ಪರಿಶೀಲನೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ."
    }
  }
};
