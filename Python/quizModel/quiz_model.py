from pydantic import BaseModel, Field
from datetime import datetime

class updateMarks(BaseModel):
  createdBy: str
  quizname: str
  marks:str
  studentName:str

class quizDetails(BaseModel):
    createdBy: str
    quizname: str
    quizduration:str
    quizSection:str
    quizFile:str
    createdTime: datetime = Field(default_factory=datetime.utcnow)
