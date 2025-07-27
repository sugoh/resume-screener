import React from "react";

export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <p style={{ color: "#d93025", marginTop: 16, fontWeight: "600" }}>
      {error}
    </p>
  );
}
