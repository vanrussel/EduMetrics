# EduMetrics - Student Performance Analytics Dashboard

A comprehensive student performance analytics platform that provides real-time insights and visualizations for educational institutions. EduMetrics processes student data through an automated pipeline and presents actionable analytics through an interactive dashboard.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Data Pipeline](#data-pipeline)
- [Contributing](#contributing)
- [License](#license)

## Features

### Analytics Dashboard
- **Real-time KPIs**: Track total students, average exam scores, attendance rates, study hours, and sleep patterns
- **Interactive Visualizations**: Score distribution curves, demographic breakdowns, and performance trends
- **Gender-based Filtering**: Analyze data by gender for comparative insights
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Data Processing Pipeline
- **Automated Data Cleaning**: Remove outliers, handle missing values, and normalize metrics
- **Batch Processing**: Efficient processing of large datasets with configurable batch sizes
- **Error Handling**: Comprehensive error tracking and recovery mechanisms
- **Cloud Storage Integration**: Seamless integration with Supabase storage and database

### Key Metrics Tracked
- Academic performance (exam scores, previous scores)
- Study habits (hours studied, tutoring sessions)
- Attendance and engagement metrics
- Demographic factors (school type, internet access, teacher quality)
- Lifestyle factors (sleep hours)

## Architecture

EduMetrics follows a modern microservices architecture with clear separation of concerns:

```
EduMetrics/
  pipeline/           # Data processing pipeline
  student-dashboard/  # Frontend and backend services
    frontend/         # React analytics dashboard
    backend/          # FastAPI REST API
```

### Data Flow
1. **Raw Data** uploaded to cloud storage
2. **Pipeline** processes and cleans the data
3. **Cleaned Data** stored in database
4. **API** provides endpoints for analytics
5. **Frontend** consumes API for visualizations

## Technology Stack

### Frontend
- **React 19** - Modern UI framework with hooks and concurrent features
- **Vite 8** - Fast development server and build tool
- **Tailwind CSS 4** - Utility-first CSS framework for responsive design
- **Chart.js 4** - Powerful data visualization library
- **Axios** - HTTP client for API communication

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Supabase** - Backend-as-a-Service providing database and storage
- **Python 3.11+** - Core programming language
- **Uvicorn** - ASGI server for production deployment

### Data Pipeline
- **Pandas** - Data manipulation and analysis
- **Python-dotenv** - Environment variable management
- **Supabase Python Client** - Database and storage operations

## Prerequisites

Before installing EduMetrics, ensure you have the following:

- **Node.js 18+** and **npm** or **yarn**
- **Python 3.11+** with **pip**
- **Supabase Account** (for database and storage)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/EduMetrics.git
cd EduMetrics
```

### 2. Set Up Environment Variables

Create environment files for each service:

#### Backend Environment
```bash
cd student-dashboard/backend
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

#### Frontend Environment
```bash
cd ../frontend
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

#### Pipeline Environment
```bash
cd ../../pipeline
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Install Dependencies

#### Backend Dependencies
```bash
cd student-dashboard/backend
pip install -r requirements.txt
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### Pipeline Dependencies
```bash
cd ../../pipeline
pip install -r requirements.txt
```

### 4. Database Setup

1. Create a new project in your Supabase dashboard
2. Run the SQL schema to create the `student_performance` table:

```sql
CREATE TABLE student_performance (
    id SERIAL PRIMARY KEY,
    exam_score DECIMAL(5,2),
    hours_studied DECIMAL(4,2),
    attendance DECIMAL(5,2),
    previous_scores DECIMAL(5,2),
    sleep_hours DECIMAL(3,1),
    tutoring_sessions INTEGER,
    gender VARCHAR(10),
    school_type VARCHAR(50),
    internet_access VARCHAR(20),
    teacher_quality VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Configuration

### Supabase Setup

1. **Create Project**: Sign up at [Supabase](https://supabase.com) and create a new project
2. **Get Credentials**: Find your project URL and anon key in Settings > API
3. **Set Up Storage**: Create a storage bucket named `datasets` for raw and cleaned data
4. **Configure CORS**: Add your frontend URL to allowed origins

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon/public key | Yes |
| `VITE_API_URL` | Backend API URL | Yes |

## Running the Application

### 1. Start the Backend API

```bash
cd student-dashboard/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 2. Start the Frontend

```bash
cd ../frontend
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### 3. Run the Data Pipeline (Optional)

```bash
cd ../../pipeline
python main.py
```

This processes raw data and populates the database.

## Project Structure

```
EduMetrics/
  README.md                    # This file
  LICENSE                      # MIT License
  .gitignore                   # Git ignore patterns
  
  pipeline/                    # Data processing pipeline
    main.py                    # Pipeline orchestrator
    client.py                  # Supabase client configuration
    cleaner.py                 # Data cleaning operations
    database.py                # Database insertion logic
    storage.py                 # Cloud storage operations
    requirements.txt           # Python dependencies
    
  student-dashboard/           # Main application
    package.json               # Root package configuration
    
    backend/                   # FastAPI REST API
      main.py                  # API application entry point
      client.py                # Supabase client
      routes/
        analytics.py           # Analytics endpoints
      requirements.txt         # Python dependencies
      .env                     # Environment variables
      vercel.json              # Deployment configuration
      
    frontend/                  # React dashboard
      src/
        App.jsx               # Main application component
        api/
          analytics.js         # API client functions
        components/
          BarChart.jsx        # Bar chart component
          DoughnutChart.jsx   # Doughnut chart component
          LineChart.jsx       # Line chart component
          PieChart.jsx        # Pie chart component
          KPICards.jsx        # KPI cards component
          Filter.jsx          # Gender filter component
      package.json            # Frontend dependencies
      .env                    # Environment variables
```

## API Documentation

### Base URL
`http://localhost:8000/analytics`

### Endpoints

#### Key Performance Indicators
```http
GET /kpis?gender={gender}
```
Returns overall performance metrics.

#### Score Distribution
```http
GET /score-distribution?gender={gender}
```
Returns score ranges and student counts.

#### Demographic Analytics
```http
GET /exam-score-by-school-type?gender={gender}
GET /exam-score-by-internet-access?gender={gender}
GET /exam-score-by-teacher-quality?gender={gender}
```

#### Distribution Data
```http
GET /gender-distribution?gender={gender}
GET /school-type-distribution?gender={gender}
GET /internet-access-distribution?gender={gender}
```

### Query Parameters
- `gender` (optional): Filter by `Male`, `Female`, or `All` (default)

### Response Format
All endpoints return JSON with appropriate data structures. Example:

```json
{
  "total_students": 1250,
  "avg_exam_score": 78.5,
  "avg_hours_studied": 12.3,
  "avg_attendance": 92.1,
  "avg_previous_scores": 75.2,
  "avg_sleep_hours": 7.8
}
```

## Data Pipeline

The EduMetrics pipeline processes raw student performance data through several stages:

### Pipeline Stages

1. **Data Extraction**
   - Downloads raw CSV files from cloud storage
   - Validates file integrity and format

2. **Data Cleaning**
   - Removes statistical outliers using IQR method
   - Handles missing values through strategic deletion
   - Normalizes exam scores to 0-1 scale
   - Validates data quality and completeness

3. **Data Storage**
   - Uploads cleaned data to cloud storage
   - Inserts processed data into database in batches
   - Maintains data lineage and audit trails

### Running the Pipeline

```bash
cd pipeline
python main.py
```

### Pipeline Configuration

Key constants in `main.py`:
- `RAW_PATH`: Input file location
- `CLEANED_PATH`: Output file location
- `BUCKET`: Storage bucket name
- `TABLE`: Database table name

### Error Handling

The pipeline includes comprehensive error handling:
- Download failures stop execution immediately
- Cleaning errors provide detailed diagnostic information
- Database errors include batch-specific context
- All errors are logged with timestamps and context

## Development

### Code Style

- **Python**: Follows PEP 8 with comprehensive docstrings
- **JavaScript/React**: Uses ESLint with React-specific rules
- **Comments**: Professional documentation throughout codebase

### Testing

```bash
# Frontend tests
cd student-dashboard/frontend
npm run lint

# Backend tests (when implemented)
cd ../backend
pytest
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Vercel Functions)

The backend is configured for serverless deployment via `vercel.json`:

```json
{
  "functions": {
    "backend/main.py": {
      "runtime": "python3.11"
    }
  }
}
```

### Production Environment Variables

Ensure all environment variables are set in your deployment platform:
- Supabase URL and API keys
- Frontend API URL
- Any other service-specific credentials

## Performance Considerations

- **Frontend**: Implements parallel data fetching and efficient state management
- **Backend**: Uses batch processing for database operations
- **Pipeline**: Configurable batch sizes for memory optimization
- **Caching**: Leverages Supabase's built-in caching mechanisms

## Security

- **API Keys**: Stored in environment variables, never exposed in client code
- **CORS**: Properly configured for production domains
- **Data Validation**: Input validation on all API endpoints
- **Error Handling**: Sensitive information not exposed in error messages

## Monitoring and Logging

- **Pipeline**: Comprehensive logging with stage-specific error messages
- **Backend**: FastAPI provides automatic request logging
- **Frontend**: Error boundaries and user-friendly error displays

## Troubleshooting

### Common Issues

**CORS Errors**
```bash
# Check your environment variables
echo $VITE_API_URL
# Ensure it matches your backend URL
```

**Database Connection**
```bash
# Verify Supabase credentials
python -c "from client import supabase; print('Connected!')"
```

**Pipeline Failures**
```bash
# Check raw data format
head -n 5 raw/StudentPerformanceFactors.csv
```

### Getting Help

- Check the [Issues](https://github.com/your-username/EduMetrics/issues) page
- Review the [Wiki](https://github.com/your-username/EduMetrics/wiki) for detailed guides
- Join our [Discord](https://discord.gg/your-invite) for community support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com) for the excellent backend-as-a-service platform
- [React](https://react.dev) team for the amazing UI framework
- [Chart.js](https://www.chartjs.org) for powerful data visualization
- [FastAPI](https://fastapi.tiangolo.com) for the modern Python web framework

---

**EduMetrics** - Empowering educational institutions with data-driven insights.
