import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import AsyncSessionLocal, engine, Base
from models import Product, User, ProductType, UserRole
from auth import get_password_hash
import logging

logger = logging.getLogger(__name__)

async def create_tables():
    """Create database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def seed_products(db: AsyncSession):
    """Seed sample products"""
    # Check if products already exist
    result = await db.execute(select(func.count(Product.id)))
    product_count = result.scalar()
    
    if product_count > 0:
        logger.info(f"Products already exist ({product_count} found). Skipping seeding.")
        return
    
    products = [
        {
            "name": "AI and Machine Learning Course",
            "description": "Complete course on artificial intelligence and machine learning. Learn ML basics, neural networks, computer vision, and NLP.",
            "type": ProductType.COURSE,
            "price": 1500.00,
            "installment_price": 1800.00,
            "installment_months": 6,
            "features": [
                "50+ hours of video lessons",
                "Practical assignments",
                "Certificate of completion",
                "Community access",
                "Instructor support"
            ]
        },
        {
            "name": "Python Development Intensive",
            "description": "Intensive Python development course in 30 days. From basics to creating web applications.",
            "type": ProductType.INTENSIVE,
            "price": 800.00,
            "installment_price": 960.00,
            "installment_months": 3,
            "features": [
                "30 days of intensive learning",
                "Daily practical assignments",
                "Mentorship support",
                "Portfolio project",
                "Job placement assistance"
            ]
        },
        {
            "name": "Premium Developer Community",
            "description": "Private community for experience sharing, networking, and professional growth.",
            "type": ProductType.COMMUNITY,
            "price": 200.00,
            "features": [
                "Access to private chat",
                "Weekly webinars",
                "Code reviews",
                "Career consultations",
                "Exclusive materials"
            ]
        },
        {
            "name": "Programming Lesson Generator Bot",
            "description": "Personal AI bot that creates individualized programming lessons tailored to your level.",
            "type": ProductType.BOT,
            "price": 500.00,
            "installment_price": 600.00,
            "installment_months": 4,
            "features": [
                "Personalized lessons",
                "Adaptive difficulty",
                "Multiple programming languages",
                "Interactive assignments",
                "Progress tracking"
            ]
        }
    ]
    
    for product_data in products:
        product = Product(**product_data)
        db.add(product)
    
    await db.commit()
    logger.info(f"Created {len(products)} sample products")

async def seed_admin_user(db: AsyncSession):
    """Create admin user"""
    # Check if admin user already exists
    result = await db.execute(select(User).where(User.email == "admin@aistore.com"))
    existing_admin = result.scalar_one_or_none()
    
    if existing_admin:
        logger.info("Admin user already exists. Skipping seeding.")
        return
    
    admin_data = {
        "telegram_id": "admin_user",
        "email": "admin@aistore.com",
        "hashed_password": get_password_hash("admin123"),
        "role": UserRole.ADMIN,
        "first_name": "Admin",
        "last_name": "User"
    }
    
    admin_user = User(**admin_data)
    db.add(admin_user)
    await db.commit()
    logger.info("Created admin user")

async def main():
    """Main seeding function"""
    logger.info("Starting database seeding...")
    
    # Create tables
    await create_tables()
    
    # Seed data
    async with AsyncSessionLocal() as db:
        try:
            await seed_products(db)
            await seed_admin_user(db)
            logger.info("Database seeding completed successfully!")
        except Exception as e:
            logger.error(f"Error seeding database: {e}")
            await db.rollback()
            raise

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
