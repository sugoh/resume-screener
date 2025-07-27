import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["Screen a resume", "Bulk upload"];

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid #ddd",
        marginBottom: 24,
        userSelect: "none",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: isActive ? "700" : "500",
              cursor: "pointer",
              color: "#222",
              borderBottom: isActive
                ? "3px solid #0070f3"
                : "3px solid transparent",
              transition: "border-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                e.currentTarget.style.borderBottom = "3px solid #aaa";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                e.currentTarget.style.borderBottom = "3px solid transparent";
            }}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
}
