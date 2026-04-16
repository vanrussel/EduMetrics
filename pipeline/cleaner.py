def clean(df):
    try:
        df["exam_score_normalized"] = (
            (df["exam_score"] - df["exam_score"].min()) /
            (df["exam_score"].max() - df["exam_score"].min())
        )
        # normalizes exam_score to a 0-1 scale
    except KeyError:
        raise KeyError("Column 'exam_score' not found in dataset")
        # KeyError — raised when a column name doesn't exist in the DataFrame
        # gives a clear message instead of a confusing pandas error

    try:
        Q1 = df["exam_score"].quantile(0.25)
        Q3 = df["exam_score"].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        df = df[(df["exam_score"] >= lower) & (df["exam_score"] <= upper)]
        # removes outliers using IQR method
    except Exception as e:
        raise Exception(f"Failed to remove outliers: {e}")

    try:
        df = df.dropna()
        # drops all rows with NaN values
    except Exception as e:
        raise Exception(f"Failed to drop NaN values: {e}")

    if df.empty:
        raise ValueError("DataFrame is empty after cleaning — check your dataset")
        # ValueError — raised when a value is not what was expected
        # prevents inserting an empty table into the database

    return df