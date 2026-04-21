"""
Cloud storage operations module for EduMetrics pipeline.

This module handles downloading and uploading CSV files to/from Supabase storage,
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

def upload_csv(df, bucket, path):
    """
    Upload DataFrame as CSV file to Supabase storage.
    
    Args:
        df (pandas.DataFrame): Data to upload
        bucket (str): Storage bucket name
        path (str): Destination file path
        
    Raises:
        Exception: For conversion or upload errors
    """
    try:
        # Convert DataFrame to CSV bytes with UTF-8 encoding
        cleaned_csv = df.to_csv(index=False).encode("utf-8")
    except Exception as e:
        raise Exception(f"Failed to convert DataFrame to CSV: {e}")

    try:
        # Upload file with proper content type and upsert flag
        supabase.storage.from_(bucket).upload(
            path,
            cleaned_csv,
            {"content-type": "text/csv", "x-upsert": "true"}
        )
    except Exception as e:
        raise Exception(f"Failed to upload '{path}' to bucket '{bucket}': {e}")