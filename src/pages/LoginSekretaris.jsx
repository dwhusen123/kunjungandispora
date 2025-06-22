import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import '../Styles/Login.css';

const LoginSekretaris = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5001/api/login/sekretaris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      alert('Login Sekretaris Gagal');
      return;
    }
    const data = await response.json();
    alert('Login Sekretaris Berhasil!');
    navigate('/dashboard-sekretaris');
  } catch (error) {
    console.error('Login error:', error);
    alert('Terjadi kesalahan saat login sekretaris.');
  }
};

  const handleLupaPassword = () => {
    navigate('/lupa-password');
  };

  return (
    <div className="login-page">
      <Navbar />
      <h2>Login Sekretaris</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username / Email :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan Username / Email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <div className="login-links">
        <p>
          <button className="link-button" onClick={handleLupaPassword}>Lupa Password?</button>
        </p>
      </div>
    </div>
  );
};

export default LoginSekretaris;
