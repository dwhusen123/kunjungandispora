import React, { useEffect } from 'react'; // ← tambahkan useEffect di sini
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';
import Navbar from '../components/Navbar/Navbar';
import logo from '../assets/logo.png';
import batikImage from '../assets/batik.png';

const Home = () => {
  const navigate = useNavigate();

  // ← pindahkan useEffect ke sini, di dalam komponen
  useEffect(() => {
    document.body.classList.add('no-scroll-home');
    return () => {
      document.body.classList.remove('no-scroll-home');
    };
  }, []);

  const handleRoleSelect = (role) => {
    if (role === 'pengunjung') {
      navigate('/form-kunjungan');
    } else if (role === 'admin') {
      navigate('/login-admin');
    } else if (role === 'sekretaris') {
      navigate('/login-sekretaris');
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
        <img src={batikImage} alt="Batik kiri" className="batik-left" />
        <img src={batikImage} alt="Batik kanan" className="batik-right" />

        <p className="instruction">Silakan pilih peran Anda:</p>
        <div className="role-cards">
          <div className="card" onClick={() => handleRoleSelect('pengunjung')}>
            <h3>📝 Pengunjung</h3>
            <p>Isi form kunjungan ke Dispora</p>
          </div>
          <div className="card" onClick={() => handleRoleSelect('admin')}>
            <h3>🔐 Admin</h3>
            <p>Login untuk mengelola data kunjungan</p>
          </div>
          <div className="card" onClick={() => handleRoleSelect('sekretaris')}>
            <h3>📁 Sekretaris</h3>
            <p>Validasi dan pantau data kunjungan</p>
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
