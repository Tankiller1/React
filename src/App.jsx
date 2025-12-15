// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./Login.jsx";
import Register from "./Register";
import Home from "./Home";
import TrainersPage from "./TrainersPage";

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      {/* --- Navbar --- */}
      <nav
        style={{
          padding: "1rem",
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="logo">
          <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            FitTrack
          </Link>
        </div>

        <div className="menu">
          <Link to="/" style={{ marginRight: "15px" }}>
            Home
          </Link>

          <Link to="/trainers" style={{ marginRight: "15px" }}>
            Trainers
          </Link>

          {user ? (
            // אם המשתמש מחובר - הצג את שמו וכפתור יציאה
            <>
              <span style={{ marginRight: "15px" }}>Hello, {user.name}</span>
              <button onClick={logout} style={{ padding: "5px 10px" }}>
                Logout
              </button>
            </>
          ) : (
            // אם המשתמש לא מחובר - הצג כפתורי כניסה והרשמה
            <>
              <Link to="/login" style={{ marginRight: "15px" }}>
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* --- Page Content --- */}
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trainers" element={<TrainersPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
