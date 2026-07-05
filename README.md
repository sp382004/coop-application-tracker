# Co-op Application Tracker

A full-stack web application for tracking internship and co-op applications. Users can add new applications through a React frontend, view saved applications, and store application data in a PostgreSQL database.

## Overview

This project was built to practice full-stack development, REST API design, database integration, and Git/GitHub workflow.

The application uses a React frontend, a Python FastAPI backend, and a Supabase-hosted PostgreSQL database. The frontend communicates with the backend through HTTP requests, and the backend performs SQL operations on the database.

## Features

- Add new internship or co-op applications from the frontend
- View saved applications from the database
- Track company, role, status, location, date applied, application link, and notes
- REST API built with FastAPI
- PostgreSQL database integration using Supabase
- API documentation and testing through FastAPI Swagger UI
- Git and GitHub version control

## Tech Stack

### Frontend
- React
- JavaScript
- Vite
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- psycopg2
- python-dotenv

### Database
- PostgreSQL
- Supabase

### Tools
- Git
- GitHub
- VS Code
- FastAPI Swagger Docs

## Architecture

```text
React Frontend
      |
      | fetch()
      v
FastAPI Backend
      |
      | SQL queries
      v
Supabase PostgreSQL Database
```

## API Endpoints

### Health Check

```http
GET /api/health
```

Checks if the FastAPI backend server is running.

### Get All Applications

```http
GET /api/applications
```

Retrieves all saved application records from the PostgreSQL database.

### Get One Application

```http
GET /api/applications/{application_id}
```

Retrieves a single application record by its ID.

### Create Application

```http
POST /api/applications
```

Creates a new internship or co-op application record.

### Update Application

```http
PUT /api/applications/{application_id}
```

Updates an existing application record.

### Delete Application

```http
DELETE /api/applications/{application_id}
```

Deletes an application record from the database.

## Database Schema

```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    date_applied DATE,
    application_link TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```text
coop-application-tracker/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── .gitignore
```