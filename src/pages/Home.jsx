import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';
import Navbar from '../components/Navbar/Navbar';
import logo from '../assets/logo.png';
import { FaUserAlt, FaSignInAlt } from 'react-icons/fa';

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
          <img src={logo} alt="Logo Dispora" className="logo" />
          <h1>Sistem Monitoring Kunjungan</h1>
          <h2>Dinas Pemuda dan Olahraga Provinsi Sumatera Selatan</h2>
          <p className="desc">
            Website ini digunakan untuk mencatat dan memantau kunjungan yang dilakukan secara digital.
          </p>
        </div>
      </header>

      <main className="home-content">
        <p className="instruction">Silakan pilih peran Anda:</p>
        <div className="role-cards">
          <div className="card" onClick={() => handleRoleSelect('guest')}>
            <h3><FaUserAlt style={{ marginRight: '8px' }} /> Guest</h3>
            <p>Isi form kunjungan ke Dispora</p>
          </div>
          <div className="card" onClick={() => handleRoleSelect('pegawai')}>
            <h3><FaSignInAlt style={{ marginRight: '8px' }} /> Pegawai</h3>
            <p>Login untuk mengelola dan validasi data kunjungan</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Dinas Pemuda dan Olahraga Provinsi Sumatera Selatan</p>
      </footer>
    </div>
  );
};

export default Home;
