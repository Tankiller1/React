import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // בדיקה בטעינת האתר האם יש משתמש שמור בזיכרון הדפדפן
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // פונקציית התחברות
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw { message: data.message, errors: data.errors };
      }

      // שמירת המשתמש ב-State וב-localStorage
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // פונקציית הרשמה
  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw { message: data.message, errors: data.errors };
      }

      // התחברות אוטומטית אחרי הרשמה מוצלחת
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // פונקציית התנתקות
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // כאן בעתיד תוסיף קריאה לשרת למחיקת הקוקי
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook מותאם לשימוש קל בקומפוננטות
export const useAuth = () => {
  return useContext(AuthContext);
};