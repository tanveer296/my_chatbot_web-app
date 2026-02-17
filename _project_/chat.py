"""
Chat Service Module
Handles AI chat functionality using OpenRouter API
"""
import os
import json
import httpx
from dotenv import load_dotenv
from system_prompt import CHAT_SYSTEM_PROMPT

load_dotenv()

OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")

async def stream_chat_response(message: str, model: str = "arcee-ai/trinity-large-preview:free"):
    """
    Stream chat responses from OpenRouter API
    
    Args:
        message: User's message
        model: AI model to use
        
    Yields:
        str: Chunks of the AI response
        
    Raises:
        ValueError: If API key is missing
        Exception: If API request fails
    """
    if not OPENROUTER_KEY:
        raise ValueError("OpenRouter API key not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": CHAT_SYSTEM_PROMPT},
                        {"role": "user", "content": message}
                    ],
                    "stream": True
                },
                timeout=60.0
            ) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    raise Exception(f"API Error {response.status_code}: {error_text.decode()}")
                
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        try:
                            chunk = json.loads(data)
                            content = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            pass
                            
    except httpx.HTTPError as e:
        raise Exception(f"Network error: {str(e)}")
