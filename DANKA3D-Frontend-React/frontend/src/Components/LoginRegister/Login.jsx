import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginRegister.css";

// Icons
import { LuMail, LuLock, LuSquareCheck, LuSquare } from "react-icons/lu";

// Environment variable for API base URL
const API_BASE_URL = "http://localhost:5277/api";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading state

    if (!formData.email || !formData.password) {
      setError("Az e-mail és a jelszó kitöltése kötelező.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/User/login`,
        { email: formData.email, password: formData.password },
        { withCredentials: true } // Include cookies in request
      );

      console.log("Login successful:", response.data);

      if (response.data.message === "Login successful!") {
        navigate("/"); // Redirect to homepage
      } else {
        setError("Ismeretlen hiba történt a bejelentkezés során.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setError("Hibás e-mail vagy jelszó.");
      } else {
        setError("Hálózati hiba történt. Kérlek, próbáld újra később.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Bejelentkezés</h1>
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="E-Mail cím"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <LuMail className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Jelszó"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <LuLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label
              onClick={() => setIsChecked(!isChecked)}
              style={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {isChecked ? <LuSquareCheck size={20} /> : <LuSquare size={20} />}
              <span style={{ marginLeft: "5px" }}>Adatok megjegyzése</span>
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Bejelentkezés..." : "Bejelentkezés"}
          </button>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <a href="/forgotpassword">Elfelejtett jelszó?</a>
          </div>

          <div className="register-link">
            <p>
              Nincs még fiókod? <a href="/register">Regisztrálj!</a>
            </p>
          </div>
          <div className="home-link">
            <p><Link to="/">⬅ Vissza a főoldalra</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
