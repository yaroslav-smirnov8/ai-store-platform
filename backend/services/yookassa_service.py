import asyncio
import aiohttp
import json
import base64
import hmac
import hashlib
from typing import Dict, Any, Optional
from config import settings
import logging

logger = logging.getLogger(__name__)

class YooKassaService:
    def __init__(self):
        self.shop_id = settings.yookassa_shop_id
        self.secret_key = settings.yookassa_secret_key
        self.base_url = "https://api.yookassa.ru/v3"
        
    def _get_auth_header(self) -> str:
        """Get authorization header for YooKassa API"""
        credentials = f"{self.shop_id}:{self.secret_key}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        return f"Basic {encoded_credentials}"
    
    async def create_payment(
        self,
        amount: float,
        description: str,
        return_url: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create payment in YooKassa"""
        url = f"{self.base_url}/payments"
        
        payload = {
            "amount": {
                "value": f"{amount:.2f}",
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": return_url
            },
            "capture": True,
            "description": description
        }
        
        if metadata:
            payload["metadata"] = metadata
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json",
            "Idempotence-Key": str(hash(f"{amount}{description}{return_url}"))
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"YooKassa payment creation failed: {error_text}")
                    raise Exception(f"Payment creation failed: {error_text}")
    
    async def get_payment(self, payment_id: str) -> Dict[str, Any]:
        """Get payment info from YooKassa"""
        url = f"{self.base_url}/payments/{payment_id}"
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"YooKassa payment get failed: {error_text}")
                    raise Exception(f"Payment get failed: {error_text}")
    
    async def capture_payment(self, payment_id: str, amount: Optional[float] = None) -> Dict[str, Any]:
        """Capture payment in YooKassa"""
        url = f"{self.base_url}/payments/{payment_id}/capture"
        
        payload = {}
        if amount:
            payload["amount"] = {
                "value": f"{amount:.2f}",
                "currency": "RUB"
            }
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json",
            "Idempotence-Key": str(hash(f"capture_{payment_id}_{amount}"))
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"YooKassa payment capture failed: {error_text}")
                    raise Exception(f"Payment capture failed: {error_text}")
    
    async def cancel_payment(self, payment_id: str) -> Dict[str, Any]:
        """Cancel payment in YooKassa"""
        url = f"{self.base_url}/payments/{payment_id}/cancel"
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json",
            "Idempotence-Key": str(hash(f"cancel_{payment_id}"))
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"YooKassa payment cancel failed: {error_text}")
                    raise Exception(f"Payment cancel failed: {error_text}")
    
    async def create_refund(self, payment_id: str, amount: float) -> Dict[str, Any]:
        """Create refund in YooKassa"""
        url = f"{self.base_url}/refunds"
        
        payload = {
            "amount": {
                "value": f"{amount:.2f}",
                "currency": "RUB"
            },
            "payment_id": payment_id
        }
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json",
            "Idempotence-Key": str(hash(f"refund_{payment_id}_{amount}"))
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"YooKassa refund creation failed: {error_text}")
                    raise Exception(f"Refund creation failed: {error_text}")
    
    def verify_webhook(self, body: bytes, headers: Dict[str, str]) -> bool:
        """Verify YooKassa webhook signature"""
        try:
            # Get signature from headers
            signature = headers.get("x-yookassa-signature")
            if not signature:
                return False
            
            # Calculate expected signature
            expected_signature = hmac.new(
                self.secret_key.encode(),
                body,
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(signature, expected_signature)
        except Exception as e:
            logger.error(f"Webhook verification error: {e}")
            return False
    
    async def setup_webhook(self, webhook_url: str) -> Dict[str, Any]:
        """Setup webhook in YooKassa"""
        url = f"{self.base_url}/webhooks"
        
        payload = {
            "event": "payment.succeeded",
            "url": webhook_url
        }
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"YooKassa webhook setup failed: {error_text}")
                    raise Exception(f"Webhook setup failed: {error_text}")
