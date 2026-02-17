"""
Simple FastAPI Authentication + AI Chat Example
------------------------------------------------
Run: uvicorn auth_app:app --reload
Open: http://127.0.0.1:8000/login.html
Login: admin@example.com / password123
"""
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from pathlib import Path

# Import chat service
from chat import stream_chat_response

load_dotenv()
app = FastAPI(title="AI Chat App")
app.mount("/static", StaticFiles(directory=Path(__file__).parent), name="static")

# Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChatRequest(BaseModel):
    message: str

# Demo users
VALID_USERS = {
    "admin@example.com": "password123",
    "user@test.com": "mypassword"
}

# HTML Pages
@app.get("/")
async def root():
    return FileResponse("login.html")

@app.get("/login.html")
async def serve_login():
    return FileResponse("login.html")

@app.get("/chat.html")
async def serve_chat():
    return FileResponse("chat.html")

# Auth Endpoint
@app.post("/api/login")
async def login(credentials: LoginRequest):
    if credentials.email not in VALID_USERS:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if VALID_USERS[credentials.email] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"success": True, "message": "Login successful!", "user_email": credentials.email}

# Chat Endpoint with Streaming
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        return StreamingResponse(stream_chat_response(request.message), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
