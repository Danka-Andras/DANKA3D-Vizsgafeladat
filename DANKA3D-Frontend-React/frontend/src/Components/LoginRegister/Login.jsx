import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

// Icon-ok
import { LuMail, LuLock, LuSquareCheck, LuSquare } from "react-icons/lu";

// Backend API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5277/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate(); // Navigáció sikeres bejelentkezés után

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/User/login`, 
        { email, password },  // 🔹 Jelszót simán küldjük
        { withCredentials: true }
      );

      console.log("Sikeres bejelentkezés:", response.data);

      if (response.data && response.data.message === "Login successful!") {
        navigate("/"); // Sikeres bejelentkezés után átirányít
      } else {
        setError("Ismeretlen hiba történt a bejelentkezés során.");
      }

    } catch (err) {
      setError("Hibás e-mail vagy jelszó!");
      console.error("Bejelentkezési hiba:", err.response?.data || err.message);
    }
  };

  return (
    <div className='wrapper'>
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Bejelentkezés</h1>
          <div className="input-box">
            <input 
              type="email" 
              placeholder='E-Mail cím' 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <LuMail className='icon' />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder='Jelszó' 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <LuLock className='icon' />
          </div>

          <div className="remember-forgot">
            <label onClick={() => setIsChecked(!isChecked)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} >
              {isChecked ? <LuSquareCheck size={20} /> : <LuSquare size={20} />}
              <span style={{ marginLeft: '5px' }}>Adatok megjegyzése.</span>
            </label>
          </div>

          <button type='submit'>Bejelentkezés</button>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <a href="/forgotpassword">Elfelejtett jelszó?</a>
          </div>

          <div className="register-link">
            <p>Nincs még fiókod? <a href="/register">Regisztrálj!</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
