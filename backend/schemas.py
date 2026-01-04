from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from models import UserRole, ProductType, OrderStatus, PaymentStatus, PaymentType

# User schemas
class UserBase(BaseModel):
    telegram_id: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    password: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: ProductType
    price: Decimal
    installment_price: Optional[Decimal] = None
    installment_months: Optional[int] = None
    features: Optional[List[str]] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    installment_price: Optional[Decimal] = None
    installment_months: Optional[int] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None

class Product(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Order schemas
class OrderBase(BaseModel):
    product_id: int
    payment_type: PaymentType
    installment_months: Optional[int] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: int
    status: OrderStatus
    total_amount: Decimal
    paid_amount: Decimal
    next_payment_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Relationships
    user: Optional[User] = None
    product: Optional[Product] = None

    class Config:
        from_attributes = True

# Payment schemas
class PaymentBase(BaseModel):
    amount: Decimal
    is_installment: bool = False
    installment_number: Optional[int] = None

class PaymentCreate(PaymentBase):
    order_id: int

class Payment(PaymentBase):
    id: int
    order_id: int
    yookassa_payment_id: str
    status: PaymentStatus
    payment_method: Optional[str] = None
    confirmation_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Click schemas
class ClickCreate(BaseModel):
    product_id: Optional[int] = None
    page: str
    action: str
    metadata: Optional[Dict[str, Any]] = None

class Click(BaseModel):
    id: int
    user_id: Optional[int] = None
    product_id: Optional[int] = None
    page: str
    action: str
    metadata: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics schemas
class AnalyticsData(BaseModel):
    total_orders: int
    total_revenue: Decimal
    total_clicks: int
    unique_visitors: int
    total_page_views: int
    conversion_rate: float
    top_products: List[Dict[str, Any]]
    recent_orders: List[Order]

# Admin schemas
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str

class AdminNotificationCreate(BaseModel):
    type: str
    title: str
    message: str
    metadata: Optional[Dict[str, Any]] = None

class AdminNotification(BaseModel):
    id: int
    type: str
    title: str
    message: str
    is_read: bool
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Telegram WebApp schemas
class TelegramWebAppData(BaseModel):
    query_id: Optional[str] = None
    user: Optional[Dict[str, Any]] = None
    receiver: Optional[Dict[str, Any]] = None
    chat: Optional[Dict[str, Any]] = None
    chat_type: Optional[str] = None
    chat_instance: Optional[str] = None
    start_param: Optional[str] = None
    can_send_after: Optional[int] = None
    auth_date: int
    hash: str

# YooKassa webhook schemas
class YooKassaWebhookData(BaseModel):
    type: str
    event: str
    object: Dict[str, Any]
