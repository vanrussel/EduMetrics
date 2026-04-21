"""
Data cleaning module for student performance dataset.

This module provides functions to clean and normalize raw student performance data
by removing outliers, handling missing values, and adding normalized features.
"""


def clean(df):
    """
    Clean and normalize student performance data.
    
    Args:
        df (pandas.DataFrame): Raw student performance data
        
    Returns:
        pandas.DataFrame: Cleaned and normalized data
        
    Raises:
        KeyError: If required columns are missing from the dataset
        ValueError: If DataFrame becomes empty after cleaning
        Exception: For other processing errors
    """
    try:
        # Normalize exam scores to 0-1 scale for better comparability
        df["exam_score_normalized"] = (
            (df["exam_score"] - df["exam_score"].min()) /
            (df["exam_score"].max() - df["exam_score"].min())
        )
    except KeyError:
        raise KeyError("Column 'exam_score' not found in dataset")

    try:
        # Remove outliers using Interquartile Range (IQR) method
        Q1 = df["exam_score"].quantile(0.25)
        Q3 = df["exam_score"].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        df = df[(df["exam_score"] >= lower) & (df["exam_score"] <= upper)]
    except Exception as e:
        raise Exception(f"Failed to remove outliers: {e}")

    try:
        # Remove rows with missing values to ensure data quality
        df = df.dropna()
    except Exception as e:
        raise Exception(f"Failed to drop NaN values: {e}")

    # Validate that DataFrame still contains data after cleaning
    if df.empty:
        raise ValueError("DataFrame is empty after cleaning — check your dataset")

    return df