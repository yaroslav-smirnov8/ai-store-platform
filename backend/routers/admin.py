from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from typing import List
from database import get_db
from models import User, UserRole
from auth import verify_password, create_access_token, get_current_admin_user
import schemas
import crud

router = APIRouter()
security = HTTPBearer()

@router.post("/login", response_model=schemas.AdminToken)
async def admin_login(
    login_data: schemas.AdminLogin,
    db: AsyncSession = Depends(get_db)
):
    """Admin login"""
    # Get user by email
    user = await crud.get_user_by_email(db, email=login_data.email)
    
    # Verify user exists, is admin, and password is correct
    if not user or user.role != UserRole.ADMIN or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/dashboard", response_model=schemas.AnalyticsData)
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get admin dashboard data"""
    analytics_data = await crud.get_analytics_data(db)
    return analytics_data

@router.get("/notifications", response_model=List[schemas.AdminNotification])
async def get_admin_notifications(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get admin notifications"""
    notifications = await crud.get_admin_notifications(
        db, 
        skip=skip, 
        limit=limit, 
        unread_only=unread_only
    )
    return notifications

@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Mark notification as read"""
    notification = await crud.mark_notification_as_read(db, notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    return {"message": "Notification marked as read"}
