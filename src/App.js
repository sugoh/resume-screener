// src/App.jsx
import React, { useState, useCallback } from "react";

export default function App() {
  const [fileContents, setFileContents] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    setIsHover(false);
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter((f) => f.type === "application/pdf");

    if (validFiles.length === 0) {
      setError("Please upload one or more PDF files");
      return;
    }

    const readers = validFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) =>
          resolve({ name: file.name, buffer: e.target.result });
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    });

    Promise.all(readers)
      .then((results) => setFileContents(results))
      .catch(() => setError("Failed to read one or more files"));
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsHover(true);
  };
  const onDragLeave = () => setIsHover(false);

  const handleSubmit = async () => {
    if (fileContents.length === 0) {
      setError("No file content to submit");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formData = new FormData();
      fileContents.forEach(({ buffer, name }) => {
        const blob = new Blob([buffer], { type: "application/pdf" });
        formData.append("files", blob, name);
      });

      const res = await fetch(
        "https://api.internal.trychad.com/api/v1/resume-screener/screen",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      const data = await res.json();
      setResponse(data); // Expecting an array of results
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
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(
              (f) => f.type === "application/pdf"
            );

            if (validFiles.length === 0) {
              setError("Please upload valid PDF files");
              return;
            }

            const readers = validFiles.map((file) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) =>
                  resolve({ name: file.name, buffer: e.target.result });
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
              });
            });

            Promise.all(readers)
              .then((results) => setFileContents(results))
              .catch(() => setError("Failed to read one or more files"));
          }}
        />
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading || !fileContents}
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: 18,
          fontWeight: "600",
          backgroundColor: loading || !fileContents ? "#ccc" : "#0070f3",
          border: "none",
          borderRadius: 6,
          color: loading || !fileContents ? "#666" : "white",
          cursor: loading || !fileContents ? "not-allowed" : "pointer",
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
        <div
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 6,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#222",
          }}
        >
          <h2
            style={{
              color: response.is_worth_interviewing ? "green" : "red",
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            {response.is_worth_interviewing
              ? "Recommended for Interview"
              : "Not Recommended for Interview"}
          </h2>

          {response.green_flags && response.green_flags.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h3 style={{ color: "green", marginBottom: 8 }}>Green Flags</h3>
              <ul style={{ paddingLeft: 20 }}>
                {response.green_flags.map((flag, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <strong>{flag.reason}</strong>
                    <ul style={{ paddingLeft: 16, marginTop: 6 }}>
                      {flag.supporting_points.map((point, idx) => (
                        <li key={idx} style={{ fontSize: 14, lineHeight: 1.4 }}>
                          {point}
                        </li>
                      ))}
                    </ul>
                    {flag.confidence_score !== undefined && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#666",
                          marginTop: 4,
                          fontStyle: "italic",
                        }}
                      >
                        Confidence: {(flag.confidence_score * 100).toFixed(0)}%
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {response.red_flags && response.red_flags.length > 0 && (
            <section>
              <h3 style={{ color: "#d93025", marginBottom: 8 }}>Red Flags</h3>
              <ul style={{ paddingLeft: 20 }}>
                {response.red_flags.map((flag, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <strong>{flag.reason}</strong>
                    <ul style={{ paddingLeft: 16, marginTop: 6 }}>
                      {flag.supporting_points.map((point, idx) => (
                        <li key={idx} style={{ fontSize: 14, lineHeight: 1.4 }}>
                          {point}
                        </li>
                      ))}
                    </ul>
                    {flag.confidence_score !== undefined && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#666",
                          marginTop: 4,
                          fontStyle: "italic",
                        }}
                      >
                        Confidence: {(flag.confidence_score * 100).toFixed(0)}%
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
