from pydantic import BaseModel, Field
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
    user_id: int 
    user_name: str 
    job_profile: str 

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(
        ...,
        min_length=8,
        max_length=20
    )

class UserResponse(BaseModel):
    user_id: int
    user_name: str
    email: str
    job_profile: str

    class Config: 
        orm_mode = True