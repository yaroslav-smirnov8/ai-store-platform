from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database import get_db
from models import User, PaymentStatus
from auth import get_current_admin_user
from services.yookassa_service import YooKassaService
from services.telegram_service import TelegramService
import schemas
import crud
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/create", response_model=dict)
async def create_payment(
    order_id: int,
    return_url: str,
    db: AsyncSession = Depends(get_db)
):
    """Create YooKassa payment"""
    # Get order
    order = await crud.get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Calculate payment amount
    if order.payment_type.value == "installment":
        amount = order.total_amount / order.installment_months
        installment_number = 1
    else:
        amount = order.total_amount
        installment_number = None
    
    # Create payment in YooKassa
    yookassa_service = YooKassaService()
    payment_data = await yookassa_service.create_payment(
        amount=float(amount),
        description=f"Payment for {order.product.name}",
        return_url=return_url,
        metadata={
            "order_id": order.id,
            "user_id": order.user_id,
            "installment_number": installment_number
        }
    )
    
    # Save payment to database
    payment_create = schemas.PaymentCreate(
        order_id=order.id,
        amount=amount,
        is_installment=order.payment_type.value == "installment",
        installment_number=installment_number
    )
    
    payment = await crud.create_payment(
        db, 
        payment=payment_create, 
        yookassa_payment_id=payment_data["id"]
    )
    
    # Update payment with confirmation URL
    if payment:
        payment.confirmation_url = payment_data.get("confirmation", {}).get("confirmation_url")
        await db.commit()
    
    return {
        "payment_id": payment.id,
        "yookassa_payment_id": payment_data["id"],
        "confirmation_url": payment_data.get("confirmation", {}).get("confirmation_url"),
        "amount": float(amount)
    }

@router.get("/{payment_id}/status", response_model=dict)
async def get_payment_status(
    payment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get payment status"""
    payment = await crud.get_payment(db, payment_id=payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Check status in YooKassa
    yookassa_service = YooKassaService()
    yookassa_payment = await yookassa_service.get_payment(payment.yookassa_payment_id)
    
    # Update local status if needed
    yookassa_status = yookassa_payment.get("status")
    if yookassa_status and yookassa_status != payment.status.value:
        new_status = PaymentStatus(yookassa_status)
        await crud.update_payment_status(
            db, 
            payment_id=payment.id, 
            status=new_status,
            payment_method=yookassa_payment.get("payment_method", {}).get("type")
        )
    
    return {
        "payment_id": payment.id,
        "status": yookassa_status or payment.status.value,
        "amount": float(payment.amount)
    }

@router.post("/webhook")
async def yookassa_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle YooKassa webhook"""
    try:
        # Get request body
        body = await request.body()
        
        # Verify webhook
        yookassa_service = YooKassaService()
        if not yookassa_service.verify_webhook(body, request.headers):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid webhook signature"
            )
        
        # Parse webhook data
        webhook_data = await request.json()
        event_type = webhook_data.get("event")
        payment_data = webhook_data.get("object")
        
        if event_type == "payment.succeeded":
            # Find payment
            payment = await crud.get_payment_by_yookassa_id(
                db, 
                payment_data["id"]
            )
            
            if payment:
                # Update payment status
                await crud.update_payment_status(
                    db,
                    payment_id=payment.id,
                    status=PaymentStatus.SUCCEEDED,
                    payment_method=payment_data.get("payment_method", {}).get("type")
                )
                
                # Update order
                order = payment.order
                order.paid_amount += payment.amount
                
                if order.paid_amount >= order.total_amount:
                    order.status = models.OrderStatus.PAID
                
                await db.commit()
                
                # Send notification
                telegram_service = TelegramService()
                await telegram_service.send_payment_success_notification(
                    order_id=order.id,
                    amount=float(payment.amount),
                    product_name=order.product.name,
                    user_name=f"{order.user.first_name} {order.user.last_name}".strip()
                )
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed"
        )

@router.get("/", response_model=List[schemas.Payment])
async def get_payments(
    skip: int = 0,
    limit: int = 100,
    order_id: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get payments (admin only)"""
    payments = await crud.get_payments(db, skip=skip, limit=limit, order_id=order_id)
    return payments

@router.post("/{payment_id}/refund")
async def create_refund(
    payment_id: int,
    amount: float = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create refund (admin only)"""
    payment = await crud.get_payment(db, payment_id=payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Create refund in YooKassa
    yookassa_service = YooKassaService()
    refund_data = await yookassa_service.create_refund(
        payment_id=payment.yookassa_payment_id,
        amount=amount or float(payment.amount)
    )
    
    return {
        "refund_id": refund_data["id"],
        "status": refund_data["status"],
        "amount": refund_data["amount"]["value"]
    }
