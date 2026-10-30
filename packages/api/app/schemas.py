from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field

class VerdictEnum(str, Enum):
    SAFE = "safe"
    SUSPICIOUS = "suspicious"
    DANGER = "danger"

class ScamTypeEnum(str, Enum):
    SAFE = "safe"
    PHISHING = "phishing"
    LOTTERY = "lottery"
    JOB_SCAM = "job_scam"
    BANK_FRAUD = "bank_fraud"
    PAYMENT_SCAM = "payment_scam"
    AUTHORITY_IMPERSONATION = "authority_impersonation"
    OTHER = "other"

class TacticEnum(str, Enum):
    URGENCY = "urgency"
    AUTHORITY = "authority"
    REWARD = "reward"
    LOSS_AVERSION = "loss_aversion"
    CREDENTIAL_PHISHING = "credential_phishing"

class RequestMetadata(BaseModel):
    has_url: bool = False
    urls: List[str] = Field(default_factory=list)
    phone_numbers: List[str] = Field(default_factory=list)

class AnalyzeRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000, description="Raw text, call notes, or payment request")
    language: str = Field(default="en", description="Target response language: en, hi, or kn")
    source: str = Field(default="web", description="Client source")
    metadata: Optional[RequestMetadata] = Field(default_factory=RequestMetadata)

class DisplayContent(BaseModel):
    headline: str
    body: str
    bullets: List[str] = Field(default_factory=list)

class AnalyzeResponse(BaseModel):
    request_id: str
    verdict: VerdictEnum
    verdict_emoji: str
    risk_score: int = Field(..., ge=0, le=100)
    scam_type: ScamTypeEnum
    red_flags: List[str] = Field(default_factory=list)
    explanation: str
    safe_action: str
    tactics: List[TacticEnum] = Field(default_factory=list)
    language_detected: str
    language_response: str
    display: DisplayContent

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

class ErrorResponse(BaseModel):
    error: str
    message: str
