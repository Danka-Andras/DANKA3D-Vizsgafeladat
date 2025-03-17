import React, { useState } from 'react';
import './LoginRegister.css';

// Icon-ok
import { LuLock } from "react-icons/lu";
// Icon-ok vége

const LoginRegister = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
    } else {
      setError('');
      console.log('Új jelszó beállítva');
    }
  };

  return (
    <div className='wrapper'>
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Új jelszó beállítása</h1>
          <div className="input-box">
            <input
              type="password"
              placeholder='Jelszó'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <LuLock className='icon'/>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder='Jelszó ismét'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <LuLock className='icon'/>
          </div>

          {error && <p className="error">{error}</p>}

          <button type='submit'>Új jelszó beállítása</button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
