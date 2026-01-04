from decimal import Decimal
from unittest.mock import patch

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from crud import create_product
from models import ProductType
from schemas import ProductCreate


@pytest.mark.asyncio
async def test_create_order_requires_telegram_header(client: AsyncClient, db_session: AsyncSession):
    product = await create_product(
        db_session,
        ProductCreate(
            name="Header Test Product",
            type=ProductType.COURSE,
            price=Decimal("1.00"),
            features=[],
        ),
    )

    response = await client.post(
        "/api/orders/",
        json={"product_id": product.id, "payment_type": "full", "installment_months": None},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Telegram WebApp data required"


@pytest.mark.asyncio
async def test_create_order_rejects_invalid_telegram_data(client: AsyncClient, db_session: AsyncSession):
    product = await create_product(
        db_session,
        ProductCreate(
            name="Invalid Telegram Product",
            type=ProductType.COURSE,
            price=Decimal("2.00"),
            features=[],
        ),
    )

    with patch("routers.orders.verify_telegram_webapp_data", return_value=None):
        response = await client.post(
            "/api/orders/",
            json={"product_id": product.id, "payment_type": "full", "installment_months": None},
            headers={"X-Telegram-Init-Data": "invalid"},
        )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid Telegram WebApp data"

