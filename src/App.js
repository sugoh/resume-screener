import React, { useState, useCallback, useEffect } from "react";
import Tabs from "./components/Tabs";
import FileUploadBox from "./components/FileUploadBox";
import SubmitButton from "./components/SubmitButton";
import ErrorMessage from "./components/ErrorMessage";
import ResultsDisplay from "./components/ResultsDisplay";

export default function App() {
  const [activeTab, setActiveTab] = useState("Screen a resume");
  const [fileContents, setFileContents] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFileContents(null);
    setResponse(null);
    setError(null);
  }, [activeTab]);

  const validateFiles = useCallback(
    (files) => {
      if (activeTab === "Screen a resume" && files.length > 1) {
        setError("Only one PDF file is allowed for 'Screen a resume'");
        return false;
      }
      const invalidFiles = files.filter((f) => f.type !== "application/pdf");
      if (invalidFiles.length > 0) {
        setError("Please upload only PDF files");
        return false;
      }
      return true;
    },
    [activeTab]
  );

  const processFiles = useCallback((files) => {
    return Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) =>
            resolve({ name: file.name, buffer: e.target.result });
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      })
    );
  }, []);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (!validateFiles(files)) {
      setFileContents(null);
      return;
    }
    processFiles(files)
      .then((results) => {
        setFileContents(results);
        setError(null);
      })
      .catch(() => setError("Failed to read one or more files"));
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsHover(false);

      const files = Array.from(event.dataTransfer.files);
      if (!validateFiles(files)) {
        setFileContents(null);
        return;
      }

      processFiles(files)
        .then((results) => {
          setFileContents(results);
          setError(null);
        })
        .catch(() => setError("Failed to read one or more files"));
    },
    [validateFiles, processFiles, setIsHover, setFileContents, setError]
  );
  const onDragOver = (e) => {
    e.preventDefault();
    setIsHover(true);
  };
  const onDragLeave = () => setIsHover(false);

  const handleSubmit = async () => {
    if (!fileContents || fileContents.length === 0) {
      setError("No file content to submit");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formData = new FormData();

      if (activeTab === "Screen a resume") {
        // Single file upload: append first file as 'file'
        const { buffer, name } = fileContents[0];
        const blob = new Blob([buffer], { type: "application/pdf" });
        formData.append("file", blob, name);
      } else {
        // Bulk upload: append all files as 'files'
        fileContents.forEach(({ buffer, name }) => {
          const blob = new Blob([buffer], { type: "application/pdf" });
          formData.append("files", blob, name);
        });
      }

      const endpoint =
        activeTab === "Screen a resume"
          ? "https://api.internal.trychad.com/api/v1/resume-screener/screen"
          : "https://api.internal.trychad.com/api/v1/resume-screener/bulk-screen";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

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
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          fontWeight: "700",
        }}
      >
        Resume Screener
      </h1>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <FileUploadBox
        isHover={isHover}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        handleFileInputChange={handleFileInputChange}
        multiple={activeTab === "Bulk upload"}
        fileContents={fileContents} // ✅ ADD THIS LINE
      />
      <ErrorMessage error={error} />

      <SubmitButton
        loading={loading}
        disabled={loading || !fileContents}
        onClick={handleSubmit}
      />

      <ResultsDisplay response={response} />
    </div>
  );
}
