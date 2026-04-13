from passlib.context import CryptContext

# Initialize CryptContext with Argon2
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """
    Hash the given password using Argon2.
    No 72-byte limit like bcrypt.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify the given plain password against the hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)
