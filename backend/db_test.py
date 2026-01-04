from database import engine
import asyncio

async def test():
    try:
        async with engine.begin() as conn:
            print('Database connection works!')
    except Exception as e:
        print(f'Database connection failed: {e}')

if __name__ == "__main__":
    asyncio.run(test())