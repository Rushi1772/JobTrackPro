import { useState } from "react";

export default function AddApplicationForm({ onAdd }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!company.trim() || !role.trim()) {
      alert("Please fill in all fields");
      return;
    }

    onAdd({ company, role, status });
    setCompany("");
    setRole("");
    setStatus("Applied");
  };

  return (
    <section className="card">
      <h2 className="section-title">Add Application</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="input-field"
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            className="input-field"
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="form-group">
          <select
            className="select-field"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button className="primary-button" type="submit">
          Add Application
        </button>
      </form>
    </section>
  );
}