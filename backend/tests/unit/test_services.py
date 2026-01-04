import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from services.yookassa_service import YooKassaService
from config import settings

@pytest.mark.asyncio
async def test_yookassa_create_payment_success():
    # Setup
    service = YooKassaService()
    amount = 100.00
    description = "Test Payment"
    return_url = "http://example.com"
    
    mock_response_data = {
        "id": "22e12f66-000f-5000-8000-18db351245c7",
        "status": "pending",
        "amount": {"value": "100.00", "currency": "RUB"},
        "confirmation": {"type": "redirect", "confirmation_url": "https://yookassa.ru/checkout"}
    }
    
    # Mock aiohttp.ClientSession
    with patch("aiohttp.ClientSession.post") as mock_post:
        # Configure the mock to return a context manager
        mock_context = AsyncMock()
        mock_response = AsyncMock()
        mock_response.status = 200
        mock_response.json.return_value = mock_response_data
        
        mock_context.__aenter__.return_value = mock_response
        mock_post.return_value = mock_context
        
        # Execute
        result = await service.create_payment(amount, description, return_url)
        
        # Verify
        assert result["id"] == mock_response_data["id"]
        assert result["status"] == "pending"
        
        # Check if called with correct args
        call_args = mock_post.call_args
        url = call_args[0][0]
        kwargs = call_args[1]
        
        assert url == "https://api.yookassa.ru/v3/payments"
        assert kwargs["json"]["amount"]["value"] == "100.00"
        assert kwargs["json"]["confirmation"]["return_url"] == return_url

@pytest.mark.asyncio
async def test_yookassa_create_payment_failure():
    service = YooKassaService()
    
    with patch("aiohttp.ClientSession.post") as mock_post:
        mock_context = AsyncMock()
        mock_response = AsyncMock()
        mock_response.status = 400
        mock_response.text.return_value = "Bad Request"
        
        mock_context.__aenter__.return_value = mock_response
        mock_post.return_value = mock_context
        
        # Execute & Verify
        with pytest.raises(Exception) as excinfo:
            await service.create_payment(100.00, "Test", "url")
        
        assert "Payment creation failed" in str(excinfo.value)
