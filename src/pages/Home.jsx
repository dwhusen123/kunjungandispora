import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';
import Navbar from '../components/Navbar/Navbar';
import logo from '../assets/logo.png';
import { FaUserAlt, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('no-scroll-home');
    return () => {
      document.body.classList.remove('no-scroll-home');
    };
  }, []);

  const handleRoleSelect = (role) => {
    if (role === 'guest') {
      navigate('/form-kunjungan');
    } else if (role === 'pegawai') {
      navigate('/login-pegawai');
    }
  };

  return (
    <div className="home-page">
      <Navbar />

      <header className="home-header">
        <div className="overlay">
          <motion.img
            src={logo}
            alt="Logo Dispora"
            className="logo"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Sistem Monitoring Kunjungan
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Dinas Pemuda dan Olahraga Provinsi Sumatera Selatan
          </motion.h2>
          <motion.p
            className="desc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Website ini digunakan untuk mencatat dan memantau kunjungan yang dilakukan secara digital.
          </motion.p>
        </div>
      </header>

      <main className="home-content">
        <motion.p
          className="instruction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Silakan pilih peran Anda:
        </motion.p>

        <motion.div
          className="role-cards"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="card"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleRoleSelect('guest')}
          >
            <h3><FaUserAlt style={{ marginRight: '8px' }} /> Guest</h3>
            <p>Isi form kunjungan ke Dispora</p>
          </motion.div>
          <motion.div
            className="card"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleRoleSelect('pegawai')}
          >
            <h3><FaSignInAlt style={{ marginRight: '8px' }} /> Pegawai</h3>
            <p>Login untuk mengelola dan validasi data kunjungan</p>
          </motion.div>
        </motion.div>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Dinas Pemuda dan Olahraga Provinsi Sumatera Selatan</p>
      </footer>
    </div>
  );
};

export default Home;
