import React, { useState } from 'react';
import '../Styles/FormKunjungan.css';
import Navbar from '../components/Navbar/Navbar';
import { motion } from 'framer-motion';

const FormKunjungan = () => {
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [instansi, setInstansi] = useState('');
  const [ulasan, setUlasan] = useState('');
  const [rating, setRating] = useState(5);
  const [successMessage, setSuccessMessage] = useState('');
  const [flipped, setFlipped] = useState(false);

  const resetForm = () => {
    setNama('');
    setTanggal('');
    setKeperluan('');
    setInstansi('');
    setUlasan('');
    setRating(5);
  };

  const handleKunjunganSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        nama,
        tanggal_kunjungan: tanggal,
        keperluan,
        instansi,
        status: 'menunggu'
      };

      const res = await fetch('http://localhost:5001/api/kunjungan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Gagal kirim data');

      setSuccessMessage('✅ Terima kasih atas kunjungan Anda. Silakan kirim ulasan untuk membantu kami meningkatkan pelayanan.');
      resetForm();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('❌ Gagal kirim kunjungan:', err);
      alert('❌ Gagal mengirim data');
    }
  };

  const handleUlasanSubmit = (e) => {
    e.preventDefault();

    const newUlasan = {
      id: Date.now(),
      nama,
      ulasan,
      rating,
      tanggal: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('ulasanList')) || [];
    localStorage.setItem('ulasanList', JSON.stringify([...existing, newUlasan]));

    resetForm();
    setSuccessMessage('✅ Ulasan Anda telah dikirim. Terima kasih atas partisipasi Anda dalam meningkatkan kualitas layanan kami.');
    setTimeout(() => setSuccessMessage(''), 5000);
    setFlipped(false);
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="form-wrapper"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {successMessage && (
          <motion.p
            className="success-message"
            style={{ marginTop: '70px' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {successMessage}
          </motion.p>
        )}

        <div className={`form-flip-container ${flipped ? 'flipped' : ''}`}>
          <div className="form-flip-inner">

{/* FRONT: Form Kunjungan */}
<div className="form-face form-front">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2>Form Input Kunjungan</h2>
    <form onSubmit={handleKunjunganSubmit}>
      <div>
        <label>Nama Pengunjung:</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tanggal Kunjungan:</label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Keperluan:</label>
        <textarea
          value={keperluan}
          onChange={(e) => setKeperluan(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label>Asal Instansi:</label>
        <input
          type="text"
          value={instansi}
          onChange={(e) => setInstansi(e.target.value)}
          required
        />
      </div>
      <button type="submit">Kirim</button>
    </form>
  </motion.div>
</div>

{/* BACK: Form Ulasan */}
<div className="form-face form-back">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2>Ulasan Pengunjung</h2>
    <form onSubmit={handleUlasanSubmit}>
      <div>
        <label>Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Ulasan:</label>
        <textarea
          value={ulasan}
          onChange={(e) => setUlasan(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Kirim Ulasan</button>
    </form>
  </motion.div>
</div>

          </div>
        </div>

        <div className="toggle-switch-container">
          <div className={`toggle-switch ${flipped ? 'right' : 'left'}`}>
            <button onClick={() => setFlipped(false)}>
              📝 <span>Input Kunjungan</span>
            </button>
            <button onClick={() => setFlipped(true)}>
              💬 <span>Input Ulasan</span>
            </button>
            <div className="slider-bg" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FormKunjungan;
