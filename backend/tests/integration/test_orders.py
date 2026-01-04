import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from models import ProductType, User
from schemas import ProductCreate
from crud import create_product
from decimal import Decimal
from unittest.mock import patch

@pytest.mark.asyncio
async def test_create_order_full_payment(client: AsyncClient, db_session: AsyncSession):
    # 1. Create a product directly in DB
    product_data = ProductCreate(
        name="Test Course",
        type=ProductType.COURSE,
        price=Decimal("1000.00"),
        installment_price=Decimal("1200.00"),
        installment_months=3,
        features=["feature1"]
    )
    product = await create_product(db_session, product_data)
    
    # 2. Prepare request data
    order_payload = {
        "product_id": product.id,
        "payment_type": "full",
        "installment_months": None
    }
    
    # 3. Mock Telegram WebApp verification
    mock_user_data = {
        "id": 123456789,
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User"
    }

    db_user = User(
        telegram_id=str(mock_user_data["id"]),
        username=mock_user_data["username"],
        first_name=mock_user_data["first_name"],
        last_name=mock_user_data["last_name"],
        is_active=True,
    )
    db_session.add(db_user)
    await db_session.commit()
    
    with patch("routers.orders.verify_telegram_webapp_data", return_value=mock_user_data):
        response = await client.post(
            "/api/orders/",
            json=order_payload,
            headers={"X-Telegram-Init-Data": "dummy_hash_string"}
        )
    
    # 4. Verify response
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == product.id
    assert data["status"] == "pending"
    assert Decimal(str(data["total_amount"])) == Decimal("1000.00")
    assert data["user_id"] is not None

@pytest.mark.asyncio
async def test_create_order_installment(client: AsyncClient, db_session: AsyncSession):
    # 1. Create a product directly in DB
    product_data = ProductCreate(
        name="Expensive Course",
        type=ProductType.INTENSIVE,
        price=Decimal("500.00"),
        installment_price=Decimal("600.00"),
        installment_months=6,
        features=["feature1"]
    )
    product = await create_product(db_session, product_data)
    
    # 2. Prepare request data
    order_payload = {
        "product_id": product.id,
        "payment_type": "installment",
        "installment_months": 6
    }
    
    # 3. Mock Telegram verification
    mock_user_data = {
        "id": 987654321,
        "username": "installment_user",
        "first_name": "Inst",
        "last_name": "User"
    }

    db_user = User(
        telegram_id=str(mock_user_data["id"]),
        username=mock_user_data["username"],
        first_name=mock_user_data["first_name"],
        last_name=mock_user_data["last_name"],
        is_active=True,
    )
    db_session.add(db_user)
    await db_session.commit()
    
    with patch("routers.orders.verify_telegram_webapp_data", return_value=mock_user_data):
        response = await client.post(
            "/api/orders/",
            json=order_payload,
            headers={"X-Telegram-Init-Data": "dummy_hash_string"}
        )
    
    # 4. Verify response
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == product.id
    assert Decimal(str(data["total_amount"])) == Decimal("600.00")
    assert data["payment_type"] == "installment"
    assert data["next_payment_date"] is not None

@pytest.mark.asyncio
async def test_create_order_invalid_product(client: AsyncClient, db_session: AsyncSession):
    # Mock Telegram verification
    mock_user_data = {"id": 123, "username": "test"}

    db_user = User(
        telegram_id=str(mock_user_data["id"]),
        username=mock_user_data["username"],
        is_active=True,
    )
    db_session.add(db_user)
    await db_session.commit()
    
    order_payload = {
        "product_id": 9999,  # Non-existent
        "payment_type": "full"
    }
    
    with patch("routers.orders.verify_telegram_webapp_data", return_value=mock_user_data):
        response = await client.post(
            "/api/orders/",
            json=order_payload,
            headers={"X-Telegram-Init-Data": "dummy"}
        )
    
    assert response.status_code == 500
