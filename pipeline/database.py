from client import supabase

def insert_to_db(df, table):
    if df.empty:
        raise ValueError("Cannot insert empty DataFrame into the database")
        # catches empty DataFrames before even attempting to insert

    try:
        records = df.to_dict(orient="records")
        # converts DataFrame into a list of dicts
    except Exception as e:
        raise Exception(f"Failed to convert DataFrame to records: {e}")

    batch_size = 500
    total = len(records)
    # total — total number of rows to insert

    for i in range(0, total, batch_size):
        batch = records[i:i + batch_size]
        # slices the records into chunks of 500

        try:
            response = supabase.table(table).insert(batch).execute()
        except Exception as e:
            raise Exception(f"Failed to insert batch {i}–{i + len(batch)} into '{table}': {e}")
            # tells you exactly which batch failed and which table

        if not response.data:
            raise Exception(f"Batch {i}–{i + len(batch)} returned no data — insert may have failed")