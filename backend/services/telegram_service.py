import asyncio
import aiohttp
import logging
from typing import Optional
from config import settings

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self):
        self.bot_token = settings.telegram_bot_token
        self.admin_chat_id = settings.telegram_admin_chat_id
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
    
    async def send_message(self, chat_id: str, text: str, parse_mode: str = "HTML") -> bool:
        """Send message via Telegram Bot API"""
        if not self.bot_token:
            logger.warning("Telegram bot token not configured")
            return False
        
        url = f"{self.base_url}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": parse_mode
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        return True
                    else:
                        error_text = await response.text()
                        logger.error(f"Telegram send message failed: {error_text}")
                        return False
        except Exception as e:
            logger.error(f"Telegram send message error: {e}")
            return False
    
    async def send_admin_notification(self, message: str) -> bool:
        """Send notification to admin"""
        if not self.admin_chat_id:
            logger.warning("Admin chat ID not configured")
            return False
        
        return await self.send_message(self.admin_chat_id, message)
    
    async def send_new_order_notification(self, order_id: int, product_name: str, user_name: str, amount: float) -> bool:
        """Send new order notification to admin"""
        message = f"""
🛍️ <b>New Order!</b>

📦 Product: {product_name}
👤 Customer: {user_name}
💰 Amount: ${amount:.2f}
🆔 Order: #{order_id}

Time: {asyncio.get_event_loop().time()}
        """.strip()
        
        return await self.send_admin_notification(message)
    
    async def send_payment_success_notification(self, order_id: int, amount: float, product_name: str, user_name: str) -> bool:
        """Send payment success notification to admin"""
        message = f"""
✅ <b>Payment Successful!</b>

💳 Paid: ${amount:.2f}
📦 Product: {product_name}
👤 Customer: {user_name}
🆔 Order: #{order_id}

Time: {asyncio.get_event_loop().time()}
        """.strip()
        
        return await self.send_admin_notification(message)
    
    async def send_installment_reminder(self, order_id: int, amount: float, product_name: str, user_name: str, days_overdue: int) -> bool:
        """Send installment payment reminder to admin"""
        message = f"""
⚠️ <b>Installment Payment Overdue!</b>

📦 Product: {product_name}
👤 Customer: {user_name}
💰 Amount Due: ${amount:.2f}
🆔 Order: #{order_id}
📅 Overdue by: {days_overdue} days

Please contact the customer!
        """.strip()
        
        return await self.send_admin_notification(message)
    
    async def send_overdue_payment_notification(self, order_id: int, total_amount: float, paid_amount: float, product_name: str, user_name: str) -> bool:
        """Send overdue payment notification to admin"""
        remaining_amount = total_amount - paid_amount
        message = f"""
🚨 <b>Overdue Payment!</b>

📦 Product: {product_name}
👤 Customer: {user_name}
💰 Total Amount: ${total_amount:.2f}
💳 Paid: ${paid_amount:.2f}
⚠️ Remaining: ${remaining_amount:.2f}
🆔 Order: #{order_id}

Admin intervention required!
        """.strip()
        
        return await self.send_admin_notification(message)
