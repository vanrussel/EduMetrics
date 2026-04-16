import io
import pandas as pd
from client import supabase

def download_csv(bucket, path):
    try:
        response = supabase.storage.from_(bucket).download(path)
        # downloads the file as raw bytes
    except Exception as e:
        raise Exception(f"Failed to download '{path}' from bucket '{bucket}': {e}")
        # wraps the error with more context so you know exactly which file failed

    try:
        return pd.read_csv(io.BytesIO(response))
        # parses the bytes into a DataFrame
    except Exception as e:
        raise Exception(f"Failed to parse CSV from '{path}': {e}")
        # separate try/except so you know if the issue is downloading or parsing

def upload_csv(df, bucket, path):
    try:
        cleaned_csv = df.to_csv(index=False).encode("utf-8")
        # converts DataFrame to CSV bytes
    except Exception as e:
        raise Exception(f"Failed to convert DataFrame to CSV: {e}")

    try:
        supabase.storage.from_(bucket).upload(
            path,
            cleaned_csv,
            {"content-type": "text/csv", "x-upsert": "true"}
        )
    except Exception as e:
        raise Exception(f"Failed to upload '{path}' to bucket '{bucket}': {e}")