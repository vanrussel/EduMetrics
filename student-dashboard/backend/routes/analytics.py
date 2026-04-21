"""
Analytics API endpoints for student performance dashboard.

This module provides REST API endpoints for fetching and analyzing
student performance data with optional filtering capabilities.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from client import supabase

# Initialize FastAPI router for analytics endpoints
router = APIRouter()


def fetch(columns: str):
    """
    Fetch specified columns from student_performance table.
    
    Args:
        columns (str): Comma-separated column names to retrieve
        
    Returns:
        list: Retrieved data records
        
    Raises:
        HTTPException: If data not found (404) or server error (500)
    """
    try:
        response = supabase.table("student_performance").select(columns).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No data found")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def apply_filter(data: list, gender: Optional[str]):
    """
    Filter data by gender if specified.
    
    Args:
        data (list): List of data records
        gender (Optional[str]): Gender filter value
        
    Returns:
        list: Filtered data records
    """
    if gender and gender.lower() != "all":
        return [row for row in data if row.get("gender", "").lower() == gender.lower()]
    return data


def group_avg(data: list, group_col: str, value_col: str = "exam_score") -> dict:
    """
    Group data by column and calculate average values.
    
    Args:
        data (list): List of data records
        group_col (str): Column to group by
        value_col (str): Column to calculate average for
        
    Returns:
        dict: Grouped data with average values
    """
    groups = {}
    for row in data:
        key = row.get(group_col, "Unknown")
        val = row.get(value_col)
        if val is None:
            continue
        if key not in groups:
            groups[key] = []
        groups[key].append(val)
    return {k: round(sum(v) / len(v), 2) for k, v in sorted(groups.items())}


def group_count(data: list, group_col: str) -> dict:
    """
    Group data by column and count occurrences.
    
    Args:
        data (list): List of data records
        group_col (str): Column to group by
        
    Returns:
        dict: Grouped data with counts
    """
    counts = {}
    for row in data:
        key = row.get(group_col, "Unknown")
        counts[key] = counts.get(key, 0) + 1
    return counts


@router.get("/kpis")
def get_kpis(gender: Optional[str] = Query(None)):
    """
    Get key performance indicators for student data.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: KPI data including averages and totals
        
    Raises:
        HTTPException: If no data found after filtering
    """
    data = fetch("exam_score, hours_studied, attendance, previous_scores, sleep_hours, tutoring_sessions, gender")
    data = apply_filter(data, gender)

    total = len(data)
    if total == 0:
        raise HTTPException(status_code=404, detail="No data after filter")

    def avg(col):
        """Calculate average for a column, skipping None values."""
        values = [r[col] for r in data if r.get(col) is not None]
        return round(sum(values) / len(values), 2) if values else 0

    return {
        "total_students": total,
        "avg_exam_score": avg("exam_score"),
        "avg_hours_studied": avg("hours_studied"),
        "avg_attendance": avg("attendance"),
        "avg_previous_scores": avg("previous_scores"),
        "avg_sleep_hours": avg("sleep_hours"),
    }


@router.get("/score-distribution")
def get_score_distribution(gender: Optional[str] = Query(None)):
    """
    Get score distribution for student data.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: Score distribution data
    """
    data = fetch("exam_score, gender")
    data = apply_filter(data, gender)

    ranges = {"0-50": 0, "51-60": 0, "61-70": 0, "71-80": 0, "81-90": 0, "91-100": 0}
    for row in data:
        score = row["exam_score"]
        if score <= 50: ranges["0-50"] += 1
        elif score <= 60: ranges["51-60"] += 1
        elif score <= 70: ranges["61-70"] += 1
        elif score <= 80: ranges["71-80"] += 1
        elif score <= 90: ranges["81-90"] += 1
        else: ranges["91-100"] += 1

    return ranges


@router.get("/exam-score-by-school-type")
def get_by_school_type(gender: Optional[str] = Query(None)):
    """
    Get average exam scores grouped by school type.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: Average exam scores by school type
    """
    data = fetch("school_type, exam_score, gender")
    return group_avg(apply_filter(data, gender), "school_type")


@router.get("/exam-score-by-internet-access")
def get_by_internet_access(gender: Optional[str] = Query(None)):
    """
    Get average exam scores grouped by internet access availability.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: Average exam scores by internet access
    """
    data = fetch("internet_access, exam_score, gender")
    return group_avg(apply_filter(data, gender), "internet_access")


@router.get("/exam-score-by-teacher-quality")
def get_by_teacher_quality(gender: Optional[str] = Query(None)):
    """
    Get average exam scores grouped by teacher quality rating.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: Average exam scores by teacher quality
    """
    data = fetch("teacher_quality, exam_score, gender")
    return group_avg(apply_filter(data, gender), "teacher_quality")


@router.get("/gender-distribution")
def get_gender_distribution(gender: Optional[str] = Query(None)):
    """
    Get average exam scores by gender.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: Average exam scores by gender
    """
    data = fetch("gender, exam_score")
    return group_avg(apply_filter(data, gender), "gender")


@router.get("/school-type-distribution")
def get_school_type_dist(gender: Optional[str] = Query(None)):
    """
    Get student count distribution by school type.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: Student counts by school type
    """
    data = fetch("school_type, gender")
    return group_count(apply_filter(data, gender), "school_type")


@router.get("/internet-access-distribution")
def get_internet_access_dist(gender: Optional[str] = Query(None)):
    """
    Get student count distribution by internet access availability.
    
    Args:
        gender (Optional[str]): Optional gender filter
        
    Returns:
        dict: Student counts by internet access
    """
    data = fetch("internet_access, gender")
    return group_count(apply_filter(data, gender), "internet_access")