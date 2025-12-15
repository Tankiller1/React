// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. ייבוא הראוטר
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // 2. ייבוא ספק ההקשר

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);