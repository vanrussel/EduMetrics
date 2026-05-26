"""
Cloud storage operations module for EduMetrics backend.

This module handles downloading CSV files from Supabase storage,
providing proper error handling and data conversion utilities.
"""

import io
import pandas as pd
from client import supabase


def download_csv(bucket, path):
    """
    Download CSV file from Supabase storage and parse as DataFrame.
    
    Args:
        bucket (str): Storage bucket name
        path (str): File path within bucket
        
    Returns:
        pandas.DataFrame: Parsed CSV data
        
    Raises:
        Exception: For download or parsing errors
    """
    try:
        response = supabase.storage.from_(bucket).download(path)
    except Exception as e:
        raise Exception(f"Failed to download '{path}' from bucket '{bucket}': {e}")

    try:
        return pd.read_csv(io.BytesIO(response))
    except Exception as e:
        raise Exception(f"Failed to parse CSV from '{path}': {e}")