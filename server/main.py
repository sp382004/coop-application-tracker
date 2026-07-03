import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")


class Application(BaseModel):
    company: str
    role: str
    status: str
    location: str | None = None
    date_applied: str | None = None
    application_link: str | None = None
    notes: str | None = None


def get_connection():
    return psycopg2.connect(
        DATABASE_URL,
        cursor_factory=RealDictCursor,
        sslmode="require"
    )


@app.get("/api/health")
def health_check():
    return {"message": "FastAPI server is running"}


@app.get("/api/applications")
def get_applications():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM applications ORDER BY created_at DESC")
        applications = cur.fetchall()

        cur.close()
        conn.close()

        return applications

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/api/applications/{application_id}")
def get_application(application_id: int):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT * FROM applications WHERE id = %s",
            (application_id,)
        )

        application = cur.fetchone()

        cur.close()
        conn.close()

        if application is None:
            raise HTTPException(status_code=404, detail="Application not found")

        return application

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.post("/api/applications")
def create_application(application: Application):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO applications
            (company, role, status, location, date_applied, application_link, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (
                application.company,
                application.role,
                application.status,
                application.location,
                application.date_applied,
                application.application_link,
                application.notes,
            ),
        )

        new_application = cur.fetchone()
        conn.commit()

        cur.close()
        conn.close()

        return new_application

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.put("/api/applications/{application_id}")
def update_application(application_id: int, application: Application):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            UPDATE applications
            SET company = %s,
                role = %s,
                status = %s,
                location = %s,
                date_applied = %s,
                application_link = %s,
                notes = %s
            WHERE id = %s
            RETURNING *
            """,
            (
                application.company,
                application.role,
                application.status,
                application.location,
                application.date_applied,
                application.application_link,
                application.notes,
                application_id,
            ),
        )

        updated_application = cur.fetchone()
        conn.commit()

        cur.close()
        conn.close()

        if updated_application is None:
            raise HTTPException(status_code=404, detail="Application not found")

        return updated_application

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.delete("/api/applications/{application_id}")
def delete_application(application_id: int):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "DELETE FROM applications WHERE id = %s RETURNING *",
            (application_id,)
        )

        deleted_application = cur.fetchone()
        conn.commit()

        cur.close()
        conn.close()

        if deleted_application is None:
            raise HTTPException(status_code=404, detail="Application not found")

        return {"message": "Application deleted successfully"}

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))