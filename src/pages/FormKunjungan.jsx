import React, { useState } from 'react';
import '../Styles/FormKunjungan.css';
import Navbar from '../components/Navbar/Navbar';
import axios from 'axios';

const FormKunjungan = () => {
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [instansi, setInstansi] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5001/api/kunjungan', {
        nama,
        tanggal_kunjungan: tanggal,
        keperluan,
        instansi,
        status: 'menunggu',
      });

      setNama('');
      setTanggal('');
      setKeperluan('');
      setInstansi('');

      const wantsToReview = window.confirm('✅ Kunjungan berhasil dicatat.\nApakah Anda ingin memberikan ulasan?');
      if (wantsToReview) {
        window.location.href = '/ulasan';
      } else {
        setSuccessMessage(`✅ Terima kasih, ${nama}. Kunjungan Anda berhasil dicatat.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }

    } catch (error) {
      console.error('Gagal:', error);
      alert('❌ Gagal mengirim data');
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-kunjungan animated-form">
        <h2>Form Input Kunjungan</h2>

        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nama Pengunjung:</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan Nama Pengunjung"
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
            <label>Keperluan Kunjungan:</label>
            <textarea
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              placeholder="Masukkan Keperluan Kunjungan"
              required
            ></textarea>
          </div>
          <div>
            <label>Asal Instansi:</label>
            <input
              type="text"
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              placeholder="Masukkan Asal Instansi"
              required
            />
          </div>
          <button type="submit">Kirim</button>
        </form>
      </div>
    </>
  );
};

export default FormKunjungan;
