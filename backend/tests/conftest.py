import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool
from main import app
from database import get_db, Base
from config import settings
import os
from typing import AsyncGenerator

# Use the same database but we will rollback changes
# In a CI environment, you would use a separate test DB URL
TEST_DATABASE_URL = settings.database_url

# Create a specific engine for testing with NullPool to avoid connection holding
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    poolclass=NullPool,
)

TestingSessionLocal = async_sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)

@pytest_asyncio.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    """Create tables before tests and drop them (optional) or just ensure they exist"""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # We don't drop tables here to preserve dev data, 
    # but in a real CI you might want to:
    # async with test_engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Fixture that returns a SQLAlchemy session with a SAVEPOINT.
    Everything done in this session will be rolled back after the test.
    """
    async with test_engine.connect() as conn:
        # Begin a transaction
        trans = await conn.begin()
        
        # Create a session bound to this connection
        async_session = AsyncSession(
            bind=conn,
            expire_on_commit=False,
        )
        
        yield async_session
        
        # Rollback the transaction after the test
        await async_session.close()
        await trans.rollback()

@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Fixture for the Async HTTP Client.
    Overrides the get_db dependency to use the test session.
    """
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    
    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()
