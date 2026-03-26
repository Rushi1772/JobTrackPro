export default function Dashboard({ applications }) {
  return (
    <section className="card">
      <h2 className="section-title">Dashboard</h2>
      <p className="sub-text">Track your job applications in one place.</p>
      <div className="stats-number">{applications.length}</div>
      <p className="sub-text">Total Applications</p>
    </section>
  );
}