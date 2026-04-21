from storage import download_csv, upload_csv
from cleaner import clean
from database import insert_to_db

RAW_PATH = "raw/StudentPerformanceFactors.csv"
CLEANED_PATH = "cleaned/StudentPerformanceFactors_cleaned.csv"
BUCKET = "datasets"
TABLE = "student_performance"

def main():
    """
    Main pipeline orchestrator that processes student performance data.
    
    Pipeline stages:
    1. Download raw CSV from cloud storage
    2. Clean and normalize the data
    3. Upload cleaned data back to storage
    4. Insert cleaned data into database
    """
    print("Starting pipeline...")

    try:
        print("Downloading CSV from storage...")
        df = download_csv(BUCKET, RAW_PATH)
    except Exception as e:
        print(f"[Download Error] {e}")
        return

    try:
        print("Cleaning data...")
        df = clean(df)
    except (KeyError, ValueError) as e:
        print(f"[Cleaning Error] {e}")
        return
    except Exception as e:
        print(f"[Unexpected Cleaning Error] {e}")
        return

    try:
        print("Uploading cleaned CSV to storage...")
        upload_csv(df, BUCKET, CLEANED_PATH)
    except Exception as e:
        print(f"[Upload Error] {e}")
        return

    try:
        print("Inserting data into database...")
        insert_to_db(df, TABLE)
    except Exception as e:
        print(f"[Database Error] {e}")
        return

    print("Pipeline completed successfully")

if __name__ == "__main__":
    main()