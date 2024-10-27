from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import user_routes, auth_routes, vessel_routes
from .database import engine, Base

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3001",  # Frontend URL
    "http://127.0.0.1:3001",  # You can add other allowed origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the routes
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(vessel_routes.router)

# Run the app using: uvicorn app.main:app --reload
