from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .utils.env_reader import get_frontend_url
from .api.auth.routes import router as AuthRouter
from .api.file_upload.routes import router as FileRouter
from .core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[get_frontend_url()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes
app.include_router(AuthRouter)
app.include_router(FileRouter)

@app.get("/")
def health_route() -> str:
    return "Server is running."
