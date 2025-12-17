from fastapi import FastAPI
from pydantic import BaseModel
from src.ai_model import recommend

app = FastAPI()

class Request(BaseModel):
    student_text: str
    limit: int = 5

@app.post("/recommend")
def get_recommendations(req: Request):
    return {"recommendations": recommend(req.student_text, req.limit)}
