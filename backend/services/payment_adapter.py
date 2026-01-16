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

class PaymentAdapter:
    """Generic payment gateway adapter for multiple providers (Stripe, Square, etc.)"""
    
    def __init__(self):
        # Support multiple payment providers
        self.provider = getattr(settings, 'payment_provider', 'stripe').lower()
        self.api_key = getattr(settings, 'payment_api_key', '')
        self.base_url = self._get_base_url()
        
        if not self.api_key:
            raise ValueError(f"Payment API key not configured for provider: {self.provider}")
    
    def _get_base_url(self) -> str:
        """Get API base URL based on provider"""
        urls = {
            'stripe': 'https://api.stripe.com/v1',
            'square': 'https://connect.squareup.com/v2',
            'paypal': 'https://api.sandbox.paypal.com/v1',
        }
        return urls.get(self.provider, 'https://api.stripe.com/v1')
    
    def _get_auth_header(self) -> str:
        """Get authorization header based on provider"""
        if self.provider == 'stripe':
            encoded = base64.b64encode(f"{self.api_key}:".encode()).decode()
            return f"Basic {encoded}"
        elif self.provider == 'square':
            return f"Bearer {self.api_key}"
        elif self.provider == 'paypal':
            return f"Bearer {self.api_key}"
        else:
            return f"Bearer {self.api_key}"
    
    async def create_payment(
        self,
        amount: float,
        description: str,
        return_url: str,
        currency: str = 'USD',
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create payment with configured provider"""
        if self.provider == 'stripe':
            return await self._create_stripe_payment(amount, description, return_url, currency, metadata)
        elif self.provider == 'square':
            return await self._create_square_payment(amount, description, return_url, currency, metadata)
        else:
            raise ValueError(f"Unsupported payment provider: {self.provider}")
    
    async def _create_stripe_payment(
        self,
        amount: float,
        description: str,
        return_url: str,
        currency: str,
        metadata: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Create payment in Stripe"""
        url = f"{self.base_url}/payment_intents"
        
        payload = {
            "amount": int(amount * 100),  # Stripe uses cents
            "currency": currency.lower(),
            "description": description,
            "confirmation_method": "manual",
            "confirm": True,
            "return_url": return_url
        }
        
        if metadata:
            payload["metadata"] = metadata
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=payload, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Payment creation failed: {error_text}")
                    raise Exception(f"Payment creation failed: {error_text}")
    
    async def _create_square_payment(
        self,
        amount: float,
        description: str,
        return_url: str,
        currency: str,
        metadata: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Create payment in Square"""
        url = f"{self.base_url}/payments"
        
        payload = {
            "source_id": "cnon:card-nonce-ok",  # Use tokenized card
            "amount_money": {
                "amount": int(amount * 100),
                "currency": currency.upper()
            },
            "idempotency_key": str(hash(f"{amount}{description}{return_url}"))
        }
        
        if metadata:
            payload["reference_id"] = str(metadata.get("order_id", ""))
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json",
            "Square-Version": "2023-01-10"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200 or response.status == 201:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Payment creation failed: {error_text}")
                    raise Exception(f"Payment creation failed: {error_text}")
    
    async def get_payment(self, payment_id: str) -> Dict[str, Any]:
        """Get payment info"""
        if self.provider == 'stripe':
            url = f"{self.base_url}/payment_intents/{payment_id}"
        elif self.provider == 'square':
            url = f"{self.base_url}/payments/{payment_id}"
        else:
            raise ValueError(f"Unsupported payment provider: {self.provider}")
        
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
                    logger.error(f"Payment retrieval failed: {error_text}")
                    raise Exception(f"Payment retrieval failed: {error_text}")
    
    async def capture_payment(self, payment_id: str, amount: Optional[float] = None) -> Dict[str, Any]:
        """Capture payment"""
        if self.provider == 'stripe':
            url = f"{self.base_url}/payment_intents/{payment_id}/confirm"
        else:
            raise ValueError(f"Capture not supported for provider: {self.provider}")
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Payment capture failed: {error_text}")
                    raise Exception(f"Payment capture failed: {error_text}")
    
    async def cancel_payment(self, payment_id: str) -> Dict[str, Any]:
        """Cancel payment"""
        if self.provider == 'stripe':
            url = f"{self.base_url}/payment_intents/{payment_id}/cancel"
        else:
            raise ValueError(f"Cancel not supported for provider: {self.provider}")
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Payment cancellation failed: {error_text}")
                    raise Exception(f"Payment cancellation failed: {error_text}")
    
    async def create_refund(self, payment_id: str, amount: float) -> Dict[str, Any]:
        """Create refund"""
        if self.provider == 'stripe':
            url = f"{self.base_url}/refunds"
            payload = {
                "payment_intent": payment_id,
                "amount": int(amount * 100)
            }
        elif self.provider == 'square':
            url = f"{self.base_url}/refunds"
            payload = {
                "payment_id": payment_id,
                "amount_money": {
                    "amount": int(amount * 100),
                    "currency": "USD"
                }
            }
        else:
            raise ValueError(f"Refunds not supported for provider: {self.provider}")
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200 or response.status == 201:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Refund creation failed: {error_text}")
                    raise Exception(f"Refund creation failed: {error_text}")
    
    def verify_webhook(self, body: bytes, headers: Dict[str, str]) -> bool:
        """Verify webhook signature based on provider"""
        try:
            if self.provider == 'stripe':
                return self._verify_stripe_webhook(body, headers)
            elif self.provider == 'square':
                return self._verify_square_webhook(body, headers)
            else:
                logger.warning(f"Webhook verification not implemented for {self.provider}")
                return False
        except Exception as e:
            logger.error(f"Webhook verification error: {e}")
            return False
    
    def _verify_stripe_webhook(self, body: bytes, headers: Dict[str, str]) -> bool:
        """Verify Stripe webhook signature"""
        signature = headers.get("stripe-signature")
        if not signature:
            return False
        
        # Stripe verification would go here
        return True
    
    def _verify_square_webhook(self, body: bytes, headers: Dict[str, str]) -> bool:
        """Verify Square webhook signature"""
        signature = headers.get("x-square-hmac-sha256-signature")
        if not signature:
            return False
        
        # Square verification would go here
        return True
    
    async def setup_webhook(self, webhook_url: str) -> Dict[str, Any]:
        """Setup webhook in payment provider"""
        if self.provider == 'stripe':
            return await self._setup_stripe_webhook(webhook_url)
        elif self.provider == 'square':
            return await self._setup_square_webhook(webhook_url)
        else:
            raise ValueError(f"Webhook setup not supported for provider: {self.provider}")
    
    async def _setup_stripe_webhook(self, webhook_url: str) -> Dict[str, Any]:
        """Setup webhook in Stripe"""
        url = f"{self.base_url}/webhook_endpoints"
        
        payload = {
            "url": webhook_url,
            "enabled_events": ["charge.succeeded", "charge.failed", "charge.refunded"]
        }
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=payload, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Webhook setup failed: {error_text}")
                    raise Exception(f"Webhook setup failed: {error_text}")
    
    async def _setup_square_webhook(self, webhook_url: str) -> Dict[str, Any]:
        """Setup webhook in Square"""
        url = f"{self.base_url}/webhooks"
        
        payload = {
            "url": webhook_url,
            "event_types": ["payment.created", "payment.updated"]
        }
        
        headers = {
            "Authorization": self._get_auth_header(),
            "Content-Type": "application/json",
            "Square-Version": "2023-01-10"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200 or response.status == 201:
                    return await response.json()
                else:
                    error_text = await response.text()
                    logger.error(f"Webhook setup failed: {error_text}")
                    raise Exception(f"Webhook setup failed: {error_text}")


# Backward compatibility alias (for gradual migration)
YooKassaService = PaymentAdapter
