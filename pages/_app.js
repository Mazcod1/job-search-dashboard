import "../styles.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        backgroundColor: "#1E293B",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2>Job Hub</h2>
        <a href="/" style={linkStyle}>Dashboard</a>
        <a href="/manage-urls" style={linkStyle}>Manage URLs</a>
        <a href="/upload-cv" style={linkStyle}>Upload CV</a>
        <a href="/alerts" style={linkStyle}>Alerts & Settings</a>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: "#f8fafc", padding: "20px" }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  backgroundColor: "#334155",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "5px"
};
