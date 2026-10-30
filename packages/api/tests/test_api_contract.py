import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.rate_limiter import limiter

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_rate_limiter():
    limiter.reset()

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "scam-shield"
    assert data["version"] == "1.0.0"

def test_meta_endpoint():
    response = client.get("/api/v1/meta")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "scam-shield"
    assert "en" in data["supported_languages"]
    assert "hi" in data["supported_languages"]
    assert "kn" in data["supported_languages"]

def test_analyze_empty_message_fails():
    response = client.post("/api/v1/analyze", json={"message": "", "language": "en"})
    assert response.status_code == 400
    data = response.json()
    assert data["error"] == "validation_error"

def test_analyze_exceeds_max_length():
    huge_message = "A" * 5001
    response = client.post("/api/v1/analyze", json={"message": huge_message, "language": "en"})
    assert response.status_code == 400
    data = response.json()
    assert data["error"] == "validation_error"

def test_defensive_otp_advisory_is_safe():
    # Bank transactional alert advising user NEVER to share OTP
    message = "Your OTP is 492019 for txn of Rs 1,200 at Amazon. Do NOT share your OTP with anyone. Bank officials never ask for OTP or password."
    response = client.post("/api/v1/analyze", json={"message": message, "language": "en"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "safe"
    assert data["risk_score"] <= 30

def test_urgent_otp_solicitation_is_danger():
    message = "URGENT NOTICE: Your SBI account has been locked. Immediately send your OTP to this number or call 9876543210 to unlock your card within 24 hours."
    response = client.post("/api/v1/analyze", json={"message": message, "language": "en"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "danger"
    assert data["risk_score"] >= 66
    assert len(data["red_flags"]) > 0

def test_digital_arrest_impersonation():
    message = "This is CBI Police headquarters. A parcel in your name contains narcotics. You are under digital arrest. Transfer Rs 50,000 fine immediately to avoid detention."
    response = client.post("/api/v1/analyze", json={"message": message, "language": "en"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "danger"
    assert data["risk_score"] >= 65
    assert data["scam_type"] == "authority_impersonation"

def test_upi_qr_reverse_scam():
    message = "Congratulations! You won cashback of Rs 10,000. Scan this QR code and enter your UPI PIN to claim credit into your bank account now."
    response = client.post("/api/v1/analyze", json={"message": message, "language": "en"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] in ["danger", "suspicious"]
    assert data["risk_score"] >= 50
    assert data["scam_type"] == "payment_scam"

def test_call_mode_warning_signals_danger():
    message = "[Call Warning Signals: Demanded money transfer or payment to clear penalties/fees; Asked for secret OTP, UPI PIN, bank details, or password; Pressured you to act urgently or warned you not to consult family; Claimed to be CBI, Police, Customs, Bank, TRAI, or Courier]"
    response = client.post("/api/v1/analyze", json={"message": message, "language": "en"})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "danger"
    assert data["risk_score"] >= 80
    assert len(data["red_flags"]) >= 3

def test_multilingual_hindi_response():
    message = "बधाई हो! आपने 50,000 रुपये का इनाम जीता है। अभी क्लेम करने के लिए तुरंत 500 रुपये फीस भरें।"
    response = client.post("/api/v1/analyze", json={"message": message, "language": "hi"})
    assert response.status_code == 200
    data = response.json()
    assert data["language_response"] == "hi"
    assert data["verdict"] in ["danger", "suspicious"]
    # Verify Hindi headline or explanation is delivered
    assert any(ord(char) >= 0x0900 and ord(char) <= 0x097F for char in data["explanation"])

def test_multilingual_kannada_response():
    message = "Dear customer, your electricity bill is unpaid. Power supply will be disconnected tonight. Call 9876543210 immediately."
    response = client.post("/api/v1/analyze", json={"message": message, "language": "kn"})
    assert response.status_code == 200
    data = response.json()
    assert data["language_response"] == "kn"
    # Verify Kannada explanation is delivered
    assert any(ord(char) >= 0x0C80 and ord(char) <= 0x0CFF for char in data["explanation"])

def test_rate_limiter_blocks_excessive_requests():
    # In Starlette TestClient, the client host is "testclient"
    test_ip = "testclient"
    for _ in range(60):
        limiter.is_allowed(test_ip)

    response = client.post("/api/v1/analyze", json={"message": "Safe test message", "language": "en"})
    assert response.status_code == 429
    data = response.json()
    assert data["error"] == "rate_limited"
