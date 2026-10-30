import uuid
import hashlib
import time
import logging
from typing import Dict, Any

from ..schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    VerdictEnum,
    ScamTypeEnum,
    TacticEnum,
    DisplayContent
)
from .indicators import sanitize_text, extract_indicators
from .language import detect_input_language
from .rules import evaluate_rules
from .ai_analyzer import run_ai_analyzer
from .localizer import localize_verdict_content

logger = logging.getLogger("scam_shield.pipeline")

async def analyze_message_pipeline(request: AnalyzeRequest) -> AnalyzeResponse:
    start_time = time.time()
    request_id = str(uuid.uuid4())

    # 1. Sanitize input
    cleaned_text = sanitize_text(request.message)

    # 2. Extract indicators
    urls, url_flags, phone_numbers = extract_indicators(cleaned_text)

    # Merge client metadata if provided
    if request.metadata:
        if request.metadata.urls:
            urls = list(set(urls + request.metadata.urls))
        if request.metadata.phone_numbers:
            phone_numbers = list(set(phone_numbers + request.metadata.phone_numbers))

    # 3. Detect and resolve languages
    detected_lang = detect_input_language(cleaned_text)
    # Requested language overrides detected language for the response
    target_lang = request.language if request.language in ["en", "hi", "kn"] else detected_lang

    # 4. Evaluate deterministic multilingual rules
    rule_score, primary_type, red_flags, tactics, has_critical_flag = evaluate_rules(cleaned_text, url_flags)

    # 5. Optional AI Analyzer with safety floor
    ai_result = await run_ai_analyzer(cleaned_text, target_lang)
    final_score = rule_score
    explanation = None
    safe_action = None
    headline = None
    bullets = None

    if ai_result:
        ai_score = int(ai_result.get("risk_score", rule_score))
        # Composite score
        merged = int((rule_score * 0.5) + (ai_score * 0.5))
        # Safety floor: Critical rule matches cannot be downgraded below danger (66)
        if has_critical_flag:
            final_score = max(66, merged)
        else:
            final_score = max(rule_score, merged)

        if ai_result.get("scam_type") and ai_result["scam_type"] in [s.value for s in ScamTypeEnum]:
            primary_type = ScamTypeEnum(ai_result["scam_type"])
        if ai_result.get("red_flags"):
            red_flags = list(set(red_flags + ai_result["red_flags"]))
        if ai_result.get("tactics"):
            for t in ai_result["tactics"]:
                if t in [item.value for item in TacticEnum] and TacticEnum(t) not in tactics:
                    tactics.append(TacticEnum(t))

        explanation = ai_result.get("explanation")
        safe_action = ai_result.get("safe_action")
        headline = ai_result.get("headline")
        bullets = ai_result.get("bullets")

    # Ensure score stays in 0-100 range
    final_score = max(0, min(100, final_score))

    # 6. Map to Verdict & Emoji
    if final_score <= 30:
        verdict = VerdictEnum.SAFE
        verdict_emoji = "🟢"
    elif final_score <= 65:
        verdict = VerdictEnum.SUSPICIOUS
        verdict_emoji = "🟡"
    else:
        verdict = VerdictEnum.DANGER
        verdict_emoji = "🔴"

    # 7. Localize display content if not already populated by AI
    loc_headline, loc_body, loc_action, loc_bullets = localize_verdict_content(verdict, target_lang)
    if not headline:
        headline = loc_headline
    if not explanation:
        explanation = loc_body
    if not safe_action:
        safe_action = loc_action
    if not bullets:
        bullets = loc_bullets

    display = DisplayContent(
        headline=headline,
        body=explanation,
        bullets=bullets
    )

    # 8. Privacy-safe operational logging (Zero raw message logged)
    duration_ms = int((time.time() - start_time) * 1000)
    hash_prefix = hashlib.sha256(cleaned_text.encode('utf-8')).hexdigest()[:12]
    logger.info(
        f"AUDIT req_id={request_id} hash={hash_prefix} len={len(cleaned_text)} "
        f"verdict={verdict.value} score={final_score} lang={target_lang} dur_ms={duration_ms}"
    )

    return AnalyzeResponse(
        request_id=request_id,
        verdict=verdict,
        verdict_emoji=verdict_emoji,
        risk_score=final_score,
        scam_type=primary_type,
        red_flags=red_flags,
        explanation=explanation,
        safe_action=safe_action,
        tactics=tactics,
        language_detected=detected_lang,
        language_response=target_lang,
        display=display
    )
