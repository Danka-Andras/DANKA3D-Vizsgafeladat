import React, { useState } from 'react';
import './LoginRegister.css';
import { useNavigate, Link } from "react-router-dom";

// Icon-ok
import { LuMail, LuLock, LuSquareCheck, LuSquare } from "react-icons/lu";
// Icon-ok vége
import axios from 'axios';

const LoginRegister = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isChecked) {
      alert('El kell fogadnod a feltételeket és adatvédelmi szabályzatot.');
      return;
    }

    try {
      const response = await axios.post("http://localhost:5277/api/User/register", { email, password });
      console.log(response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || 'Hiba történt a regisztráció során');
      console.error('Regisztrációs hiba:', err);
    }
  };

  return (
    <div className='wrapper'>
      <div className="form-box">
        <form onSubmit={handleRegister}>
          <h1>Regisztráció</h1>
          {error && <div className="error">{error}</div>}
          <div className="input-box">
            <input 
              type="text" 
              placeholder='E-Mail cím' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <LuMail className='icon' />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder='Jelszó' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <LuLock className='icon' />
          </div>
          <div className="remember-forgot" style={{ display: 'flex', alignItems: 'center' }}>
            <label onClick={() => setIsChecked(!isChecked)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center'}}>
                {isChecked ? <LuSquareCheck size={20} /> : <LuSquare size={20} />}
            </label>
            <p>
                {/* Elfogadom a <strong><a href="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>Feltételeket</a></strong> és az 
                <strong><a href="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}> Adatvédelmet</a></strong>. */}
                Elfogadom a feltételeket és az adatvédelmet.
            </p>
          </div>
          <button type='submit'>Regisztráció</button>
          <div className="register-link">
            <p>Van már fiókod? <Link to="/login">Jelentkezz be!</Link></p>
          </div>
          <div className="home-link">
            <p><Link to="/">⬅ Vissza a főoldalra</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
