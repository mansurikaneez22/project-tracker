import socketio
from fastapi import FastAPI, WebSocket
from app.websocket_manager import manager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.socket_instance import sio

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
from app.api.v1.routes.admin_routes import router as admin_router
from app.api.v1.routes.pm_dashboard_routes import router as pm_dashboard_router
from app.api.v1.routes.sprint_routes import router as sprint_router
from app.api.v1.routes.activity_routes import router as activity_router
from app.api.v1.routes.contributor_routes import router as contributor_router



#  create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Tracker API")

socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

 # This wraps FastAPI + Socket.IO

# ---------- CORS ----------
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Static files ----------
os.makedirs("uploads/profile_pics", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ---------- Socket.IO events ----------
@sio.event
async def connect(sid, environ):
    print("Client connected:", sid)

@sio.event
async def join(sid, user_id):
    await sio.save_session(sid, {"user_id": user_id})
    await sio.enter_room(sid, str(user_id))
    print(f"User {user_id} joined room")

@sio.event
async def disconnect(sid):
    print("Client disconnected:", sid)

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
app.include_router(admin_router)
app.include_router(pm_dashboard_router)
app.include_router(sprint_router)
app.include_router(activity_router)
app.include_router(contributor_router)