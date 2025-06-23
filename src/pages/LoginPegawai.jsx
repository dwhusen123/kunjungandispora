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
    <>
      <Navbar />
      <div className="login-page">
        <motion.div
          className="login-motion-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* === Flip Form === */}
          <div className={`login-flip-container ${flipped ? 'flipped' : ''}`}>
            <div className="login-flip-inner">
              <div className="login-face login-front">
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

              <div className="login-face login-back">
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
          </div>

          {/* === Slider toggle berada di bawah === */}
          <motion.div
            className="login-toggle-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
           <div className={`login-toggle-switch ${flipped ? 'sekretaris' : 'admin'}`}
            onClick={toggleRole}>
          <div className="slider-bg"></div>
          <button type="button" className="admin-btn">
    <span role="img" aria-label="admin">👨‍💼</span> Admin
  </button>
  <button type="button" className="sekretaris-btn">
    <span role="img" aria-label="sekretaris">🗂️</span> Sekretaris
  </button>
</div>

          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPegawai;
