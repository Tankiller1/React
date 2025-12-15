// src/pages/TrainersPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// אם השרת שלך בפורט אחר, שנה פה:
const API_BASE = "http://localhost:3000";

function TrainersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
    experienceYears: "",
  });

  const fetchTrainers = async () => {
    setLoading(true);
    setPageError("");

    try {
      const res = await fetch(`${API_BASE}/api/trainers`);
      const data = await res.json();

      // תומך גם במבנה {success:true, trainers:[...]} וגם במערך ישיר
      const list = Array.isArray(data) ? data : data.trainers;

      setTrainers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setPageError("שגיאה בטעינת מאמנים מהשרת");
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        specialties: formData.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experienceYears: Number(formData.experienceYears) || 0,
      };

      const res = await fetch(`${API_BASE}/api/trainers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // חשוב אם השרת משתמש ב-cookie JWT
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to create trainer");
        return;
      }

      // תומך גם ב {trainer: {...}} וגם במקרה שמחזיר את המאמן ישירות
      const created = data.trainer || data;

      // עדכון UI (וגם אפשר במקום זה לקרוא fetchTrainers())
      setTrainers((prev) => [...prev, created]);

      // ניקוי הטופס וסגירה
      setFormData({ name: "", bio: "", specialties: "", experienceYears: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page trainers-page">טוען מאמנים...</div>;
  }

  return (
    <div className="page trainers-page">
      <h1 className="page-title">מאמנים</h1>
      <p className="page-subtitle">
        בחר מאמן כדי לראות את האימונים שהוא מעביר ולהירשם אליהם.
      </p>

      {pageError && (
        <div style={{ padding: "10px", border: "1px solid #f99", marginBottom: "15px" }}>
          {pageError}
        </div>
      )}

      {/* רק למנהל תוצג האפשרות להוסיף מאמן */}
      {isAdmin && (
        <div className="add-trainer-box" style={{ marginBottom: "15px" }}>
          <button
            className="primary-button"
            onClick={() => setShowForm((prev) => !prev)}
            disabled={saving}
          >
            {showForm ? "סגור טופס הוספת מאמן" : "הוסף מאמן חדש"}
          </button>

          {showForm && (
            <form className="add-trainer-form" onSubmit={handleAddTrainer} style={{ marginTop: "10px" }}>
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

              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? "שומר..." : "שמור מאמן"}
              </button>
            </form>
          )}
        </div>
      )}

      {trainers.length === 0 ? (
        <div className="page trainers-page">לא נמצאו מאמנים.</div>
      ) : (
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <div key={trainer._id || trainer.id} className="trainer-card">
              <h2 className="trainer-name">{trainer.name}</h2>
              <p className="trainer-bio">{trainer.bio}</p>

              <p className="trainer-experience">
                ניסיון: {trainer.experienceYears ?? 0} שנים
              </p>

              <div className="trainer-specialties">
                {(trainer.specialties || []).map((spec) => (
                  <span key={spec} className="badge">
                    {spec}
                  </span>
                ))}
              </div>

              <button
                className="primary-button"
                onClick={() => alert(`בעתיד: מעבר לאימונים של ${trainer.name}`)}
              >
                צפה באימונים של המאמן
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainersPage;
