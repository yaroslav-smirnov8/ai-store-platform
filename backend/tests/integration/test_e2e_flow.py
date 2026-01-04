from decimal import Decimal
from unittest.mock import patch

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from crud import create_product
from models import ProductType, User
from schemas import ProductCreate


@pytest.mark.asyncio
async def test_e2e_product_list_to_order_flow(client: AsyncClient, db_session: AsyncSession):
    product = await create_product(
        db_session,
        ProductCreate(
            name="E2E Product",
            description="E2E",
            type=ProductType.COURSE,
            price=Decimal("1000.00"),
            installment_price=Decimal("1200.00"),
            installment_months=3,
            features=["f1"],
        ),
    )

    listed = await client.get("/api/products/")
    assert listed.status_code == 200
    assert any(item["id"] == product.id for item in listed.json())

    telegram_user = {"id": 12345, "username": "e2e_user", "first_name": "E2E", "last_name": "User"}
    db_user = User(
        telegram_id=str(telegram_user["id"]),
        username=telegram_user["username"],
        first_name=telegram_user["first_name"],
        last_name=telegram_user["last_name"],
        is_active=True,
    )
    db_session.add(db_user)
    await db_session.commit()

    with patch("routers.orders.verify_telegram_webapp_data", return_value=telegram_user):
        created_order = await client.post(
            "/api/orders/",
            json={"product_id": product.id, "payment_type": "full", "installment_months": None},
            headers={"X-Telegram-Init-Data": "dummy"},
        )
        assert created_order.status_code == 200
        order = created_order.json()
        assert order["product_id"] == product.id
        assert order["status"] == "pending"

        my_orders = await client.get("/api/orders/my", headers={"X-Telegram-Init-Data": "dummy"})
        assert my_orders.status_code == 200
        assert any(item["id"] == order["id"] for item in my_orders.json())
