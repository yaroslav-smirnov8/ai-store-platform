import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from services.payment_adapter import PaymentAdapter
from config import settings

@pytest.mark.asyncio
async def test_payment_adapter_create_payment_success():
    # Setup
    adapter = PaymentAdapter()
    amount = 100.00
    description = "Test Payment"
    return_url = "http://example.com"
    
    mock_response_data = {
        "id": "pi_1234567890",
        "status": "requires_payment_method",
        "amount": 10000,
        "currency": "usd"
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
        result = await adapter.create_payment(amount, description, return_url)
        
        # Verify
        assert result["id"] == mock_response_data["id"]
        assert result["status"] == "requires_payment_method"
        
        # Check if called with correct args
        call_args = mock_post.call_args
        url = call_args[0][0]
        kwargs = call_args[1]
        
        assert "payment_intents" in url or "payments" in url
        assert kwargs["data"]["amount"] == 10000 or kwargs["json"]["amount"]["value"] == "100.00"

@pytest.mark.asyncio
async def test_payment_adapter_create_payment_failure():
    adapter = PaymentAdapter()
    
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
