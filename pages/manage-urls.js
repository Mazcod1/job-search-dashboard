import { useState } from "react";

export default function ManageUrls() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");

  const addUrl = () => {
    if (newUrl.trim() !== "") {
      setUrls([...urls, newUrl]);
      setNewUrl("");
    }
  };

  const removeUrl = (url) => {
    setUrls(urls.filter(u => u !== url));
  };

  return (
    <div>
      <h1>Manage Career Page URLs</h1>
      <input
        type="text"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        placeholder="Paste career site URL here"
        style={{ padding: "8px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={addUrl} style={btnStyle}>Add URL</button>

      <ul style={{ marginTop: "20px" }}>
        {urls.map((url, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            {url} 
            <button onClick={() => removeUrl(url)} style={removeBtn}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const btnStyle = {
  padding: "8px 12px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const removeBtn = {
  marginLeft: "10px",
  padding: "5px 10px",
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
