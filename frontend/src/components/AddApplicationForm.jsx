import { useState } from "react";

export default function AddApplicationForm({ onAdd }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("applied");
  const [appliedDate, setAppliedDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!company.trim() || !role.trim()) {
      alert("Please fill in all fields");
      return;
    }

    onAdd({
      company: company.trim(),
      role: role.trim(),
      status,
      applied_date: appliedDate || null
    });

    setCompany("");
    setRole("");
    setStatus("applied");
    setAppliedDate("");
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
            required
          />
        </div>

        <div className="form-group">
          <input
            className="input-field"
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <select
            className="select-field"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <input
            className="input-field"
            type="date"
            placeholder="Applied Date (optional)"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
          />
        </div>

        <button className="primary-button" type="submit">
          Add Application
        </button>
      </form>
    </section>
  );
}