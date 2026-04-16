import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ApplicationList from "./components/ApplicationList";
import AddApplicationForm from "./components/AddApplicationForm";
import LoginForm from "./components/LoginForm";
import api from "./api";

export default function App() {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const loadApplications = useCallback(async () => {
    try {
      const apps = await api.getApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      if (error.message.includes('Invalid or expired token')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [loadApplications]);

  const addApplication = async (app) => {
    try {
      await api.addApplication(app);
      await loadApplications(); // Reload to get updated list
    } catch (error) {
      alert('Failed to add application: ' + error.message);
    }
  };

  const deleteApplication = async (id) => {
    try {
      await api.deleteApplication(id);
      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      alert('Failed to delete application: ' + error.message);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await api.login(credentials);
      setUser(response.user);
      await loadApplications();
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await api.register(userData);
      setUser(response.user);
      await loadApplications();
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setApplications([]);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="auth-container">
        <LoginForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Dashboard applications={applications} />
        <AddApplicationForm onAdd={addApplication} />
        <ApplicationList applications={applications} onDelete={deleteApplication} />
      </main>
    </div>
  );
}