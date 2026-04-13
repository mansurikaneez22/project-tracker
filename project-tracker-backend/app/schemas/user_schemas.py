from pydantic import BaseModel


class UserBase(BaseModel):
    user_name: str
    email_id: str
    job_profile: str


class UserResponse(UserBase):
    user_id: int

    class Config:
        from_attributes = True  

class UserCreate(BaseModel):
    user_name: str
    email_id: str
    job_profile: str 
