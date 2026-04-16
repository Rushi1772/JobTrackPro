export default function ApplicationList({ applications, onDelete }) {
  const getBadgeClass = (status) => {
    const value = status.toLowerCase();
    if (value === "interview") return "badge badge-interview";
    if (value === "rejected") return "badge badge-rejected";
    return "badge badge-applied";
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      onDelete(id);
    }
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
              <button
                onClick={() => handleDelete(app.id)}
                className="delete-button"
                title="Delete application"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}