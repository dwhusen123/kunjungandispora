// src/pages/UlasanPengunjung.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import '../Styles/FormKunjungan.css'; // bisa gunakan style form yang sama

const UlasanPengunjung = () => {
  const [nama, setNama] = useState('');
  const [ulasan, setUlasan] = useState('');
  const [rating, setRating] = useState(5);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
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

    setNama('');
    setUlasan('');
    setRating(5);
    setSuccessMessage('✅ Terima kasih atas ulasan Anda!');

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="form-kunjungan">
      <Navbar />
      <h2>Ulasan Pengunjung</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama:</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama Anda"
            required
          />
        </div>
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
            placeholder="Tulis pendapat atau saran Anda..."
            required
          ></textarea>
        </div>
        <button type="submit">Kirim Ulasan</button>
      </form>
    </div>
  );
};

export default UlasanPengunjung;
