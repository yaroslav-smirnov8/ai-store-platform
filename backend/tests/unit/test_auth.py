import hashlib
import hmac
import json
from urllib.parse import quote

import pytest

from auth import create_access_token, get_password_hash, verify_password, verify_telegram_webapp_data, verify_token
from config import settings


def test_password_hash_roundtrip():
    password = "StrongPassw0rd!"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password("wrong", hashed) is False


def test_jwt_token_roundtrip():
    token = create_access_token({"sub": "123"})
    payload = verify_token(token)
    assert payload is not None
    assert payload.get("sub") == "123"
    assert "exp" in payload


def test_verify_telegram_webapp_data_returns_none_on_garbage():
    assert verify_telegram_webapp_data("not_a_query_string") is None
    assert verify_telegram_webapp_data("a=b&hash=") is None


def test_verify_telegram_webapp_data_valid_signature(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(settings, "telegram_bot_token", "test_bot_token")

    user = {"id": 111, "username": "qa_user", "first_name": "QA", "last_name": "User"}
    data = {
        "auth_date": "1700000000",
        "query_id": "AAEAAAE",
        "user": json.dumps(user, separators=(",", ":")),
    }
    data_check_string = "\n".join(f"{k}={data[k]}" for k in sorted(data.keys()))
    secret_key = hmac.new(b"WebAppData", settings.telegram_bot_token.encode(), hashlib.sha256).digest()
    signature = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    init_data = "&".join([f"{quote(k)}={quote(v)}" for k, v in data.items()] + [f"hash={signature}"])
    assert verify_telegram_webapp_data(init_data) == user
