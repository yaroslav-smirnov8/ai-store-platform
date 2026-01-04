from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from database import get_db
from models import User
from auth import get_current_admin_user, verify_telegram_webapp_data
import schemas
import crud

router = APIRouter()

@router.post("/click")
async def track_click(
    click: schemas.ClickCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_telegram_init_data: Optional[str] = Header(None)
):
    """Track user click"""
    user_id = None
    
    # Try to get user from Telegram WebApp data
    if x_telegram_init_data:
        telegram_user = verify_telegram_webapp_data(x_telegram_init_data)
        if telegram_user:
            user = await crud.get_user_by_telegram_id(db, str(telegram_user['id']))
            if user:
                user_id = user.id
    
    # Get client info
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent")
    
    # Create click record
    db_click = await crud.create_click(
        db,
        click=click,
        user_id=user_id,
        ip_address=client_ip,
        user_agent=user_agent
    )
    
    return {"status": "success", "click_id": db_click.id}

@router.get("/dashboard", response_model=schemas.AnalyticsData)
async def get_analytics_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get analytics dashboard data (admin only)"""
    analytics_data = await crud.get_analytics_data(db)
    return analytics_data

@router.get("/clicks")
async def get_clicks(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[int] = None,
    product_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get click statistics (admin only)"""
    clicks = await crud.get_clicks(
        db, 
        skip=skip, 
        limit=limit, 
        user_id=user_id, 
        product_id=product_id
    )
    return clicks
