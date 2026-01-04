from celery import Celery
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
import asyncio
from database import AsyncSessionLocal
from services.telegram_service import TelegramService
import crud
import logging

logger = logging.getLogger(__name__)

# Create Celery app
celery_app = Celery(
    "ai_store_tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "check-overdue-payments": {
            "task": "tasks.check_overdue_payments",
            "schedule": 3600.0,  # Run every hour
        },
    },
)

async def get_async_db():
    """Get async database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

@celery_app.task
def check_overdue_payments():
    """Check for overdue installment payments"""
    asyncio.run(_check_overdue_payments())

async def _check_overdue_payments():
    """Async implementation of overdue payments check"""
    try:
        async with AsyncSessionLocal() as db:
            # Get overdue orders
            overdue_orders = await crud.get_overdue_orders(db)
            
            telegram_service = TelegramService()
            
            for order in overdue_orders:
                # Calculate days overdue
                days_overdue = (datetime.utcnow() - order.next_payment_date).days
                
                # Calculate remaining amount
                remaining_amount = order.total_amount - order.paid_amount
                monthly_payment = remaining_amount / (order.installment_months - 1) if order.installment_months > 1 else remaining_amount
                
                # Send reminder notification
                user_name = f"{order.user.first_name} {order.user.last_name}".strip() or order.user.username or "Unknown"
                
                await telegram_service.send_installment_reminder(
                    order_id=order.id,
                    amount=float(monthly_payment),
                    product_name=order.product.name,
                    user_name=user_name,
                    days_overdue=days_overdue
                )
                
                # Create admin notification
                notification_data = {
                    "type": "overdue_payment",
                    "title": f"Overdue Payment - Order #{order.id}",
                    "message": f"Payment for {order.product.name} is {days_overdue} days overdue",
                    "metadata": {
                        "order_id": order.id,
                        "days_overdue": days_overdue,
                        "amount": float(monthly_payment)
                    }
                }
                
                await crud.create_admin_notification(db, notification_data)
                
                logger.info(f"Processed overdue order {order.id}, {days_overdue} days overdue")
            
            logger.info(f"Checked {len(overdue_orders)} overdue orders")
            
    except Exception as e:
        logger.error(f"Error checking overdue payments: {e}")

@celery_app.task
def send_installment_reminder(order_id: int):
    """Send installment payment reminder"""
    asyncio.run(_send_installment_reminder(order_id))

async def _send_installment_reminder(order_id: int):
    """Async implementation of installment reminder"""
    try:
        async with AsyncSessionLocal() as db:
            order = await crud.get_order(db, order_id=order_id)
            if not order:
                logger.error(f"Order {order_id} not found")
                return
            
            # Calculate next payment amount
            remaining_amount = order.total_amount - order.paid_amount
            remaining_months = order.installment_months - 1  # Assuming first payment was made
            monthly_payment = remaining_amount / remaining_months if remaining_months > 0 else remaining_amount
            
            telegram_service = TelegramService()
            user_name = f"{order.user.first_name} {order.user.last_name}".strip() or order.user.username or "Unknown"
            
            await telegram_service.send_installment_reminder(
                order_id=order.id,
                amount=float(monthly_payment),
                product_name=order.product.name,
                user_name=user_name,
                days_overdue=0
            )
            
            logger.info(f"Sent installment reminder for order {order_id}")
            
    except Exception as e:
        logger.error(f"Error sending installment reminder: {e}")

if __name__ == "__main__":
    celery_app.start()
