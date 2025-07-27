export default function WorkExperience({ experience }) {
  const getTierInfo = (tier) => {
    switch (tier) {
      case 1:
        return { color: "#2ecc71", label: "Top-tier" };
      case 2:
        return { color: "#27ae60", label: "Strong" };
      case 3:
      default:
        return { color: "#f1c40f", label: "Decent" };
      case 4:
        return { color: "#e67e22", label: "Not great" };
      case 5:
        return { color: "#e74c3c", label: "Bad" };
    }
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 8 }}>Work Experience</h3>
      <ul style={{ paddingLeft: 20 }}>
        {experience.map((item, idx) => {
          const { color, label } = getTierInfo(item.company_tier);
          return (
            <li key={idx} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 15 }}>
                  <strong>{item.role}</strong> at {item.company} ({item.year_started})
                </div>
                <span
                  style={{
                    backgroundColor: color,
                    color: "white",
                    borderRadius: 12,
                    padding: "2px 10px",
                    fontSize: 12,
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
