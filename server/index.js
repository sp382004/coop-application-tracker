const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/applications", async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = "SELECT * FROM applications";
    const values = [];
    const conditions = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(
        `(company ILIKE $${values.length} OR role ILIKE $${values.length})`
      );
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

app.get("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM applications WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      location,
      date_applied,
      application_link,
      notes,
    } = req.body;

    if (!company || !role || !status) {
      return res.status(400).json({
        error: "Company, role, and status are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO applications
       (company, role, status, location, date_applied, application_link, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        company,
        role,
        status,
        location || null,
        date_applied || null,
        application_link || null,
        notes || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
});

app.put("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      role,
      status,
      location,
      date_applied,
      application_link,
      notes,
    } = req.body;

    if (!company || !role || !status) {
      return res.status(400).json({
        error: "Company, role, and status are required",
      });
    }

    const result = await pool.query(
      `UPDATE applications
       SET company = $1,
           role = $2,
           status = $3,
           location = $4,
           date_applied = $5,
           application_link = $6,
           notes = $7
       WHERE id = $8
       RETURNING *`,
      [
        company,
        role,
        status,
        location || null,
        date_applied || null,
        application_link || null,
        notes || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
});

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM applications WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});