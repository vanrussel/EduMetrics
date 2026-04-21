"""
EduMetrics Backend API Main Application.

This FastAPI application provides REST API endpoints for student performance
analytics with CORS support for frontend integration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analytics import router as analytics_router

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

# Include analytics router with /analytics prefix
app.include_router(analytics_router, prefix="/analytics")