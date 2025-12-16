from fastapi import FastAPI
from app import predict


app = FastAPI(title="My FastAPI App", description="A simple FastAPI application.")
app.include_router(predict.router, prefix="/api/v1")
