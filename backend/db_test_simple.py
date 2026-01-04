import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text
import logging

# Enable logging to see what's happening
logging.basicConfig(level=logging.DEBUG)

async def test_db_connection():
    # Use SQLite directly for testing
    engine = create_async_engine(
        "sqlite+aiosqlite:///./test_ai_store.db",
        echo=True,
        connect_args={"check_same_thread": False}
    )
    
    try:
        async with engine.begin() as conn:
            # Test the connection by executing a simple query
            result = await conn.execute(text("SELECT 1"))
            print("Database connection successful!")
            print(f"Query result: {result.fetchone()}")
            
        # Close the engine
        await engine.dispose()
        print("Engine disposed successfully")
        
    except Exception as e:
        print(f"Database connection failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_db_connection())