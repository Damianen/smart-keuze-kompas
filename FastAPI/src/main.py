from fastapi import FastAPI, Security, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from src.ai_model import recommend
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import os
from dotenv import load_dotenv


load_dotenv()

# Token configuratie via environment variable
API_TOKEN = os.getenv("API_TOKEN")


api_key_header = APIKeyHeader(name="Token", auto_error=False)

app = FastAPI()


# Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
        return response


app.add_middleware(SecurityHeadersMiddleware)

# CORS configuratie - allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def verify_api_key(api_token: str = Security(api_key_header)):
    if not API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server missing API token"
        )
    if not api_token or api_token != API_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token"
        )
    return api_token

class Request(BaseModel):
    student_text: str
    limit: int = 5

@app.post("/recommend")
def get_recommendations(req: Request, api_key: str = Security(verify_api_key)):
    return {"recommendations": recommend(req.student_text, req.limit)}
