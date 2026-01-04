from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from database import get_db
from models import User, OrderStatus
from auth import get_current_admin_user, verify_telegram_webapp_data
import schemas
import crud

router = APIRouter()

@router.post("/", response_model=schemas.Order)
async def create_order(
    order: schemas.OrderCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_telegram_init_data: Optional[str] = Header(None)
):
    """Create new order with Telegram WebApp verification"""
    # Verify Telegram WebApp data
    if not x_telegram_init_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telegram WebApp data required"
        )
    
    telegram_user = verify_telegram_webapp_data(x_telegram_init_data)
    if not telegram_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Telegram WebApp data"
        )
    
    # Get or create user
    user = await crud.get_user_by_telegram_id(db, str(telegram_user['id']))
    if not user:
        user_create = schemas.UserCreate(
            telegram_id=str(telegram_user['id']),
            username=telegram_user.get('username'),
            first_name=telegram_user.get('first_name'),
            last_name=telegram_user.get('last_name')
        )
        user = await crud.create_user(db, user_create)
    
    # Create order
    db_order = await crud.create_order(db, order=order, user_id=user.id)
    return db_order

@router.get("/", response_model=List[schemas.Order])
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get orders (admin only)"""
    orders = await crud.get_orders(db, skip=skip, limit=limit, user_id=user_id)
    return orders

@router.get("/my", response_model=List[schemas.Order])
async def get_my_orders(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    x_telegram_init_data: Optional[str] = Header(None)
):
    """Get current user's orders"""
    if not x_telegram_init_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telegram WebApp data required"
        )
    
    telegram_user = verify_telegram_webapp_data(x_telegram_init_data)
    if not telegram_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Telegram WebApp data"
        )
    
    user = await crud.get_user_by_telegram_id(db, str(telegram_user['id']))
    if not user:
        return []
    
    orders = await crud.get_orders(db, skip=skip, limit=limit, user_id=user.id)
    return orders

@router.get("/overdue", response_model=List[schemas.Order])
async def get_overdue_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get overdue installment orders (admin only)"""
    orders = await crud.get_overdue_orders(db)
    return orders

@router.get("/{order_id}", response_model=schemas.Order)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get order by ID (admin only)"""
    order = await crud.get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.put("/{order_id}/status", response_model=schemas.Order)
async def update_order_status(
    order_id: int,
    status: OrderStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update order status (admin only)"""
    order = await crud.update_order_status(db, order_id=order_id, status=status)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order
