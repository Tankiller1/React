import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  // ניהול שגיאות ספציפיות לכל שדה (מה-Zod בשרת)
  const [fieldErrors, setFieldErrors] = useState({}); 
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/"); // מעבר לדף הבית
    } catch (err) {
      // אם יש שגיאות ולידציה מפורטות (Zod)
      if (err.errors && Array.isArray(err.errors)) {
        const errorsObj = {};
        err.errors.forEach(zodError => {
          // מיפוי השגיאה לשדה המתאים (path[0] הוא שם השדה)
          errorsObj[zodError.path[0]] = zodError.message;
        });
        setFieldErrors(errorsObj);
      } else {
        // שגיאה כללית (כמו "אימייל קיים")
        setError(err.message || "Registration failed");
      }
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" }}>
        
        {/* Name Field */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: "8px", width: "100%", display: "block" }}
          />
          {fieldErrors.name && <span style={{ color: "red", fontSize: "0.8rem" }}>{fieldErrors.name}</span>}
        </div>

        {/* Email Field */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ padding: "8px", width: "100%", display: "block" }}
          />
          {fieldErrors.email && <span style={{ color: "red", fontSize: "0.8rem" }}>{fieldErrors.email}</span>}
        </div>

        {/* Password Field */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ padding: "8px", width: "100%", display: "block" }}
          />
          <small style={{color: "#888"}}>Must be 8+ chars, contain number & special char.</small>
          {fieldErrors.password && <div style={{ color: "red", fontSize: "0.8rem" }}>{fieldErrors.password}</div>}
        </div>

        <button type="submit" style={{marginTop: "10px"}}>Create Account</button>
      </form>
    </div>
  );
};

export default Register;