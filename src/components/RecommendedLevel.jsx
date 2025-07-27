import React from "react";

// Order of seniority: higher first
const LEVEL_ORDER = {
  LEAD_ENGINEER: 3,
  SENIOR_ENGINEER: 2,
  JUNIOR_ENGINEER: 1,
};

const LEVEL_LABELS = {
  LEAD_ENGINEER: "👑 Lead Engineer",
  SENIOR_ENGINEER: "🧠 Senior Engineer",
  JUNIOR_ENGINEER: "👶 Junior Engineer",
};

const getVerdict = (score) => {
  if (score >= 2) return "Strong Yes";
  if (score === 1) return "Weak Yes";
  return "No Fit";
};

const RecommendedLevel = ({ levels }) => {
  if (!levels || levels.length === 0) return null;

  const sorted = [...levels].sort(
    (a, b) => (LEVEL_ORDER[b.seniority_level] ?? 0) - (LEVEL_ORDER[a.seniority_level] ?? 0)
  );

  return (
    <section style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 8 }}>Recommended Level</h3>
      <ul style={{ paddingLeft: 20, margin: 0 }}>
        {sorted.map(({ seniority_level, score }, idx) => (
          <li key={idx} style={{ marginBottom: 8, fontSize: 14 }}>
            <strong>{LEVEL_LABELS[seniority_level] || seniority_level}</strong>{" "}
            <span style={{ color: "#666", marginLeft: 6 }}>
              – {getVerdict(score)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecommendedLevel;
