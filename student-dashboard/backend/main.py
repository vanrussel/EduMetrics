"""
EduMetrics Backend API Main Application.

This FastAPI application provides REST API endpoints for student performance
analytics with CORS support for frontend integration.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes.analytics import router as analytics_router
from routes.api_routes import router as ai_router

# Initialize FastAPI application
app = FastAPI(
    title="EduMetrics API",
    description="Student Performance Analytics API",
    version="1.0.0"
)

# Configure CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):

    if request.method == "OPTIONS":
        response = JSONResponse(content={}, status_code=200)
    else:
        response = await call_next(request)

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# Include analytics router with /analytics prefix
app.include_router(analytics_router, prefix="/analytics")
app.include_router(ai_router, prefix="/api/ai")

@app.get("/")
def read_root():
    return {"message": "EduMetrics API is running successfully!"}