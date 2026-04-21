"""
Supabase client configuration for EduMetrics backend API.

This module initializes and exports a Supabase client instance for database
operations used by the analytics endpoints.
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve Supabase credentials from environment
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

# Validate that required credentials are present
if not url or not key:
    raise EnvironmentError("SUPABASE_URL or SUPABASE_KEY is missing from .env")

# Initialize and export Supabase client
supabase = create_client(url, key)