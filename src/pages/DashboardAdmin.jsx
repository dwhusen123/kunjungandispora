import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import '../Styles/DashboardAdmin.css';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DashboardAdmin = () => {
  const [pengunjungData, setPengunjungData] = useState([]);
  const [ulasanList, setUlasanList] = useState([]);
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('tanggal_desc');
  const sidebarRef = useRef(null);
  const [adminProfil, setAdminProfil] = useState({
    nama: 'Yudi Saputra, S.T, M.T',
    jabatan: 'Admin DISPORA Sumsel',
    email: 'Yudisaputra@dispora.go.id',
    telp: '0812-3456-7890'
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

useEffect(() => {
  const fetchDataKunjungan = async () => {
    try {
      const response = await fetch('https://monitoring-backend-production-55e5.up.railway.app/kunjungan');
      const data = await response.json();
      const sorted = data.sort((a, b) => new Date(b.tanggal_kunjungan) - new Date(a.tanggal_kunjungan));
      setPengunjungData(sorted);
    } catch (error) {
      console.error('❌ Gagal mengambil data kunjungan:', error);
    }
  };

  const fetchUlasan = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/ulasan');
      setUlasanList(res.data);
    } catch (error) {
      console.error('❌ Gagal mengambil ulasan:', error);
    }
  };

  // Jalankan keduanya secara paralel
  fetchDataKunjungan();
  fetchUlasan();

  // Ambil profil dari localStorage (jika ada)
  const storedProfile = JSON.parse(localStorage.getItem('adminProfil'));
    if (storedProfile) {
      setAdminProfil(storedProfile);
    }
}, []);


  const groupByDate = (data, type = 'daily') => {
    const result = {};
    data.forEach((item) => {
      const date = new Date(item.tanggal_kunjungan);
      const key = type === 'monthly'
        ? `${date.getFullYear()}-${date.getMonth() + 1}`
        : date.toISOString().split('T')[0];
      result[key] = (result[key] || 0) + 1;
    });
    return Object.entries(result).map(([tanggal, jumlah]) => ({ tanggal, jumlah }));
  };

  const statusData = [
  { status: 'Menunggu', jumlah: pengunjungData.filter(d => !d.status || d.status === 'menunggu').length },
  { status: 'Dikirim', jumlah: pengunjungData.filter(d => d.status === 'dikirim ke sekretaris').length },
  { status: 'Tervalidasi', jumlah: pengunjungData.filter(d => d.status === 'sudah divalidasi').length },
];

  const pieColors = ['#FF7A00', '#1a4d8f', '#2E8B57'];


  const renderDashboard = () => (
  <div className="dashboard-stats">
<h2 className="dashboard-title">Selamat Datang Admin Dispora</h2>
    <div className="stats-grid">
      <div className="stat-card card-blue">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <h3>Total Kunjungan</h3>
          <p>{pengunjungData.length}</p>
        </div>
      </div>
      <div className="stat-card card-green">
        <div className="stat-icon">📝</div>
        <div className="stat-info">
          <h3>Total Ulasan</h3>
          <p>{ulasanList.length}</p>
        </div>
      </div>
      <div className="stat-card card-orange">
        <div className="stat-icon">👥</div>
        <div className="stat-info">
          <h3>Hari Ini</h3>
          <p>{pengunjungData.filter(d =>
            new Date(d.tanggal_kunjungan).toDateString() === new Date().toDateString()
          ).length}</p>
        </div>
      </div>
    </div>
<div className="mini-statistik" style={{ maxWidth: '1000px', margin: '0 auto' }}>
  <h3>Status Validasi Kunjungan</h3>
  <ResponsiveContainer width="100%" height={200}>
    <PieChart>
      <Pie
        data={statusData}
        dataKey="jumlah"
        nameKey="status"
        cx="50%"
        cy="50%"
        outerRadius={60}
        innerRadius={30}
        label
      >
        {statusData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={10} />
    </PieChart>
  </ResponsiveContainer>
</div>
  </div>
);


const renderDataPengunjung = () => {
  const sortedData = [...pengunjungData].sort((a, b) => {
    switch (sortBy) {
      case 'nama_asc':
        return a.nama.localeCompare(b.nama);
      case 'tanggal_desc':
        return new Date(b.tanggal_kunjungan) - new Date(a.tanggal_kunjungan);
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      default:
        return 0;
    }
  });

  return (
    <div className="data-pengunjung">
       <div className="data-pengunjung">
    <h2>Data Pengunjung</h2>
    <div className="dashboard-controls">
      <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      <label htmlFor="sort">Urut Berdasarkan:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{ marginLeft: '10px' }}
      >
        <option value="nama_asc">Nama</option>
        <option value="tanggal_desc">Tanggal Kunjungan</option>
        <option value="status">Status</option>
      </select>
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
        {sortedData
        .filter((data) =>
      data.nama.toLowerCase().includes(search.toLowerCase()) )
        .map((data) => (
          <tr key={data.id}>
            <td>{data.nama}</td>
            <td>{new Date(data.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
            <td>{data.instansi}</td>
            <td>{data.keperluan}</td>
            <td>{data.status || 'menunggu'}</td>
            <td style={{ display: 'flex', gap: '8px' }}>
              {data.status !== 'dikirim ke sekretaris' && data.status !== 'sudah divalidasi' && (
                <button onClick={() => handleKirim(data.id)}>Kirim</button>
              )}
              <button
                onClick={() => handleHapus(data.id)}
                style={{ backgroundColor: 'red', color: 'white' }}
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    </div>
  );
};


const handleKirim = async (id) => {
  const confirmed = window.confirm('Kirim data ini ke sekretaris?');
  if (!confirmed) return;

  try {
    const response = await axios.put(`http://localhost:5001/api/kunjungan/${id}/kirim`);

    if (response.status === 200) {
      const updated = pengunjungData.map((data) =>
        data.id === id ? { ...data, status: 'dikirim ke sekretaris' } : data
      );
      setPengunjungData(updated);
      localStorage.setItem('kunjunganList', JSON.stringify(updated));
      alert('Data berhasil dikirim ke sekretaris!');
    } else {
      alert('Gagal mengirim data ke sekretaris');
    }
  } catch (error) {
    console.error('Error saat mengirim:', error);
    alert('Terjadi kesalahan saat mengirim data.');
  }
};


const handleHapus = async (id) => {
  const confirmed = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:5001/api/kunjungan`);
    alert('✅ Data berhasil dihapus.');

    // Update state agar data terhapus dari tampilan
    setPengunjungData((prev) => prev.filter((item) => item.id !== id));
  } catch (error) {
    console.error('❌ Gagal hapus data:', error);
    alert('❌ Gagal menghapus data.');
  }
};

 const handleKirimUlasan = async (id) => {
  const confirmed = window.confirm('Kirim ulasan ini ke sekretaris?');
  if (!confirmed) return;

  try {
    const res = await axios.put(`http://localhost:5001/api/ulasan/${id}/kirim`);
    if (res.status === 200) {
      const updated = ulasanList.map((item) =>
        item.id === id ? { ...item, status: 'dikirim ke sekretaris' } : item
      );
      setUlasanList(updated);
      localStorage.setItem('ulasanSekretaris', JSON.stringify(updated.filter(item => item.status === 'dikirim ke sekretaris')));
      alert('✅ Ulasan berhasil dikirim ke sekretaris!');
    } else {
      alert('❌ Gagal mengirim ulasan.');
    }
  } catch (err) {
    console.error('❌ Gagal mengirim ulasan:', err);
    alert('Terjadi kesalahan saat mengirim ulasan.');
  }
};

 const handleHapusUlasan = async (id) => {
  const confirmed = window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?');
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:5001/api/ulasan/${id}`);
    const updated = ulasanList.filter((ulasan) => ulasan.id !== id);
    setUlasanList(updated);
    alert('✅ Ulasan berhasil dihapus.');
  } catch (err) {
    console.error('❌ Gagal menghapus ulasan:', err);
    alert('❌ Terjadi kesalahan saat menghapus ulasan.');
  }
};


const renderUlasan = () => {
  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString('id-ID');

const renderTombolAksi = (item) => (
  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
    {item.status !== 'dikirim ke sekretaris' && (
      <button
        style={{
          fontSize: '12px',
          padding: '4px 10px',
          borderRadius: '4px',
          backgroundColor: '#1a4d8f',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={() => handleKirimUlasan(item.id)}
      >
        Kirim
      </button>
    )}
    <button
      style={{
        fontSize: '12px',
        padding: '4px 10px',
        borderRadius: '4px',
        backgroundColor: '#d9534f',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
      }}
      onClick={() => handleHapusUlasan(item.id)}
    >
      Hapus
    </button>
  </div>
);



  return (
    <div className="ulasan-pengunjung">
      <h2 className="section-title">Ulasan Pengunjung</h2>

      {ulasanList.length === 0 ? (
        <p>Tidak ada ulasan saat ini.</p>
      ) : (
        <div className="ulasan-table-container">
          <table className="ulasan-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Rating</th>
                <th>Ulasan</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ulasanList.map((item) => (
                <tr key={item.id} className="ulasan-table-row">
                  <td>{item.nama}</td>
                  <td>{item.rating} ⭐</td>
                  <td>{item.ulasan}</td>
                  <td>{formatTanggal(item.tanggal)}</td>
                  <td>{renderTombolAksi(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


  const renderStatistik = () => {
    const dailyData = groupByDate(pengunjungData, 'daily');
    const monthlyData = groupByDate(pengunjungData, 'monthly');

    return (
      <div className="statistik-pengunjung">
        <h2>Statistik Pengunjung</h2>
        <p>Jumlah Total: {pengunjungData.length}</p>
        <p>Dikirim ke Sekretaris: {pengunjungData.filter((d) => d.status === 'dikirim ke sekretaris').length}</p>
        <p>Sudah Divalidasi: {pengunjungData.filter((d) => d.status === 'sudah divalidasi').length}</p>

        <div style={{ width: '100%', height: 300 }}>
          <h3>Grafik Harian</h3>
          <ResponsiveContainer>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="jumlah" stroke="#FF7A00" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '100%', height: 300, marginTop: 40 }}>
          <h3>Grafik Bulanan</h3>
          <ResponsiveContainer>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#2E8B57" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

const handleProfilChange = (e) => {
    const { name, value } = e.target;
    setAdminProfil((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfil = () => {
    setIsEditing(false);
    localStorage.setItem('adminProfil', JSON.stringify(adminProfil));
    alert('✅ Profil berhasil disimpan!');
  };

  const renderProfil = () => (
    <div className="profil-admin">
      <h2>Profil Admin</h2>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', maxWidth: '400px' }}>
        {isEditing ? (
          <>
            <p><strong>Nama:</strong> <input type="text" name="nama" value={adminProfil.nama} onChange={handleProfilChange} /></p>
            <p><strong>Jabatan:</strong> <input type="text" name="jabatan" value={adminProfil.jabatan} onChange={handleProfilChange} /></p>
            <p><strong>Email:</strong> <input type="email" name="email" value={adminProfil.email} onChange={handleProfilChange} /></p>
            <p><strong>No. Telepon:</strong> <input type="text" name="telp" value={adminProfil.telp} onChange={handleProfilChange} /></p>
            <button onClick={handleSaveProfil} style={{ backgroundColor: '#28a745', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px' }}>Simpan</button>
          </>
        ) : (
          <>
            <p><strong>Nama:</strong> {adminProfil.nama}</p>
            <p><strong>Jabatan:</strong> {adminProfil.jabatan}</p>
            <p><strong>Email:</strong> {adminProfil.email}</p>
            <p><strong>No. Telepon:</strong> {adminProfil.telp}</p>
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
    <div className="dashboard-wrapper">
      <button className="burger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
         ☰
      </button>
      <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`} ref={sidebarRef}>
  <div className="sidebar-header">
    <h3>Admin Dispora</h3>
  </div>
  <ul className="sidebar-menu">
    <li><button onClick={() => setActiveMenu('dashboard')} className={`sidebar-button ${activeMenu === 'dashboard' ? 'active' : ''}`}><span>📊</span> Dashboard</button></li>
    <li><button onClick={() => setActiveMenu('data')} className={`sidebar-button ${activeMenu === 'data' ? 'active' : ''}`}><span>👥</span> Data Pengunjung</button></li>
    <li><button onClick={() => setActiveMenu('ulasan')} className={`sidebar-button ${activeMenu === 'ulasan' ? 'active' : ''}`}><span>📝</span> Ulasan</button></li>
    <li><button onClick={() => setActiveMenu('statistik')} className={`sidebar-button ${activeMenu === 'statistik' ? 'active' : ''}`}><span>📈</span> Statistik</button></li>
    <li><button onClick={() => setActiveMenu('profil')} className={`sidebar-button ${activeMenu === 'profil' ? 'active' : ''}`}><span>👤</span> Profil</button></li>
    <li><button onClick={handleLogout} className="sidebar-button"><span>🚪</span> Logout</button></li>
  </ul>
</div>

      <div className="main-content">
        <Navbar />
        {activeMenu === 'dashboard' && renderDashboard()}
        {activeMenu === 'data' && renderDataPengunjung()}
        {activeMenu === 'ulasan' && renderUlasan()}
        {activeMenu === 'statistik' && renderStatistik()}
        {activeMenu === 'profil' && renderProfil()}
      </div>
    </div>
  );
};

export default DashboardAdmin;
