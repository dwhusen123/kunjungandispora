const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti jika kamu pakai password
  database: 'monitoring_kunjungan'
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error('❌ Gagal terhubung ke database:', err);
    return;
  }
  console.log('✅ Terhubung ke database MySQL');
});

// Route GET: Ambil semua data kunjungan
app.get('/api/kunjungan', (req, res) => {
  db.query('SELECT * FROM kunjungan ORDER BY id DESC', (err, result) => {
    if (err) {
      console.error('❌ Gagal mengambil data:', err);
      return res.status(500).send('Gagal ambil data');
    }
    res.json(result);
  });
});

// Route POST: Tambah kunjungan
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


// Route PUT: Kirim data ke sekretaris
app.put('/api/kunjungan/:id/kirim', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE kunjungan SET status = ? WHERE id = ?';

  db.query(query, ['dikirim ke sekretaris', id], (err, result) => {
    if (err) {
      console.error('❌ Gagal mengirim data:', err);
      return res.status(500).send('Gagal mengirim data');
    }
    res.send('✅ Data berhasil dikirim ke sekretaris');
  });
});

// Validasi kunjungan oleh sekretaris
app.put('/api/kunjungan/:id/validasi', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE kunjungan SET status = ? WHERE id = ?';

  db.query(query, ['sudah divalidasi', id], (err, result) => {
    if (err) return res.status(500).send('Gagal validasi data');
    res.send('✅ Berhasil divalidasi');
  });
});

// Login admin
app.post('/api/login/admin', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user WHERE username = ? AND password = ? AND role = "admin"';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('❌ Login admin gagal:', err);
      return res.status(500).send('Server error');
    }

    if (result.length === 0) {
      return res.status(401).send('Username atau password salah');
    }

    res.json({ message: 'Login berhasil', user: result[0] });
  });
});

// Route Login Sekretaris
app.post('/api/login/sekretaris', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user WHERE username = ? AND password = ? AND role = ?';
  db.query(query, [username, password, 'sekretaris'], (err, result) => {
    if (err) {
      console.error('Gagal login:', err);
      return res.status(500).send('Gagal login');
    }

    if (result.length === 0) {
      return res.status(401).send('Username atau password salah');
    }

    res.json({ message: 'Login berhasil', user: result[0] });
  });
});

// Jalankan server
app.listen(5001, () => {
  console.log('🚀 Server berjalan di http://localhost:5001');
});
