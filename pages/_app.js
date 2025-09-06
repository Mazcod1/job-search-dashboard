import "../styles.css";
import Link from 'next/link'; // Import Link component

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        backgroundColor: "#1E2938",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px", 
        overflowY: "auto"
      }}>
        <h2>Job Hub</h2>
        <Link href="/">
          <a className="link-style">Dashboard</a>
        </Link>
        <Link href="/manage-urls">
          <a className="link-style">Manage URLs</a>
        </Link>
        <Link href="/upload-cv">
          <a className="link-style">Upload CV</a>
        </Link>
        <Link href="/alerts">
          <a className="link-style">Alerts & Settings</a>
        </Link>
      </div>
      {/* The main content area where the different pages will be rendered */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
