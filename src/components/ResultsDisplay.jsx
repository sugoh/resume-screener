import React, { useState } from "react";
import WorkExperience from "./WorkExperience";
import RecommendedLevel from "./RecommendedLevel";

function FlagList({ flags, color }) {
  return (
    <ul style={{ paddingLeft: 20 }}>
      {flags.map((flag, i) => (
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
  );
}

function SingleResult({ response, isExpanded, toggleExpand, canToggle }) {
  const getBadgeColor = () => {
    switch (response.is_worth_interviewing) {
      case 2:
        return "#27ae60";
      case 1:
        return "#f39c12";
      default:
        return "#e74c3c";
    }
  };

  const getBadgeText = () => {
    switch (response.is_worth_interviewing) {
      case 2:
        return "✅ Priority candidate";
      case 1:
        return "🤔 Borderline (interview if you have time)";
      default:
        return "❌ Not recommended for interview";
    }
  };

  return (
    <div
      style={{
        marginTop: 24,
        padding: 16,
        borderRadius: 6,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
        cursor: canToggle ? "pointer" : "default",
        userSelect: canToggle ? "none" : "auto",
      }}
      onClick={canToggle ? toggleExpand : undefined}
    >
      {/* Header - Candidate Info + Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: isExpanded ? 24 : 0,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 20 }}>{response.candidate.name}</h3>
          {response.candidate.email && (
            <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
              {response.candidate.email}
            </p>
          )}
        </div>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            backgroundColor: getBadgeColor(),
            color: "white",
            fontWeight: "600",
            fontSize: 14,
            userSelect: "none",
          }}
        >
          {getBadgeText()}
        </div>
      </div>
      {response.recommended_seniority_levels?.length > 0 && (
            <RecommendedLevel levels={response.recommended_seniority_levels} />
          )}

      {/* Accordion Content */}
      {isExpanded && (
        <>
        {/* Work Experience */}
        <div>
        {response.candidate.work_experience && response.candidate.work_experience.length > 0 && (
            <WorkExperience experience={response.candidate.work_experience} />
        )}
        </div>
          {/* Green Flags */}
          {response.green_flags && response.green_flags.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h3 style={{ color: "green", marginBottom: 8 }}>✅ Green Flags</h3>
              <FlagList flags={response.green_flags} color="green" />
            </section>
          )}

          {/* Red Flags */}
          {response.red_flags && response.red_flags.length > 0 && (
            <section>
              <h3 style={{ color: "#d93025", marginBottom: 8 }}>🚩 Red Flags</h3>
              <FlagList flags={response.red_flags} color="#d93025" />
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default function ResultsDisplay({ response }) {
  // Always call hooks first, no matter what
  const [expandedIndexes, setExpandedIndexes] = useState(() => []);

  // Early return for null response
  if (!response) return null;

  // If response is NOT array, just render SingleResult expanded & no toggle
  if (!Array.isArray(response)) {
    return <SingleResult response={response} isExpanded={true} canToggle={false} />;
  }

  // If array with only one item, expanded & no toggle
  if (response.length === 1) {
    return <SingleResult response={response[0]} isExpanded={true} canToggle={false} />;
  }

  // Multiple results: allow toggling multiple expanded items
  const toggleExpand = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div>
      {response.map((res, idx) => (
        <SingleResult
          key={idx}
          response={res}
          isExpanded={expandedIndexes.includes(idx)}
          toggleExpand={() => toggleExpand(idx)}
          canToggle={true}
        />
      ))}
    </div>
  );
}