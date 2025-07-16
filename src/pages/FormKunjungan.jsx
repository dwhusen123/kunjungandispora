import React, { useState } from 'react';
import '../Styles/FormKunjungan.css';
import Navbar from '../components/Navbar/Navbar';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const FormKunjungan = () => {
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [instansi, setInstansi] = useState('');
  const [ulasan, setUlasan] = useState('');
  const [rating, setRating] = useState(5);
  const [flipped, setFlipped] = useState(false);

  const [submittedData, setSubmittedData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

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

    const payload = {
      nama,
      tanggal_kunjungan: tanggal,
      keperluan,
      instansi,
      status: 'menunggu',
    };

    try {
        const res = await fetch('https://monitoring-backend-production-55e5.up.railway.app/api/kunjungan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gagal kirim data');

      setSubmittedData(payload);
      setStatusLoading(true);
      setStatusText('');
      resetForm();

      setTimeout(() => {
        setStatusLoading(false);
        setStatusText('✅ Berhasil dikirim ke sistem');
      }, 3000);
    } catch (err) {
      console.error('❌ Gagal kirim kunjungan:', err);
      alert('❌ Gagal mengirim data');
    }
  };

  const handleUlasanSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nama,
      instansi,
      ulasan,
      rating,
    };

    try {
        const res = await fetch('https://monitoring-backend-production-55e5.up.railway.app/api/ulasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gagal mengirim ulasan');

      alert('✅ Ulasan berhasil dikirim. Terima kasih!');
      resetForm();
      setFlipped(false);
    } catch (err) {
      console.error('❌ Gagal kirim ulasan:', err);
      alert('❌ Gagal mengirim ulasan');
    }
  };

 const handleDownload = () => {
    const element = document.getElementById('bukti-kunjungan');
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: 'Bukti_Kunjungan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

  html2pdf().set(opt).from(element).save();
};

  const handleBack = () => {
    setSubmittedData(null);
    setStatusLoading(false);
    setStatusText('');
  };

  return (
    <>
      <Navbar />
      <div className="form-kunjungan motion-container">
        <motion.div
          className={`form-wrapper ${submittedData ? 'blurred' : ''}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`form-flip-container ${flipped ? 'flipped' : ''}`}>
            <div className="form-flip-inner">
              <div className="form-face form-front">
                <h2>Form Input Kunjungan</h2>
                <form onSubmit={handleKunjunganSubmit}>
                  <div><label>Nama:</label><input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required /></div>
                  <div><label>Tanggal:</label><input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required /></div>
                  <div><label>Keperluan:</label><textarea value={keperluan} onChange={(e) => setKeperluan(e.target.value)} required /></div>
                  <div><label>Instansi:</label><input type="text" value={instansi} onChange={(e) => setInstansi(e.target.value)} required /></div>
                  <button type="submit">Kirim</button>
                </form>
              </div>

              <div className="form-face form-back">
                <h2>Ulasan Pengunjung</h2>
                <form onSubmit={handleUlasanSubmit}>
                  <div><label>Nama:</label><input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required /></div>
                  <div><label>Instansi:</label><input type="text" value={instansi} onChange={(e) => setInstansi(e.target.value)} required /></div>
                  <div><label>Rating (1–5):</label><input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} required /></div>
                  <div><label>Ulasan:</label><textarea value={ulasan} onChange={(e) => setUlasan(e.target.value)} required /></div>
                  <button type="submit">Kirim Ulasan</button>
                </form>
              </div>
            </div>
          </div>

          <div className="toggle-switch-container">
            <div className={`toggle-switch ${flipped ? 'right' : 'left'}`}>
              <button onClick={() => setFlipped(false)}>📝 <span>Input Kunjungan</span></button>
              <button onClick={() => setFlipped(true)}>💬 <span>Input Ulasan</span></button>
              <div className="slider-bg" />
            </div>
          </div>
        </motion.div>

{/* PREVIEW */}
        {submittedData && (
 <div className="preview-overlay">
            <div className="preview-box-wrapper">
              <div className="preview-box" id="bukti-kunjungan">
                <h3>BUKTI KUNJUNGAN DISPORA PROVINSI SUMATERA SELATAN</h3>
                <p><strong>Nama:</strong> {submittedData.nama}</p>
                <p><strong>Tanggal:</strong> {submittedData.tanggal_kunjungan}</p>
                <p><strong>Instansi:</strong> {submittedData.instansi}</p>
                <p><strong>Keperluan:</strong> {submittedData.keperluan}</p>
                <p><strong>Status:</strong> {statusLoading ? <span className="loading-spinner" /> : statusText}</p>
        <p>&copy; {new Date().getFullYear()} Dinas Pemuda dan Olahraga Provinsi Sumatera Selatan</p>
              </div>
            </div>
            <div className="preview-buttons">
              <button onClick={handleDownload}>⬇️ Unduh</button>
              <button onClick={handleBack}>↩️ Kembali</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FormKunjungan;
