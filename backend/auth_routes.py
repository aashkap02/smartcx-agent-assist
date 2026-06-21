from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from pymongo.errors import DuplicateKeyError

from db import users
from auth import hash_password, verify_password, create_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def signup(body: SignupIn):
    doc = {
        "name": body.name,
        "email": body.email.lower(),
        "password": hash_password(body.password),
    }
    try:
        users.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    token = create_token(doc["email"])
    return {"token": token, "user": {"name": doc["name"], "email": doc["email"]}}

@router.post("/login")
def login(body: LoginIn):
    user = users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["email"])
    return {"token": token, "user": {"name": user["name"], "email": user["email"]}}

@router.get("/me")
def me(email: str = Depends(get_current_user)):
    """Protected route: only works with a valid token."""
    user = users.find_one({"email": email}, {"password": 0, "_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user