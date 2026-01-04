import asyncio
import asyncpg

async def test_connection():
    try:
        print("Connecting to ai_store database...")
        conn = await asyncpg.connect('postgresql://postgres:postgres@127.0.0.1:5432/ai_store')
        print("Connection successful!")
        
        # Test simple query
        result = await conn.fetchval('SELECT version()')
        print(f"PostgreSQL version: {result}")
        
        # Test database name
        db_name = await conn.fetchval('SELECT current_database()')
        print(f"Connected to database: {db_name}")
        
        # List tables
        tables = await conn.fetch("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
        print(f"Tables in database: {[t['tablename'] for t in tables] if tables else 'No tables yet'}")
        
        await conn.close()
        print("Connection closed successfully")
        
    except Exception as e:
        print(f"Connection failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_connection())