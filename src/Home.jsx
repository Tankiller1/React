// src/Home.jsx
import { useAuth } from "./context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="card">
      <h1>Fitness App 💪</h1>
      {user ? (
        <div>
          <h2>Welcome back, {user.name}!</h2>
          <p>Ready for your workout?</p>
          {/* כאן בעתיד נציג את הגרפים והסטטיסטיקה */}
        </div>
      ) : (
        <div>
          <h2>Welcome Guest</h2>
          <p>Please login or register to track your workouts.</p>
        </div>
      )}
    </div>
  );
};

export default Home;