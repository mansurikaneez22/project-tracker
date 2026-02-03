from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.database import engine, Base
import app.models  #  REQUIRED – models register hote hain

from app.api.v1.routes.project_routes import router as project_router
from app.api.v1.routes.board_routes import router as board_router
from app.api.v1.routes.task_routes import router as task_router
from app.api.v1.routes.user_routes import router as user_router
from app.api.v1.routes.auth_routes import router as auth_router
from app.api.v1.routes.department_routes import router as department_router
from app.api.v1.routes.role_routes import router as role_router
from app.api.v1.routes.project_member_routes import router as project_member_router
from app.api.v1.routes.team_routes import router as team_router
from app.api.v1.routes.team_project_routes import router as team_project_router
from app.api.v1.routes.company_routes import router as company_router
from app.api.v1.routes.test_routes import router as test_router
from app.api.v1.routes.board_task_mapping_routes import router as board_task_mapping_router
from app.api.v1.routes.attachment_routes import router as attachment_router
from app.api.v1.routes.comment_routes import router as comment_router
from app.api.v1.routes.notification_routes import router as notification_router
from app.api.v1.routes.team_member_routes import router as team_member_router 

app = FastAPI(title="Project Tracker API")

#  create tables
Base.metadata.create_all(bind=engine)

#CORS fix for frontend error
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "Project Tracker Backend Running"}

# include all routers
app.include_router(project_router)
app.include_router(board_router)
app.include_router(task_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(department_router)
app.include_router(role_router)
app.include_router(project_member_router)
app.include_router(team_router)
app.include_router(team_project_router)
app.include_router(company_router)
app.include_router(test_router)
app.include_router(board_task_mapping_router)
app.include_router(attachment_router)
app.include_router(comment_router)
app.include_router(notification_router)
app.include_router(team_member_router)