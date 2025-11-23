import { useEffect, useState } from "react";




export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState<any[]>([]);

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  };

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return alert("Please enter a URL");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code }),
    });

    if (res.ok) {
      setUrl("");
      setCode("");
      fetchLinks();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create link");
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>TinyLink Dashboard</h1>

      <form onSubmit={createLink} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Enter long URL (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "300px", padding: "8px", marginRight: "8px" }}
        />
        <input
          type="text"
          placeholder="Custom code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "200px", padding: "8px", marginRight: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Create
        </button>
      </form>

      <h2>Your Links</h2>
      {links.length === 0 ? (
        <p>No links yet. Add one using the form above.</p>
      ) : (
        <ul>
          {links.map((link) => (
  <li key={link.code} style={{ marginBottom: "8px" }}>
    <strong>{link.code}</strong> →{" "}
    <a href={link.url} target="_blank" rel="noopener noreferrer">
      {link.url}
    </a>
    <button
      onClick={async () => {
        const res = await fetch("/api/links", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: link.code }),
        });
        if (res.ok) {
          fetchLinks(); // refresh list
        } else {
          alert("Failed to delete link");
        }
      }}
      style={{
        marginLeft: "10px",
        backgroundColor: "red",
        color: "white",
        padding: "4px 8px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  </li>
))}

        </ul>
      )}
    </main>
  );
}
