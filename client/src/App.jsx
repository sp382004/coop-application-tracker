import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
