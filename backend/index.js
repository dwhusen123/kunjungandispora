const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect((err) => {
  if (err) {
    console.error('❌ Gagal terhubung ke database:', err);
    return;
  }
  console.log('✅ Terhubung ke database MySQL');
});

// ===================== KUNJUNGAN ===================== //

// GET semua kunjungan
app.get('/api/kunjungan', (req, res) => {
  db.query('SELECT * FROM kunjungan ORDER BY id DESC', (err, result) => {
    if (err) {
      console.error('❌ Gagal mengambil data:', err);
      return res.status(500).send('Gagal ambil data');
    }
    res.json(result);
  });
});

// POST tambah kunjungan
app.post('/api/kunjungan', (req, res) => {
  const { nama, tanggal_kunjungan, instansi, keperluan } = req.body;
  const status = 'menunggu';

  const query = 'INSERT INTO kunjungan (nama, tanggal_kunjungan, instansi, keperluan, status) VALUES (?, ?, ?, ?, ?)';
  const values = [nama, tanggal_kunjungan, instansi, keperluan, status];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Gagal menyimpan kunjungan:', err);
      return res.status(500).send('Gagal menyimpan kunjungan');
    }
    res.send({ message: '✅ Kunjungan berhasil dicatat', id: result.insertId });
  });
});

// DELETE kunjungan berdasarkan ID
app.delete('/api/kunjungan/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM kunjungan WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Gagal menghapus kunjungan:', err);
      return res.status(500).send('Gagal menghapus kunjungan');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Data tidak ditemukan');
    }
    res.send('✅ Kunjungan berhasil dihapus');
  });
});

// PUT kirim ke sekretaris
app.put('/api/kunjungan/:id/kirim', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE kunjungan SET status = ? WHERE id = ?', ['dikirim ke sekretaris', id], (err, result) => {
    if (err) {
      console.error('❌ Gagal mengirim data:', err);
      return res.status(500).send('Gagal mengirim data');
    }
    res.send('✅ Data berhasil dikirim ke sekretaris');
  });
});

// PUT validasi kunjungan
app.put('/api/kunjungan/:id/validasi', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE kunjungan SET status = ? WHERE id = ?', ['sudah divalidasi', id], (err, result) => {
    if (err) return res.status(500).send('Gagal validasi data');
    res.send('✅ Berhasil divalidasi');
  });
});

// ===================== ULASAN ===================== //

// GET semua ulasan
app.get('/api/ulasan', (req, res) => {
  db.query('SELECT * FROM ulasan ORDER BY tanggal DESC', (err, result) => {
    if (err) return res.status(500).send('Gagal ambil data ulasan');
    res.json(result);
  });
});

// POST ulasan baru
app.post('/api/ulasan', (req, res) => {
  const { nama, instansi, rating, ulasan } = req.body;
  const sql = 'INSERT INTO ulasan (nama, instansi, rating, ulasan) VALUES (?, ?, ?, ?)';
  db.query(sql, [nama, instansi, rating, ulasan], (err, result) => {
    if (err) return res.status(500).send('Gagal simpan ulasan');
    res.json({ id: result.insertId, message: '✅ Ulasan disimpan' });
  });
});

// PUT kirim ke sekretaris
app.put('/api/ulasan/:id/kirim', (req, res) => {
  const { id } = req.params;
  const sql = 'UPDATE ulasan SET status = "dikirim ke sekretaris" WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).send('Gagal mengirim ulasan');
    res.json({ message: '✅ Ulasan dikirim ke sekretaris' });
  });
});

// DELETE ulasan
app.delete('/api/ulasan/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM ulasan WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Gagal hapus ulasan');
    res.send('✅ Ulasan dihapus');
  });
});


// ===================== LOGIN PEGAWAI ===================== //

// POST login pegawai
app.post('/api/login/pegawai', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM user WHERE username = ? AND password = ? AND role IN ("admin", "sekretaris")';

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('❌ Login pegawai gagal:', err);
      return res.status(500).send('Terjadi kesalahan pada server');
    }

    if (result.length === 0) {
      return res.status(401).send('Username atau password salah');
    }

    const user = result[0];
    res.json({
      message: 'Login berhasil',
      role: user.role,
      user
    });
  });
});

// ===================== SERVER START ===================== //
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

