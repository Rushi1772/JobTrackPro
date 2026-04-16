export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>JobTrackPro</h1>
      </div>
      {user && (
        <div className="nav-user">
          <span>Welcome, {user.name}</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}