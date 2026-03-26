import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ApplicationList from "./components/ApplicationList";
import AddApplicationForm from "./components/AddApplicationForm";

export default function App() {
  const [applications, setApplications] = useState([]);

  const addApplication = (app) => {
    setApplications([...applications, { id: Date.now(), ...app }]);
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Dashboard applications={applications} />
        <AddApplicationForm onAdd={addApplication} />
        <ApplicationList applications={applications} />
      </main>
    </div>
  );
}