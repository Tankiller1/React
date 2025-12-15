// src/pages/TrainersPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

const MOCK_TRAINERS = [
  {
    id: "t1",
    name: "דני כושר",
    bio: "מאמן כושר אישי עם התמחות בירידה במשקל.",
    specialties: ["ירידה במשקל", "אימון פונקציונלי"],
    experienceYears: 5,
  },
  {
    id: "t2",
    name: "אורית HIIT",
    bio: "אימוני HIIT אינטנסיביים לשיפור הכושר.",
    specialties: ["HIIT", "סיבולת לב ריאה"],
    experienceYears: 3,
  },
  {
    id: "t3",
    name: "יואב כוח",
    bio: "התמקדות בבניית מסת שריר וחיזוק כללי.",
    specialties: ["אימון כוח", "מסת שריר"],
    experienceYears: 7,
  },
];

function TrainersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
    experienceYears: "",
  });

  // כרגע עובדים עם דאטה זמני; בעתיד זה יהיה fetch לשרת
  useEffect(() => {
    setTrainers(MOCK_TRAINERS);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTrainer = (e) => {
    e.preventDefault();

    const newTrainer = {
      id: Date.now().toString(),
      name: formData.name,
      bio: formData.bio,
      specialties: formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experienceYears: Number(formData.experienceYears) || 0,
    };

    setTrainers((prev) => [...prev, newTrainer]);

    // ניקוי הטופס וסגירתו
    setFormData({
      name: "",
      bio: "",
      specialties: "",
      experienceYears: "",
    });
    setShowForm(false);
  };

  if (loading) {
    return <div className="page trainers-page">טוען מאמנים...</div>;
  }

  if (trainers.length === 0) {
    return <div className="page trainers-page">לא נמצאו מאמנים.</div>;
  }

  return (
    <div className="page trainers-page">
      <h1 className="page-title">מאמנים</h1>
      <p className="page-subtitle">
        בחר מאמן כדי לראות את האימונים שהוא מעביר ולהירשם אליהם.
      </p>

      {/* רק למנהל תוצג האפשרות להוסיף מאמן */}
      {isAdmin && (
        <div className="add-trainer-box">
          <button
            className="primary-button"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "סגור טופס הוספת מאמן" : "הוסף מאמן חדש"}
          </button>

          {showForm && (
            <form className="add-trainer-form" onSubmit={handleAddTrainer}>
              <div className="form-group">
                <label>שם המאמן:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>תיאור / ביוגרפיה:</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>תחומי התמחות (מופרדים בפסיק):</label>
                <input
                  type="text"
                  name="specialties"
                  placeholder="כוח, HIIT, ירידה במשקל..."
                  value={formData.specialties}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>שנות ניסיון:</label>
                <input
                  type="number"
                  name="experienceYears"
                  min="0"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="primary-button">
                שמור מאמן
              </button>
            </form>
          )}
        </div>
      )}

      <div className="trainers-grid">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="trainer-card">
            <h2 className="trainer-name">{trainer.name}</h2>
            <p className="trainer-bio">{trainer.bio}</p>

            <p className="trainer-experience">
              ניסיון: {trainer.experienceYears} שנים
            </p>

            <div className="trainer-specialties">
              {trainer.specialties.map((spec) => (
                <span key={spec} className="badge">
                  {spec}
                </span>
              ))}
            </div>

            <button
              className="primary-button"
              onClick={() => {
                alert(`בעתיד: מעבר לאימונים של ${trainer.name}`);
              }}
            >
              צפה באימונים של המאמן
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainersPage;
