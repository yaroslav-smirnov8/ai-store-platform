from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal
import models
import schemas

# User CRUD
async def get_user(db: AsyncSession, user_id: int) -> Optional[models.User]:
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_telegram_id(db: AsyncSession, telegram_id: str) -> Optional[models.User]:
    result = await db.execute(select(models.User).where(models.User.telegram_id == telegram_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[models.User]:
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.dict())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: AsyncSession, user_id: int, user_update: schemas.UserUpdate) -> Optional[models.User]:
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user:
        for field, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, field, value)
        await db.commit()
        await db.refresh(db_user)
    return db_user

# Product CRUD
async def get_products(db: AsyncSession, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[models.Product]:
    query = select(models.Product)
    if active_only:
        query = query.where(models.Product.is_active == True)
    query = query.offset(skip).limit(limit).order_by(models.Product.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def get_product(db: AsyncSession, product_id: int) -> Optional[models.Product]:
    result = await db.execute(select(models.Product).where(models.Product.id == product_id))
    return result.scalar_one_or_none()

async def create_product(db: AsyncSession, product: schemas.ProductCreate) -> models.Product:
    db_product = models.Product(**product.dict())
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

async def update_product(db: AsyncSession, product_id: int, product_update: schemas.ProductUpdate) -> Optional[models.Product]:
    result = await db.execute(select(models.Product).where(models.Product.id == product_id))
    db_product = result.scalar_one_or_none()
    if db_product:
        for field, value in product_update.dict(exclude_unset=True).items():
            setattr(db_product, field, value)
        await db.commit()
        await db.refresh(db_product)
    return db_product

async def delete_product(db: AsyncSession, product_id: int) -> bool:
    result = await db.execute(select(models.Product).where(models.Product.id == product_id))
    db_product = result.scalar_one_or_none()
    if db_product:
        db_product.is_active = False
        await db.commit()
        return True
    return False

# Order CRUD
async def get_orders(db: AsyncSession, skip: int = 0, limit: int = 100, user_id: Optional[int] = None) -> List[models.Order]:
    query = select(models.Order).options(
        selectinload(models.Order.user),
        selectinload(models.Order.product)
    )
    if user_id:
        query = query.where(models.Order.user_id == user_id)
    query = query.offset(skip).limit(limit).order_by(models.Order.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def get_order(db: AsyncSession, order_id: int) -> Optional[models.Order]:
    result = await db.execute(
        select(models.Order)
        .options(
            selectinload(models.Order.user),
            selectinload(models.Order.product),
            selectinload(models.Order.payments)
        )
        .where(models.Order.id == order_id)
    )
    return result.scalar_one_or_none()

async def create_order(db: AsyncSession, order: schemas.OrderCreate, user_id: int) -> models.Order:
    # Get product to calculate total amount
    product = await get_product(db, order.product_id)
    if not product:
        raise ValueError("Product not found")
    
    total_amount = product.installment_price if order.payment_type == models.PaymentType.INSTALLMENT else product.price
    
    db_order = models.Order(
        user_id=user_id,
        product_id=order.product_id,
        payment_type=order.payment_type,
        total_amount=total_amount,
        installment_months=order.installment_months
    )
    
    if order.payment_type == models.PaymentType.INSTALLMENT and order.installment_months:
        db_order.next_payment_date = datetime.utcnow() + timedelta(days=30)
    
    db.add(db_order)
    await db.commit()
    await db.refresh(db_order)
    return db_order

async def update_order_status(db: AsyncSession, order_id: int, status: models.OrderStatus) -> Optional[models.Order]:
    result = await db.execute(select(models.Order).where(models.Order.id == order_id))
    db_order = result.scalar_one_or_none()
    if db_order:
        db_order.status = status
        await db.commit()
        await db.refresh(db_order)
    return db_order

async def get_overdue_orders(db: AsyncSession) -> List[models.Order]:
    query = select(models.Order).options(
        selectinload(models.Order.user),
        selectinload(models.Order.product)
    ).where(
        and_(
            models.Order.payment_type == models.PaymentType.INSTALLMENT,
            models.Order.status == models.OrderStatus.PAID,
            models.Order.next_payment_date < datetime.utcnow(),
            models.Order.paid_amount < models.Order.total_amount
        )
    )
    result = await db.execute(query)
    return result.scalars().all()

# Payment CRUD
async def get_payments(db: AsyncSession, skip: int = 0, limit: int = 100, order_id: Optional[int] = None) -> List[models.Payment]:
    query = select(models.Payment).options(selectinload(models.Payment.order))
    if order_id:
        query = query.where(models.Payment.order_id == order_id)
    query = query.offset(skip).limit(limit).order_by(models.Payment.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def get_payment(db: AsyncSession, payment_id: int) -> Optional[models.Payment]:
    result = await db.execute(
        select(models.Payment)
        .options(selectinload(models.Payment.order))
        .where(models.Payment.id == payment_id)
    )
    return result.scalar_one_or_none()

async def get_payment_by_yookassa_id(db: AsyncSession, yookassa_payment_id: str) -> Optional[models.Payment]:
    result = await db.execute(
        select(models.Payment)
        .options(selectinload(models.Payment.order))
        .where(models.Payment.yookassa_payment_id == yookassa_payment_id)
    )
    return result.scalar_one_or_none()

async def create_payment(db: AsyncSession, payment: schemas.PaymentCreate, yookassa_payment_id: str) -> models.Payment:
    db_payment = models.Payment(
        **payment.dict(),
        yookassa_payment_id=yookassa_payment_id
    )
    db.add(db_payment)
    await db.commit()
    await db.refresh(db_payment)
    return db_payment

async def update_payment_status(db: AsyncSession, payment_id: int, status: models.PaymentStatus, payment_method: Optional[str] = None) -> Optional[models.Payment]:
    result = await db.execute(select(models.Payment).where(models.Payment.id == payment_id))
    db_payment = result.scalar_one_or_none()
    if db_payment:
        db_payment.status = status
        if payment_method:
            db_payment.payment_method = payment_method
        await db.commit()
        await db.refresh(db_payment)
    return db_payment

# Click CRUD
async def create_click(db: AsyncSession, click: schemas.ClickCreate, user_id: Optional[int] = None, ip_address: Optional[str] = None, user_agent: Optional[str] = None) -> models.Click:
    db_click = models.Click(
        **click.dict(),
        user_id=user_id,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(db_click)
    await db.commit()
    await db.refresh(db_click)
    return db_click

async def get_clicks(db: AsyncSession, skip: int = 0, limit: int = 100, user_id: Optional[int] = None, product_id: Optional[int] = None) -> List[models.Click]:
    query = select(models.Click)
    if user_id:
        query = query.where(models.Click.user_id == user_id)
    if product_id:
        query = query.where(models.Click.product_id == product_id)
    query = query.offset(skip).limit(limit).order_by(models.Click.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

# Analytics
async def get_analytics_data(db: AsyncSession) -> Dict[str, Any]:
    # Total orders
    total_orders_result = await db.execute(select(func.count(models.Order.id)))
    total_orders = total_orders_result.scalar()
    
    # Total revenue
    total_revenue_result = await db.execute(select(func.sum(models.Order.paid_amount)))
    total_revenue = total_revenue_result.scalar() or Decimal('0')
    
    # Total clicks
    total_clicks_result = await db.execute(select(func.count(models.Click.id)))
    total_clicks = total_clicks_result.scalar()
    
    # Unique visitors (count of unique user_ids + unique ip_addresses for non-logged users)
    unique_users_result = await db.execute(select(func.count(func.distinct(models.Click.user_id))))
    unique_users = unique_users_result.scalar() or 0
    
    unique_ips_result = await db.execute(
        select(func.count(func.distinct(models.Click.ip_address)))
        .where(models.Click.user_id.is_(None))
    )
    unique_ips = unique_ips_result.scalar() or 0
    
    unique_visitors = unique_users + unique_ips
    
    # Total page views (count of all page views)
    page_views_result = await db.execute(
        select(func.count(models.Click.id))
        .where(models.Click.action == 'page_view')
    )
    total_page_views = page_views_result.scalar() or 0
    
    # Conversion rate
    conversion_rate = (total_orders / total_clicks * 100) if total_clicks > 0 else 0
    
    # Top products
    top_products_result = await db.execute(
        select(
            models.Product.name,
            func.count(models.Order.id).label('order_count'),
            func.sum(models.Order.paid_amount).label('revenue')
        )
        .join(models.Order)
        .group_by(models.Product.id, models.Product.name)
        .order_by(desc('order_count'))
        .limit(5)
    )
    top_products = [
        {
            'name': row.name,
            'order_count': row.order_count,
            'revenue': float(row.revenue or 0)
        }
        for row in top_products_result.fetchall()
    ]
    
    # Recent orders
    recent_orders = await get_orders(db, limit=10)
    
    return {
        'total_orders': total_orders,
        'total_revenue': float(total_revenue),
        'total_clicks': total_clicks,
        'unique_visitors': unique_visitors,
        'total_page_views': total_page_views,
        'conversion_rate': round(conversion_rate, 2),
        'top_products': top_products,
        'recent_orders': recent_orders
    }

# Admin notifications
async def create_admin_notification(db: AsyncSession, notification: schemas.AdminNotificationCreate) -> models.AdminNotification:
    db_notification = models.AdminNotification(**notification.dict())
    db.add(db_notification)
    await db.commit()
    await db.refresh(db_notification)
    return db_notification

async def get_admin_notifications(db: AsyncSession, skip: int = 0, limit: int = 50, unread_only: bool = False) -> List[models.AdminNotification]:
    query = select(models.AdminNotification)
    if unread_only:
        query = query.where(models.AdminNotification.is_read == False)
    query = query.offset(skip).limit(limit).order_by(models.AdminNotification.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def mark_notification_as_read(db: AsyncSession, notification_id: int) -> Optional[models.AdminNotification]:
    result = await db.execute(select(models.AdminNotification).where(models.AdminNotification.id == notification_id))
    db_notification = result.scalar_one_or_none()
    if db_notification:
        db_notification.is_read = True
        await db.commit()
        await db.refresh(db_notification)
    return db_notification
