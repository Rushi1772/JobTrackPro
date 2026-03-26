export default function ApplicationList({ applications }) {
  const getBadgeClass = (status) => {
    const value = status.toLowerCase();
    if (value === "interview") return "badge badge-interview";
    if (value === "rejected") return "badge badge-rejected";
    return "badge badge-applied";
  };

  return (
    <section className="card">
      <h2 className="section-title">Applications</h2>

      {applications.length === 0 ? (
        <p className="empty-state">No applications added yet.</p>
      ) : (
        <ul className="list">
          {applications.map((app) => (
            <li key={app.id} className="list-item">
              <div className="company-role">
                <span className="company-name">{app.company}</span>
                <span className="role-name">{app.role}</span>
              </div>
              <span className={getBadgeClass(app.status || "Applied")}>
                {app.status || "Applied"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}