from decimal import Decimal

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from crud import create_product
from models import ProductType
from schemas import ProductCreate


@pytest.mark.asyncio
async def test_get_products_returns_created_product(client: AsyncClient, db_session: AsyncSession):
    product = await create_product(
        db_session,
        ProductCreate(
            name="QA Product",
            type=ProductType.COURSE,
            price=Decimal("10.00"),
            installment_price=Decimal("12.00"),
            installment_months=3,
            features=["a", "b"],
        ),
    )

    response = await client.get("/api/products/")
    assert response.status_code == 200
    items = response.json()
    assert any(item["id"] == product.id for item in items)


@pytest.mark.asyncio
async def test_get_product_by_id(client: AsyncClient, db_session: AsyncSession):
    product = await create_product(
        db_session,
        ProductCreate(
            name="QA Product 2",
            type=ProductType.BOT,
            price=Decimal("99.99"),
            features=[],
        ),
    )

    response = await client.get(f"/api/products/{product.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product.id
    assert data["name"] == "QA Product 2"
    assert data["type"] == "bot"


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient):
    response = await client.get("/api/products/99999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

