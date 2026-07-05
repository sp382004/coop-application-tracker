import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

const [formData, setFormData] = useState({
  company: "",
  role: "",
  status: "Applied",
  location: "",
  date_applied: "",
  application_link: "",
  notes: "",
});

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const response = await fetch("http://localhost:8000/api/applications");
      const data = await response.json();

      setApplications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  }

function handleChange(event) {
  setFormData({
    ...formData,
    [event.target.name]: event.target.value,
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:8000/api/applications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create application");
    }

    await fetchApplications();

    setFormData({
      company: "",
      role: "",
      status: "Applied",
      location: "",
      date_applied: "",
      application_link: "",
      notes: "",
    });

  } catch (error) {
    console.error(error);
  }
}

  if (loading) {
    return <p className="loading">Loading applications...</p>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Co-op Application Tracker</h1>
        <p>Track internship and co-op applications in one place.</p>
      </header>

      <section className="summary">
        <div className="summary-card">
          <h2>{applications.length}</h2>
          <p>Total Applications</p>
        </div>
      </section>

      <section className="form-section">
        <h2>Add New Application</h2>

        <form onSubmit={handleSubmit} className="application-form">

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date_applied"
            value={formData.date_applied}
            onChange={handleChange}
          />

          <input
            type="url"
            name="application_link"
            placeholder="Application Link"
            value={formData.application_link}
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <button type="submit">
            Add Application
          </button>

        </form>
      </section>
      
      <section className="application-list">
        {applications.map((application) => (
          <div className="application-card" key={application.id}>
            <div className="card-header">
              <h2>{application.company}</h2>
              <span>{application.status}</span>
            </div>

            <p>
              <strong>Role:</strong> {application.role}
            </p>

            <p>
              <strong>Location:</strong> {application.location}
            </p>

            <p>
              <strong>Date Applied:</strong>{" "}
              {application.date_applied
                ? application.date_applied
                : "N/A"}
            </p>

            <p>
              <strong>Notes:</strong> {application.notes}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
