// src/App.jsx
import React, { useState, useCallback } from "react";

export default function App() {
  const [fileContent, setFileContent] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    setIsHover(false);
    const file = event.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setFileContent(e.target.result);
    reader.readAsArrayBuffer(file);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsHover(true);
  };
  const onDragLeave = () => setIsHover(false);

  const handleSubmit = async () => {
    if (!fileContent) {
      setError("No file content to submit");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const blob = new Blob([fileContent], { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", blob, "resume.pdf");

      const res = await fetch(
        "https://your-backend/api/v1/resume-screener/screen",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "3rem auto",
        padding: "1.5rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "2rem", fontWeight: "700" }}
      >
        Resume Screener
      </h1>

      <label
        htmlFor="fileInput"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 160,
          border: "2px dashed #bbb",
          borderRadius: 8,
          backgroundColor: isHover ? "#e6f0ff" : "#fafafa",
          color: "#555",
          cursor: "pointer",
          marginBottom: 24,
          transition: "background-color 0.3s ease",
          userSelect: "none",
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        Drag & Drop PDF here, or click to select
        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files.length > 0) {
              const file = e.target.files[0];
              if (file.type !== "application/pdf") {
                setError("Please upload a PDF file");
                return;
              }
              setError(null);
              const reader = new FileReader();
              reader.onload = (e) => setFileContent(e.target.result);
              reader.readAsArrayBuffer(file);
            }
          }}
        />
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading || !fileContent}
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: 18,
          fontWeight: "600",
          backgroundColor: loading || !fileContent ? "#ccc" : "#0070f3",
          border: "none",
          borderRadius: 6,
          color: loading || !fileContent ? "#666" : "white",
          cursor: loading || !fileContent ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        {loading ? "Processing..." : "Screen Resume"}
      </button>

      {error && (
        <p style={{ color: "#d93025", marginTop: 16, fontWeight: "600" }}>
          {error}
        </p>
      )}

      {response && (
        <pre
          style={{
            background: "#f7f7f7",
            borderRadius: 6,
            padding: 16,
            marginTop: 24,
            fontSize: 14,
            color: "#333",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
