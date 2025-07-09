from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.status_routes import router as status_router
from routes.health import router as health
import uvicorn
from os import environ



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
path_version = f"/api/{environ.get('VERSION', 'v1')}"

app.include_router(auth_router, prefix=f"{path_version}/auth")
app.include_router(status_router, prefix=f"{path_version}/status")
app.include_router(health, prefix=f"{path_version}/health")
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
