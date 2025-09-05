import React from "react";

export default function Home() {
  // Dummy job data (we’ll replace with scraping later)
  const jobs = [
    { id: 1, title: "Data Analyst", company: "UNDP", location: "Kampala, Uganda" },
    { id: 2, title: "Software Engineer", company: "Andela", location: "Remote" },
    { id: 3, title: "Field Officer", company: "World Vision", location: "Gulu, Uganda" },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🚀 Job Search Dashboard</h1>
      </header>

      {/* Search bar */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Search jobs..."
          style={styles.searchInput}
        />
        <button style={styles.searchButton}>Search</button>
      </div>

      {/* Job Listings */}
      <div style={styles.jobList}>
        {jobs.map((job) => (
          <div key={job.id} style={styles.card}>
            <h2 style={styles.jobTitle}>{job.title}</h2>
            <p style={styles.jobMeta}>
              <strong>Company:</strong> {job.company}
            </p>
            <p style={styles.jobMeta}>
              <strong>Location:</strong> {job.location}
            </p>
            <div style={styles.actions}>
              <button style={styles.saveButton}>💾 Save</button>
              <button style={styles.applyButton}>📩 Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline CSS
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    color: "#333",
  },
  searchSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "10px",
    width: "70%",
    border: "1px solid #ccc",
    borderRadius: "8px 0 0 8px",
    outline: "none",
  },
  searchButton: {
    padding: "10px 20px",
    border: "none",
    background: "#0070f3",
    color: "white",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
  },
  jobList: {
    display: "grid",
    gap: "15px",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    background: "#fafafa",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  jobTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    color: "#0070f3",
  },
  jobMeta: {
    margin: "5px 0",
    color: "#555",
  },
  actions: {
    marginTop: "10px",
  },
  saveButton: {
    padding: "8px 12px",
    marginRight: "10px",
    border: "1px solid #0070f3",
    background: "white",
    color: "#0070f3",
    borderRadius: "5px",
    cursor: "pointer",
  },
  applyButton: {
    padding: "8px 12px",
    border: "none",
    background: "#0070f3",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
