import React from "react";

export default function SubmitButton({ loading, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "0.75rem",
        fontSize: 18,
        fontWeight: "600",
        backgroundColor: disabled ? "#ccc" : "#0070f3",
        border: "none",
        borderRadius: 6,
        color: disabled ? "#666" : "white",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.3s ease",
      }}
    >
      {loading ? "Processing..." : "Screen Resume"}
    </button>
  );
}
