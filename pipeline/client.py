import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    raise EnvironmentError("SUPABASE_URL or SUPABASE_KEY is missing from .env")
    # raises an error immediately if credentials are missing
    # prevents confusing errors later when trying to connect

supabase = create_client(url, key)