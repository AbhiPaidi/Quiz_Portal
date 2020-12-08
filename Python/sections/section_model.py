from pydantic import BaseModel, Field
from datetime import datetime

class section(BaseModel):
  studentName: str
  createdTime: datetime = Field(default_factory=datetime.utcnow)
