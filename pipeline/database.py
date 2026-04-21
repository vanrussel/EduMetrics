"""
Database operations module for EduMetrics pipeline.

This module handles inserting cleaned student performance data into the Supabase database
with proper error handling and batch processing for large datasets.
"""

from client import supabase


def insert_to_db(df, table):
    """
    Insert DataFrame data into Supabase database table.
    
    Args:
        df (pandas.DataFrame): Data to insert
        table (str): Target table name
        
    Raises:
        ValueError: If DataFrame is empty
        Exception: For database insertion errors
    """
    if df.empty:
        raise ValueError("Cannot insert empty DataFrame into the database")

    try:
        # Convert DataFrame to list of dictionaries for Supabase insertion
        records = df.to_dict(orient="records")
    except Exception as e:
        raise Exception(f"Failed to convert DataFrame to records: {e}")

    # Configure batch processing for large datasets
    batch_size = 500
    total = len(records)

    # Process data in batches to avoid API limits and improve reliability
    for i in range(0, total, batch_size):
        batch = records[i:i + batch_size]

        try:
            response = supabase.table(table).insert(batch).execute()
        except Exception as e:
            raise Exception(f"Failed to insert batch {i}–{i + len(batch)} into '{table}': {e}")

        # Validate that insertion was successful
        if not response.data:
            raise Exception(f"Batch {i}–{i + len(batch)} returned no data — insert may have failed")