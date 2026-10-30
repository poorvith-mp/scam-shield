// Edge-native multilingual analysis pipeline & static asset router for Cloudflare Workers

const DEFENSIVE_OTP_PATTERNS = [
  /(?:do\s+not|never|don'?t)\s+share\s+(?:this\s+|your\s+)?(?:otp|pin|password|cvv)/i,
  /bank\s+never\s+asks\s+for\s+(?:otp|pin|password)/i,
  /bank\s+officials?\s+never\s+ask/i,
  /kisi\s+se\s+(?:bhi\s+)?(?:otp|pin)\s+share\s+na\s+kare/i,
  /kisi\s+ke\s+saath\s+saajha\s+na\s+kare/i,
  /kisi\s+ko\s+na\s+bataye/i,
  /yarondigu\s+hanchikollabedi/i,
  /ಯಾರೊಂದಿಗೂ\s+ಹಂಚಿಕೊಳ್ಳಬೇಡಿ/i,
  /ಸಾಜಾ\s+ಮಾಡಬೇಡಿ/i,
  /साझा\s+न\s+करें/i
];

const LOCALIZED_CONTENT = {
  en: {
    safe_headline: "Low Risk / Likely Safe",
    safe_body: "No prominent scam patterns or malicious solicitations were detected in this message.",
    safe_action: "No immediate threat found. Always stay cautious and never share OTPs or passwords.",
    safe_bullets: [
      "Verify sender identity if requesting confidential information.",
      "Never share bank credentials or OTPs under any circumstances."
    ],
    suspicious_headline: "Moderate Risk / Proceed with Caution",
    suspicious_body: "This message exhibits suspicious indicators such as unverified links, unsolicited rewards, or artificial urgency.",
    suspicious_action: "Do not click links or make payments. Verify directly via an official app or website.",
    suspicious_bullets: [
      "Do not call phone numbers provided inside the message.",
      "Cross-check directly through the official website or verified customer care number."
    ],
    danger_headline: "High Risk / Potential Scam Detected",
    danger_body: "Critical scam tactics detected, such as credential theft, fake authority threats, or payment deception.",
    danger_action: "Do NOT share OTP/PIN, transfer money, or click links. Block the sender immediately.",
    danger_bullets: [
      "Banks and law enforcement never ask for OTPs or demand immediate online payment.",
      "Block sender and report to the National Cyber Crime Portal (1930 or cybercrime.gov.in)."
    ]
  },
  hi: {
    safe_headline: "कम जोखिम / संभवतः सुरक्षित",
    safe_body: "इस संदेश में कोई स्पष्ट धोखाधड़ी या संदिग्ध संकेत नहीं मिले हैं।",
    safe_action: "कोई खतरा नहीं दिखा। फिर भी सतर्क रहें और कभी भी ओटीपी या पासवर्ड साझा न करें।",
    safe_bullets: [
      "गोपनीय जानकारी मांगने पर प्रेषक की पहचान सत्यापित करें।",
      "किसी भी परिस्थिति में बैंक विवरण या ओटीपी साझा न करें।"
    ],
    suspicious_headline: "मध्यम जोखिम / सावधानी बरतें",
    suspicious_body: "इस संदेश में संदिग्ध संकेत जैसे असत्यापित लिंक या अनुचित जल्दबाजी पाई गई है।",
    suspicious_action: "लिंक पर क्लिक न करें और कोई भुगतान न करें। आधिकारिक ऐप या वेबसाइट से पुष्टि करें।",
    suspicious_bullets: [
      "संदेश में दिए गए फोन नंबर पर कॉल न करें।",
      "आधिकारिक वेबसाइट या बैंक हेल्पलाइन नंबर से सीधे जांच करें।"
    ],
    danger_headline: "उच्च जोखिम / धोखाधड़ी का गंभीर खतरा",
    danger_body: "संदेश में गंभीर धोखे के संकेत मिले हैं, जैसे ओटीपी चोरी, डिजिटल अरेस्ट या फर्जी बैंक धमकी।",
    danger_action: "ओटीपी/पिन कभी साझा न करें, पैसे न भेजें। प्रेषक को तुरंत ब्लॉक करें।",
    danger_bullets: [
      "बैंक या पुलिस कभी भी फोन पर ओटीपी या तुरंत पैसे की मांग नहीं करते।",
      "नंबर ब्लॉक करें और राष्ट्रीय साइबर अपराध पोर्टल (1930) पर शिकायत दर्ज करें।"
    ]
  },
  kn: {
    safe_headline: "ಕಡಿಮೆ ಅಪಾಯ / ಸುರಕ್ಷಿತವಾಗಿದೆ",
    safe_body: "ಈ ಸಂದೇಶದಲ್ಲಿ ಯಾವುದೇ ಸ್ಪಷ್ಟ ವಂಚನೆ ಅಥವಾ ಅನುಮಾನಾಸ್ಪದ ಸಂಕೇತಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.",
    safe_action: "ಯಾವುದೇ ಬೆದರಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ. ಯಾವಾಗಲೂ ಜಾಗರೂಕರಾಗಿರಿ ಮತ್ತು ಓಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
    safe_bullets: [
      "ಗೌಪ್ಯ ಮಾಹಿತಿ ಕೇಳಿದರೆ ಕಳುಹಿಸುವವರ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಿ.",
      "ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಬ್ಯಾಂಕ್ ವಿವರ ಅಥವಾ ಓಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ."
    ],
    suspicious_headline: "ಮಧ್ಯಮ ಅಪಾಯ / ಎಚ್ಚರಿಕೆಯಿಂದ ಮುಂದುವರಿಯಿರಿ",
    suspicious_body: "ಈ ಸಂದೇಶದಲ್ಲಿ ಪರಿಶೀಲಿಸದ ಲಿಂಕ್ ಅಥವಾ ಅನಗತ್ಯ ತುರ್ತಿನಂತಹ ಅನುಮಾನಾಸ್ಪದ ಅಂಶಗಳಿವೆ.",
    suspicious_action: "ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಅಥವಾ ಹಣ ಪಾವತಿಸಬೇಡಿ. ಅಧಿಕೃತ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ.",
    suspicious_bullets: [
      "ಸಂದೇಶದಲ್ಲಿ ನೀಡಲಾದ ಫೋನ್ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಬೇಡಿ.",
      "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಗ್ರಾಹಕ ಸಹಾಯವಾಣಿ ಮೂಲಕ ನೇರವಾಗಿ ಪರಿಶೀಲಿಸಿ."
    ],
    danger_headline: "ಹೆಚ್ಚಿನ ಅಪಾಯ / ಗಂಭೀರ ವಂಚನೆ ಪತ್ತೆಯಾಗಿದೆ",
    danger_body: "ಸಂದೇಶದಲ್ಲಿ ಓಟಿಪಿ ಕಳ್ಳತನ, ಡಿಜಿಟಲ್ ಬಂಧನ ಅಥವಾ ನಕಲಿ ಬೆದರಿಕೆಯಂತಹ ವಂಚನೆಯ ಲಕ್ಷಣಗಳಿವೆ.",
    danger_action: "ಓಟಿಪಿ/ಪಿನ್ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ, ಹಣ ಕಳುಹಿಸಬೇಡಿ. ಕಳುಹಿಸಿದವರನ್ನು ತಕ್ಷಣ ಬ್ಲಾಕ್ ಮಾಡಿ.",
    danger_bullets: [
      "ಬ್ಯಾಂಕ್ ಅಥವಾ ಪೊಲೀಸರು ಎಂದಿಗೂ ಫೋನ್‌ನಲ್ಲಿ ಓಟಿಪಿ ಅಥವಾ ತಕ್ಷಣದ ಹಣ ಪಾವತಿಗೆ ಕೇಳುವುದಿಲ್ಲ.",
      "ಕರೆ/ಸಂದೇಶ ಬ್ಲಾಕ್ ಮಾಡಿ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ಸಹಾಯವಾಣಿಗೆ (1930) ದೂರು ನೀಡಿ."
    ]
  }
};

function detectInputLanguage(text) {
  let devanagariCount = 0;
  let kannadaCount = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 0x0900 && code <= 0x097F) devanagariCount++;
    if (code >= 0x0C80 && code <= 0x0CFF) kannadaCount++;
  }
  if (kannadaCount > 3) return 'kn';
  if (devanagariCount > 3) return 'hi';
  return 'en';
}

function evaluateEdgeRules(text) {
  const isDefensive = DEFENSIVE_OTP_PATTERNS.some(p => p.test(text));
  let score = 0;
  const redFlags = [];
  const tactics = new Set();
  const scamTypes = [];
  let hasCriticalFlag = false;

  // 1. Credential theft (CRITICAL)
  if (!isDefensive) {
    const otpDemands = [
      /\b(?:share|send|tell|give)\s+(?:me\s+)?(?:your\s+)?(?:the\s+)?(?:otp|pin|password|cvv)\b/i,
      /\b(?:otp|pin|password)\s+(?:bhejo|bataye|bhejiye|darj\s+kare|kodi|thilisi)\b/i,
      /(?:ओटीपी|पिन|पासवर्ड)\s+(?:बताएं|भेजें|दर्ज\s+करें)/,
      /(?:ಓಟಿಪಿ|ಪಿನ್|ಪಾಸ್ವರ್ಡ್)\s+(?:ನೀಡಿ|ದಾಖಲಿಸಿ|ತಿಳಿಸಿ)/
    ];
    if (otpDemands.some(p => p.test(text))) {
      score += 65;
      hasCriticalFlag = true;
      redFlags.push("Explicit request to share secret OTP, UPI PIN, or password.");
      tactics.add("credential_phishing");
      scamTypes.push({ type: "phishing", weight: 65 });
    }
  }

  // 2. Digital Arrest / Law Enforcement (CRITICAL)
  const authorityPatterns = [
    /\b(?:cbi|police|customs|court|rbi|trai|narcotics)\b.*?\b(?:arrest|warrant|seized|illegal|jail|case\s+filed|drugs)\b/i,
    /\bdigital\s+arrest\b/i,
    /\bparcel\s+(?:held|seized|intercepted)\s+by\s+customs\b/i,
    /\bpolice\s+(?:girftari|action|warrant)\b/i,
    /(?:डिजिटल\s+अरेस्ट|गिरफ्तारी\s+वारंट|पुलिस\s+कार्रवाई)/,
    /(?:ಡಿಜಿಟಲ್\s+ಬಂಧನ|ಪೊಲೀಸ್\s+ಕ್ರಮ|ಬಂಧನ\s+ವಾರಂಟ್)/
  ];
  if (authorityPatterns.some(p => p.test(text))) {
    score += 65;
    hasCriticalFlag = true;
    redFlags.push("Threat of police arrest, court action, or customs parcel seizure (Authority Impersonation).");
    tactics.add("authority");
    tactics.add("loss_aversion");
    scamTypes.push({ type: "authority_impersonation", weight: 65 });
  }

  // 3. Bank / KYC / Electricity Threat
  const threatPatterns = [
    /\b(?:account|pan|kyc|sim|card)\s+(?:will\s+be\s+)?(?:blocked|suspended|deactivated|frozen|terminated)\b/i,
    /\belectricity\s+(?:power\s+)?will\s+be\s+(?:disconnected|cutoff|cut\s+off)\s+(?:tonight|today)\b/i,
    /\bupdate\s+(?:your\s+)?(?:pan|kyc)\s+(?:immediately|urgent|within\s+\d+\s+hours?)\b/i,
    /\b(?:khata|bijli)\s+(?:band|kat|stagit)\b/i,
    /(?:बिजली\s+काट\s+दी\s+जाएगी|खाता\s+बंद|केवाईसी\s+अपडेट)/,
    /(?:ವಿದ್ಯುತ್\s+ಕಡಿತ|ಖಾತೆ\s+ಸ್ಥಗಿತ|ಕೆವೈಸಿ\s+ನವೀಕರಣ)/
  ];
  if (threatPatterns.some(p => p.test(text))) {
    score += 50;
    redFlags.push("Fear-inducing deadline threatening bank block, power cutoff, or SIM deactivation.");
    tactics.add("urgency");
    tactics.add("loss_aversion");
    scamTypes.push({ type: "bank_fraud", weight: 50 });
  }

  // 4. QR Code / UPI Collect Trick ("Scan QR to receive money")
  const upiTrickPatterns = [
    /\bscan\s+(?:this\s+)?qr\s+(?:code\s+)?to\s+(?:receive|accept|credit|get|claim)\b/i,
    /\bapprove\s+(?:upi\s+)?collect\s+request\s+to\s+receive\b/i,
    /\benter\s+(?:your\s+)?(?:upi\s+)?pin\s+to\s+(?:receive|claim|get|credit)\b/i,
    /(?:पैसे\s+पाने\s+के\s+लिए\s+क्यूआर\s+स्कैन\s+करें|पिन\s+दर्ज\s+करें)/,
    /(?:ಹಣ\s+ಸ್ವೀಕರಿಸಲು\s+ಕ್ಯೂಆರ್\s+ಸ್ಕ್ಯಾನ್\s+ಮಾಡಿ|ಪಿನ್\s+ನಮೂದಿಸಿ)/
  ];
  if (upiTrickPatterns.some(p => p.test(text))) {
    score += 70;
    hasCriticalFlag = true;
    redFlags.push("UPI reversal deception: scanning QR or entering PIN always SENDS money, never receives it.");
    tactics.add("credential_phishing");
    tactics.add("reward");
    scamTypes.push({ type: "payment_scam", weight: 70 });
  }

  // 5. Job Scam
  const jobPatterns = [
    /\b(?:part\s*time|work\s+from\s+home)\s+job\b.*?\b(?:daily|earn|salary)\s+(?:rs\.?|inr|\$)?\s*\d+/i,
    /\blike\s+youtube\s+videos\s+and\s+earn\b/i,
    /\btelegram\s+task\b/i,
    /\bpay\s+(?:registration|security|processing|training)\s+fee\b/i,
    /(?:घर\s+बैठे\s+कमाएं|पार्ट\s+टाइम\s+जॉब|टेलीग्राम\s+टास्क)/,
    /(?:ಮನೆಯಲ್ಲೇ\s+ಕುಳಿತು\s+ಗಳಿಸಿ|ಭಾಗಶಃ\s+ಸಮಯದ\s+ಉದ್ಯೋಗ)/
  ];
  if (jobPatterns.some(p => p.test(text))) {
    score += 45;
    redFlags.push("Unrealistic part-time job offer requiring fee payment or Telegram tasks.");
    tactics.add("reward");
    scamTypes.push({ type: "job_scam", weight: 45 });
  }

  // 6. Lottery / Prize
  const lotteryPatterns = [
    /\bcongratulations.*?\b(?:won|selected|winner)\b.*?(?:lakh|crore|prize|lottery|reward|cash)\b/i,
    /\bkbc\s+lottery\b/i,
    /\bfree\s+(?:laptop|recharge|scholarship)\s+scheme\b/i,
    /(?:बधाई\s+हो|लॉटरी\s+जीती|इनाम)/,
    /(?:ಅಭಿನಂದನೆಗಳು|ಲಾಟರಿ\s+ಗೆದ್ದಿದ್ದೀರಿ|ಬಹುಮಾನ)/
  ];
  if (lotteryPatterns.some(p => p.test(text))) {
    score += 40;
    redFlags.push("Unsolicited lottery, prize, or government scheme reward claim.");
    tactics.add("reward");
    scamTypes.push({ type: "lottery", weight: 40 });
  }

  // Synergy bonus
  if (tactics.size >= 2) {
    score += 15;
  }

  // If confirmed defensive warning and no other critical fraud flags, score is 0
  if (isDefensive && !hasCriticalFlag) {
    score = 0;
    tactics.clear();
    redFlags.length = 0;
    scamTypes.length = 0;
  }

  score = Math.min(100, score);

  let primaryType = "safe";
  if (scamTypes.length > 0) {
    scamTypes.sort((a, b) => b.weight - a.weight);
    primaryType = scamTypes[0].type;
  } else if (score > 0) {
    primaryType = "other";
  }

  return { score, primaryType, redFlags, tactics: Array.from(tactics) };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // 1. Edge API Routes
    if (url.pathname.startsWith("/api/v1/")) {
      // If an external backend is configured via env, proxy to it
      if (env?.BACKEND_API_URL) {
        const targetUrl = new URL(url.pathname + url.search, env.BACKEND_API_URL);
        return fetch(targetUrl.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined
        });
      }

      // Built-in Edge API Implementation
      if (url.pathname === "/api/v1/health") {
        return jsonResponse({
          status: "ok",
          service: "scam-shield",
          version: "1.0.0"
        });
      }

      if (url.pathname === "/api/v1/meta") {
        return jsonResponse({
          service: "scam-shield",
          version: "1.0.0",
          supported_languages: ["en", "hi", "kn"],
          max_message_length: 5000,
          rate_limit_per_minute: 60,
          input_modes: ["sms", "call", "payment"],
          runtime: "cloudflare-edge"
        });
      }

      if (url.pathname === "/api/v1/analyze") {
        if (request.method !== "POST") {
          return jsonResponse({ error: "method_not_allowed", message: "Only POST method is accepted" }, 405);
        }

        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "validation_error", message: "Invalid JSON payload" }, 400);
        }

        const message = (body?.message || "").trim();
        if (!message) {
          return jsonResponse({ error: "validation_error", message: "Input validation failed: Message cannot be empty." }, 400);
        }

        if (message.length > 5000) {
          return jsonResponse({ error: "validation_error", message: "Input exceeds maximum limit of 5,000 characters." }, 400);
        }

        const detectedLang = detectInputLanguage(message);
        const targetLang = ["en", "hi", "kn"].includes(body?.language) ? body.language : detectedLang;

        const { score, primaryType, redFlags, tactics } = evaluateEdgeRules(message);

        let verdict = "safe";
        let verdictEmoji = "🟢";
        if (score > 65) {
          verdict = "danger";
          verdictEmoji = "🔴";
        } else if (score > 30) {
          verdict = "suspicious";
          verdictEmoji = "🟡";
        }

        const loc = LOCALIZED_CONTENT[targetLang] || LOCALIZED_CONTENT.en;
        let headline, explanation, safeAction, bullets;

        if (verdict === "safe") {
          headline = loc.safe_headline;
          explanation = loc.safe_body;
          safeAction = loc.safe_action;
          bullets = loc.safe_bullets;
        } else if (verdict === "suspicious") {
          headline = loc.suspicious_headline;
          explanation = loc.suspicious_body;
          safeAction = loc.suspicious_action;
          bullets = loc.suspicious_bullets;
        } else {
          headline = loc.danger_headline;
          explanation = loc.danger_body;
          safeAction = loc.danger_action;
          bullets = loc.danger_bullets;
        }

        return jsonResponse({
          request_id: crypto.randomUUID(),
          verdict,
          verdict_emoji: verdictEmoji,
          risk_score: score,
          scam_type: primaryType,
          red_flags: redFlags,
          explanation,
          safe_action: safeAction,
          tactics,
          language_detected: detectedLang,
          language_response: targetLang,
          display: {
            headline,
            body: explanation,
            bullets
          }
        });
      }

      return jsonResponse({ error: "not_found", message: "Endpoint not found" }, 404);
    }

    // 2. Static Assets Serving with Cache Control
    const response = await env.ASSETS.fetch(request);
    const newHeaders = new Headers(response.headers);
    const contentType = newHeaders.get("content-type") || "";

    if (contentType.includes("text/html") || url.pathname === "/" || url.pathname === "/index.html") {
      newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
      newHeaders.set("Pragma", "no-cache");
      newHeaders.set("Expires", "0");
    } else {
      newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
