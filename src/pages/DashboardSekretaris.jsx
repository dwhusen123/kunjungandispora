import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import '../Styles/DashboardAdmin.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const DashboardSekretaris = () => {
  const [pengunjungData, setPengunjungData] = useState([]);
  const [dataYangDikirim, setDataYangDikirim] = useState([]);
  const [ulasanSekretaris, setUlasanSekretaris] = useState([]);
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
const [sekretarisProfil, setSekretarisProfil] = useState({
  nama: 'Yudi Saputra, S.T, M.T',
  jabatan: 'Sekretaris DISPORA Sumsel',
  email: 'Yudisaputra@dispora.go.id',
  telp: '0812-3456-7890'
});

const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    loadData();
    const storedProfil = localStorage.getItem('sekretarisProfil');
if (storedProfil) {
  setSekretarisProfil(JSON.parse(storedProfil));
}

    fetchUlasanSekretaris();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/kunjungan');
      const allData = await response.json();

      const dataForSekretaris = allData.filter(data =>
        data.status === 'dikirim ke sekretaris' || data.status === 'sudah divalidasi'
      );

      setPengunjungData(allData);
      setDataYangDikirim(dataForSekretaris);
    } catch (error) {
      console.error('Gagal memuat data:', error);
    }
  };

  const fetchUlasanSekretaris = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/ulasan');
      const filtered = res.data.filter((ulasan) => ulasan.status === 'dikirim ke sekretaris');
      setUlasanSekretaris(filtered);
    } catch (err) {
      console.error('Gagal mengambil ulasan sekretaris:', err);
    }
  };

  const handleValidasi = async (id) => {
    const confirmed = window.confirm('Validasi data ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5001/api/kunjungan/${id}/validasi`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('✅ Data berhasil divalidasi!');
        loadData();
      } else {
        alert('❌ Gagal validasi data');
      }
    } catch (error) {
      console.error('Gagal validasi:', error);
      alert('Terjadi kesalahan saat validasi');
    }
  };

  const handleCetakData = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk dicetak!');
      return;
    }

    const printContent = filteredData.map((data) => (
      `<tr>
        <td>${data.nama}</td>
        <td>${new Date(data.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
        <td>${data.instansi}</td>
        <td>${data.keperluan}</td>
        <td>${data.status}</td>
      </tr>`
    )).join('');

    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write('<html><head><title>Cetak Data Pengunjung Bulanan</title></head><body>');
    printWindow.document.write('<h2>Data Pengunjung Bulanan</h2>');
    printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0"><thead><tr><th>Nama</th><th>Tanggal</th><th>Instansi</th><th>Keperluan</th><th>Status</th></tr></thead><tbody>');
    printWindow.document.write(printContent);
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleCetakUlasan = () => {
    if (ulasanSekretaris.length === 0) {
      alert('Tidak ada ulasan untuk dicetak!');
      return;
    }
    const printContent = ulasanSekretaris.map((item) => (
      `<tr>
        <td>${item.nama}</td>
        <td>${item.rating} ⭐</td>
        <td>${item.ulasan}</td>
        <td>${new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
      </tr>`
    )).join('');
    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write('<html><head><title>Cetak Ulasan</title>');
    printWindow.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;text-align:left;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>Ulasan Pengunjung</h2>');
    printWindow.document.write('<table><thead><tr><th>Nama</th><th>Rating</th><th>Ulasan</th><th>Tanggal</th></tr></thead><tbody>');
    printWindow.document.write(printContent);
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const filteredData = dataYangDikirim.filter((item) => {
    const itemDate = new Date(item.tanggal_kunjungan);
    const itemMonth = itemDate.getMonth() + 1;
    const itemYear = itemDate.getFullYear();

    return (
      item.nama.toLowerCase().includes(search.toLowerCase()) &&
      (selectedMonth ? itemMonth === parseInt(selectedMonth) : true) &&
      (selectedYear ? itemYear === parseInt(selectedYear) : true)
    );
  });

  const handleProfilChange = (e) => {
  const { name, value } = e.target;
  setSekretarisProfil((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSaveProfil = () => {
  setIsEditing(false);
  localStorage.setItem('sekretarisProfil', JSON.stringify(sekretarisProfil));
  alert('✅ Profil berhasil disimpan.');
};


const renderDashboard = () => {
  const totalDikirim = dataYangDikirim.filter(d => d.status === 'dikirim ke sekretaris').length;
  const totalValidasi = dataYangDikirim.filter(d => d.status === 'sudah divalidasi').length;

  const pieData = [
    { name: 'Menunggu Validasi', value: totalDikirim },
    { name: 'Sudah Divalidasi', value: totalValidasi },
  ];

  const COLORS = ['#FF7A00', '#2E8B57'];

  return (
    <div className="dashboard-stats">
      <h2 className="dashboard-title">Selamat Datang Sekretaris Dispora</h2>
      <div className="stats-grid">
        <div className="stat-card card-blue">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Kunjungan</h3>
            <p>{dataYangDikirim.length}</p>
          </div>
        </div>
        <div className="stat-card card-orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Menunggu Validasi</h3>
            <p>{totalDikirim}</p>
          </div>
        </div>
        <div className="stat-card card-green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Sudah Divalidasi</h3>
            <p>{totalValidasi}</p>
          </div>
        </div>
      </div>
      
      <div className="mini-statistik">
        <h3>Status Validasi Kunjungan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

  const renderDataPengunjung = () => (
    <div className="data-pengunjung">
      <div className="cetak-btn-wrapper">
  <button onClick={handleCetakData} className="cetak-ulasan-btn">Cetak Data Bulanan</button>
</div>
      <h2>Data Pengunjung yang Dikirim</h2>
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-selects">
    <label>Bulan: </label>
    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
      <option value="">Semua</option>
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
      ))}
    </select>
    <label>Tahun: </label>
    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
      <option value="">Semua</option>
      {[...new Set(dataYangDikirim.map((data) => new Date(data.tanggal_kunjungan).getFullYear()))].map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Instansi</th>
            <th>Keperluan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data) => (
            <tr
              key={data.id}
              style={{ backgroundColor: data.status === 'sudah divalidasi' ? '#d3ffd3' : '#f2f2f2' }}
            >
              <td>{data.nama}</td>
              <td>{new Date(data.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
              <td>{data.instansi}</td>
              <td>{data.keperluan}</td>
              <td>{data.status}</td>
              <td>
                {data.status === 'dikirim ke sekretaris' && (
                  <button onClick={() => handleValidasi(data.id)} style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}>
                    Validasi
                  </button>
                )}
                {data.status === 'sudah divalidasi' && (
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Tervalidasi</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

 const renderUlasan = () => (
  <div className="ulasan-pengunjung">
    <button onClick={handleCetakUlasan} className="cetak-ulasan-btn">Cetak Ulasan</button>
    <h2>Ulasan dari Pengunjung</h2>
    {ulasanSekretaris.length === 0 ? (
      <p>Tidak ada ulasan yang dikirim.</p>
    ) : (
      <table className="ulasan-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Rating</th>
            <th>Ulasan</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {ulasanSekretaris.map((item) => (
            <tr key={item.id}>
              <td>{item.nama}</td>
              <td>{item.rating} ⭐</td>
              <td>{item.ulasan}</td>
              <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);


const renderProfilSekretaris = () => (
  <div className="profil-sekretaris">
    <h2>Profil Sekretaris</h2>
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '400px'
    }}>
      {isEditing ? (
        <>
          <p><strong>Nama:</strong> <input type="text" name="nama" value={sekretarisProfil.nama} onChange={handleProfilChange} /></p>
          <p><strong>Jabatan:</strong> <input type="text" name="jabatan" value={sekretarisProfil.jabatan} onChange={handleProfilChange} /></p>
          <p><strong>Email:</strong> <input type="email" name="email" value={sekretarisProfil.email} onChange={handleProfilChange} /></p>
          <p><strong>No. Telepon:</strong> <input type="text" name="telp" value={sekretarisProfil.telp} onChange={handleProfilChange} /></p>
          <button onClick={handleSaveProfil} style={{ backgroundColor: '#28a745', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px' }}>Simpan</button>
        </>
      ) : (
        <>
          <p><strong>Nama:</strong> {sekretarisProfil.nama}</p>
          <p><strong>Jabatan:</strong> {sekretarisProfil.jabatan}</p>
          <p><strong>Email:</strong> {sekretarisProfil.email}</p>
          <p><strong>No. Telepon:</strong> {sekretarisProfil.telp}</p>
          <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#007bff', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px' }}>Edit Profil</button>
        </>
      )}
    </div>
  </div>
);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Apakah Anda yakin ingin logout?');
    if (confirmLogout) {
      window.location.href = '/';
    }
  };

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex' }}>
      <div className="sidebar" style={{ marginTop: '50px' }}>
        <h3>Sekretaris Dispora</h3>
        <ul>
          <li>
            <button onClick={() => setActiveMenu('dashboard')} className={activeMenu === 'dashboard' ? 'active' : ''}><span>📊</span>Dashboard</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('data')} className={activeMenu === 'data' ? 'active' : ''}><span>👥</span>Data Pengunjung</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('ulasan')} className={activeMenu === 'ulasan' ? 'active' : ''}><span>📝</span>Ulasan</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('profil')} className={activeMenu === 'profil' ? 'active' : ''}><span>👤</span>Profil Sekretaris</button>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <Navbar />
        {activeMenu === 'dashboard' && renderDashboard()}
        {activeMenu === 'data' && renderDataPengunjung()}
        {activeMenu === 'ulasan' && renderUlasan()}
        {activeMenu === 'profil' && renderProfilSekretaris()}
      </div>
    </div>
  );
};

export default DashboardSekretaris;
