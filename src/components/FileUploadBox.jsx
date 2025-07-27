import React from "react";
import { FaFilePdf } from "react-icons/fa";

export default function FileUploadBox({
  isHover,
  onDrop,
  onDragOver,
  onDragLeave,
  handleFileInputChange,
  multiple = false,
  fileContents = [], // new prop to hold selected files info
}) {
  return (
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
        backgroundColor: isHover ? "#d3d3d3" : "#fafafa", // changed color on hover
        color: "#555",
        cursor: "pointer",
        marginBottom: 24,
        transition: "background-color 0.3s ease",
        userSelect: "none",
        fontSize: 16,
        fontWeight: "500",
      }}
    >
      {Array.isArray(fileContents) && fileContents.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {fileContents.map(({ name }, i) => (
            <div
                key={i}
                style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
                fontSize: 14,
                color: "#222",
                }}
            >
                <FaFilePdf color="#E53E3E" size={20} />
                <span>{name}</span>
            </div>
            ))}
            <small style={{ color: "#666", marginTop: 8 }}>
            Drag & drop more files or click to select
            </small>
        </div>
        ) : (
        <div style={{ textAlign: "center", fontSize: 14, color: "#666" }}>
            Drag & drop files or click to select
            <br />
            Accepted file types: pdf, doc, docx
        </div>
        )}
      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        multiple={multiple}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
    </label>
  );
}
