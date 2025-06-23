import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { motion } from 'framer-motion';
import '../Styles/Login.css';

const LoginPegawai = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/login/pegawai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        alert('Login Gagal');
        return;
      }

      const data = await response.json();
      alert(`Login Berhasil sebagai ${data.role}`);

      if (data.role === 'admin') navigate('/dashboard-admin');
      else if (data.role === 'sekretaris') navigate('/dashboard-sekretaris');
      else alert('Role tidak dikenal');
    } catch (error) {
      console.error('Login error:', error);
      alert('Terjadi kesalahan saat login.');
    }
  };

  const toggleRole = () => setFlipped(!flipped);

  return (
    <div className="login-page">
      <Navbar />

      {/* === Animated Form Container === */}
      <motion.div
        className={`form-flip-container ${flipped ? 'flipped' : ''}`}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="form-flip-inner">
          <div className="form-face form-front">
            <h2>Login Admin</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username / Email :</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password :</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login sebagai Admin</button>
            </form>
          </div>

          <div className="form-face form-back">
            <h2>Login Sekretaris</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username / Email :</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password :</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login sebagai Sekretaris</button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* === Animated Toggle === */}
      <motion.div
        className={`role-toggle-wrapper ${flipped ? 'sekretaris' : 'admin'}`}
        onClick={toggleRole}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
      >
        <div className="slider"></div>
        <div className="label">
          <span role="img" aria-label="admin">👨‍💼 Admin</span>
        </div>
        <div className="label">
          <span role="img" aria-label="sekretaris">🗂️ Sekretaris</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPegawai;
