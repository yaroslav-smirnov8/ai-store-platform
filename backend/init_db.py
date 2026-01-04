import asyncio
import asyncpg
import logging
from config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (not to the specific database)
        conn = await asyncpg.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="postgres",
            database="postgres"  # Default database
        )
        
        # Check if database exists
        db_exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = 'ai_store'"
        )
        
        if not db_exists:
            # Create database
            await conn.execute("CREATE DATABASE ai_store")
            logger.info("Database 'ai_store' created successfully")
        else:
            logger.info("Database 'ai_store' already exists")
        
        await conn.close()
    except Exception as e:
        logger.error(f"Error creating database: {e}")
        raise

async def run_schema():
    """Run the schema.sql file"""
    try:
        # Connect to the ai_store database
        conn = await asyncpg.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="postgres",
            database="ai_store"
        )
        
        # Read and execute schema.sql
        with open("database/schema.sql", "r") as f:
            schema_sql = f.read()
        
        await conn.execute(schema_sql)
        logger.info("Schema executed successfully")
        
        await conn.close()
    except Exception as e:
        logger.error(f"Error running schema: {e}")
        raise

async def main():
    """Main initialization function"""
    logger.info("Initializing database...")
    
    # Create database if it doesn't exist
    await create_database()
    
    # Run schema
    await run_schema()
    
    # Run seed data
    from seed_data import main as seed_main
    await seed_main()
    
    logger.info("Database initialization completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())