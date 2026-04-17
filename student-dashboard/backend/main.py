# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analytics import router as analytics_router

app = FastAPI()
# app — the main FastAPI application instance

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://edu-metrics-fr3i.vercel.app", "http://localhost:5173"],
    # allow_origins=["*"] — allows requests from any origin
    # in production you'd replace "*" with your actual Vercel frontend URL
    allow_methods=["*"],
    # allow_methods=["*"] — allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
    # allow_headers=["*"] — allows all request headers
)

app.include_router(analytics_router, prefix="/analytics")
# .include_router() — registers the analytics router with the app
# prefix="/analytics" — all routes in analytics.py get prefixed with /analytics
# e.g. /kpis becomes /analytics/kpis