from fastapi import APIRouter, Request, HTTPException, status
from ..schemas import AnalyzeRequest, AnalyzeResponse, HealthResponse, ErrorResponse
from ..rate_limiter import limiter
from ..engine.pipeline import analyze_message_pipeline
from ..config import settings

router = APIRouter(prefix="/api/v1")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        service="scam-shield",
        version="1.0.0"
    )

@router.get("/meta")
async def get_meta():
    return {
        "service": "scam-shield",
        "version": "1.0.0",
        "supported_languages": ["en", "hi", "kn"],
        "max_message_length": settings.MAX_MESSAGE_LENGTH,
        "rate_limit_per_minute": settings.RATE_LIMIT_PER_MINUTE,
        "input_modes": ["sms", "call", "payment"]
    }

@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    responses={
        400: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def analyze_message(request: AnalyzeRequest, req: Request):
    client_ip = req.client.host if req.client else "127.0.0.1"

    # Forwarded headers support if behind proxy
    forwarded = req.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()

    if not limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a moment before analyzing another message."
        )

    try:
        response = await analyze_message_pipeline(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Analysis pipeline encountered an error. Please try again."
        )
