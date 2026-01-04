import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

import crud
from auth import get_password_hash
from models import User, UserRole


@pytest.mark.asyncio
async def test_admin_login_rejects_unknown_user(client: AsyncClient):
    response = await client.post("/api/admin/login", json={"email": "nope@example.com", "password": "x"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_admin_login_returns_token(client: AsyncClient, db_session: AsyncSession):
    admin_email = "admin@example.com"
    admin_password = "AdminPass123!"

    admin = User(
        telegram_id="999000",
        email=admin_email,
        username="admin",
        first_name="Admin",
        last_name="User",
        role=UserRole.ADMIN,
        hashed_password=get_password_hash(admin_password),
        is_active=True,
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)

    db_admin = await crud.get_user_by_email(db_session, admin_email)
    assert db_admin is not None
    assert db_admin.role == UserRole.ADMIN
    assert db_admin.hashed_password is not None

    login = await client.post("/api/admin/login", json={"email": admin_email, "password": admin_password})
    assert login.status_code == 200
    payload = login.json()
    token = payload["access_token"]
    assert isinstance(token, str) and token
    assert payload["token_type"] == "bearer"
