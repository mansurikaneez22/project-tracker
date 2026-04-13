from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.company import Company
from app.schemas.company_schemas import CompanyResponse

router = APIRouter(
    prefix="/api/v1/company",
    tags=["Company"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get all companies
@router.get("/", response_model=list[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()
