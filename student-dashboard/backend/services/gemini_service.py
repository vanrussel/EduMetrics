"""
Gemini AI service module for EduMetrics pipeline.

This module provides AI-powered analysis of student performance data by
integrating with the Google Gemini API. It fetches the dataset directly
from Supabase storage to generate insights, answer questions, and
categorize records.
"""

import pandas as pd
from google import genai
from dotenv import load_dotenv
from .storage import download_csv

# Load environment variables from .env file
load_dotenv()

# Initialize Gemini client — automatically picks up GEMINI_API_KEY from .env
client = genai.Client()

# Supabase storage coordinates for the student performance dataset
BUCKET = "datasets"
RAW_PATH = "raw/StudentPerformanceFactors.csv"


def get_data_context():
    """
    Fetch the student performance CSV from Supabase storage and extract
    a concise summary string for use as AI prompt context.

    Returns:
        str: A human-readable summary of the dataset (row count and average
             exam score), or a descriptive error message if retrieval fails.
    """
    try:
        df = download_csv(BUCKET, RAW_PATH)
        df.columns = df.columns.str.lower()

        total = len(df)
        avg_score = (
            round(df["exam_score"].mean(), 2)
            if "exam_score" in df.columns
            else "N/A"
        )
        return (
            f"Dataset context: It has {total} student rows. "
            f"The average exam score is {avg_score}%."
        )
    except Exception as e:
        return f"Dataset context: Could not retrieve dataset from storage: {e}"


def generate_insight(data):
    """
    Generate AI-powered insights, trends, and recommendations for the
    student performance dataset.

    Args:
        data (str): Additional context or summary data to include in the prompt.

    Returns:
        str: Gemini-generated analysis covering key insights, trends,
             and actionable recommendations.
    """
    context = get_data_context()
    prompt = f"""
    Analyze this student performance dataset and provide:
    1. Key insights
    2. Trends
    3. Recommendations

    Dataset Summary Context:
    {context}

    Additional Context:
    {data}
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text


def ask_dataset_question(question, data):
    """
    Answer a natural-language question about the student performance dataset
    using Gemini as a data assistant.

    Args:
        question (str): The user's question about the dataset.
        data (str): Additional context or data snippet to support the answer.

    Returns:
        str: Gemini's answer to the question, or an error message if the
             API call fails or returns an empty response.
    """
    try:
        context = get_data_context()
        prompt = f"""
        You are Billy AI, a supportive, smart, and slightly witty data assistant for the EduMetrics dashboard.

        Dataset Summary Context:
        {context}

        User Question:
        {question}

        Answer the question clearly and concisely using the dataset.
        """
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if not response or not response.text:
            return "Gemini API returned an empty response."

        return response.text

    except Exception as e:
        return f"Python Gemini Service Error: {str(e)}"


def categorize_record(record):
    """
    Use Gemini to categorize a single student record and generate
    descriptive tags.

    Args:
        record (str | dict): The student record to categorize, as a string
                             or dict representation.

    Returns:
        str: A JSON-formatted string containing:
             - "category" (str): The assigned category label.
             - "tags" (list[str]): Relevant descriptive tags for the record.
    """
    prompt = f"""
    Categorize this record and generate tags.

    Record:
    {record}

    Return JSON format:
    {{
        "category": "",
        "tags": []
    }}
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text