import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import '../Styles/DashboardAdmin.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DashboardAdmin = () => {
  const [pengunjungData, setPengunjungData] = useState([]);
  const [ulasanList, setUlasanList] = useState([]);
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [profile, setProfile] = useState({
    nama: 'Admin Dispora',
    email: 'admin@dispora.go.id',
    role: 'Administrator',
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
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/kunjungan');
        const data = await response.json();
        const sorted = data.sort((a, b) => new Date(b.tanggal_kunjungan) - new Date(a.tanggal_kunjungan));
        setPengunjungData(sorted);
      } catch (error) {
        console.error('Gagal mengambil data dari server:', error);
      }
    };

    fetchData();

    const ulasan = JSON.parse(localStorage.getItem('ulasanList')) || [];
    setUlasanList(ulasan);

    const storedProfile = JSON.parse(localStorage.getItem('adminProfile'));
    if (storedProfile) setProfile(storedProfile);
  }, []);

  const filteredData = pengunjungData.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase())
  );

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

  const renderDashboard = () => (
    <div className="dashboard-stats">
      <h2>Selamat Datang Admin</h2>
      <p>Total Kunjungan: <strong>{pengunjungData.length}</strong></p>
      <p>Total Ulasan: <strong>{ulasanList.length}</strong></p>
      <p>Pengunjung Hari Ini: <strong>{pengunjungData.filter(d =>
        new Date(d.tanggal_kunjungan).toDateString() === new Date().toDateString()
      ).length}</strong></p>
    </div>
  );

  const renderDataPengunjung = () => (
    <div className="data-pengunjung">
      <h2>Data Pengunjung</h2>
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            <tr key={data.id}>
              <td>{data.nama}</td>
              <td>{new Date(data.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
              <td>{data.instansi}</td>
              <td>{data.keperluan}</td>
              <td>{data.status || 'menunggu'}</td>
              <td style={{ display: 'flex', gap: '8px' }}>
  {data.status !== 'dikirim ke sekretaris' && data.status !== 'sudah divalidasi' && (
    <button onClick={() => handleKirim(data.id)}>Kirim</button>)}
    <button onClick={() => handleHapus(data.id)}
    style={{ backgroundColor: 'red', color: 'white' }}>Hapus</button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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

  const handleHapusUlasan = (id) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?');
    if (!confirmed) return;
    const updatedUlasan = ulasanList.filter((ulasan) => ulasan.id !== id);
    setUlasanList(updatedUlasan);
    localStorage.setItem('ulasanList', JSON.stringify(updatedUlasan));
  };

  const renderUlasan = () => (
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
                  <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                  <td>
                    <button className="btn-hapus" onClick={() => handleHapusUlasan(item.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

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
              <Line type="monotone" dataKey="jumlah" stroke="#8884d8" activeDot={{ r: 6 }} />
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
              <Bar dataKey="jumlah" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = () => {
    setIsEditing(false);
    localStorage.setItem('adminProfile', JSON.stringify(profile));
    alert('Profil berhasil diperbarui.');
  };

  const renderProfil = () => (
    <div className="profil-admin">
      <h2><FaUserCircle size={40} style={{ marginRight: 10 }} /> Profil Admin</h2>
      <div className="profil-info">
        <label>Nama:</label>
        {isEditing ? (
          <input type="text" name="nama" value={profile.nama} onChange={handleProfileChange} />
        ) : (
          <p>{profile.nama}</p>
        )}
        <label>Email:</label>
        {isEditing ? (
          <input type="email" name="email" value={profile.email} onChange={handleProfileChange} />
        ) : (
          <p>{profile.email}</p>
        )}
        <label>Role:</label>
        <p><span className="role-badge">{profile.role}</span></p>
        {isEditing ? (
          <button className="btn-save" onClick={handleProfileSave}>Simpan</button>
        ) : (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profil</button>
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
        <h3>Admin Panel</h3>
        <ul>
          <li><button onClick={() => setActiveMenu('dashboard')} className={`sidebar-button ${activeMenu === 'dashboard' ? 'active' : ''}`}>Dashboard</button></li>
          <li><button onClick={() => setActiveMenu('data')} className={`sidebar-button ${activeMenu === 'data' ? 'active' : ''}`}>Data Pengunjung</button></li>
          <li><button onClick={() => setActiveMenu('ulasan')} className={`sidebar-button ${activeMenu === 'ulasan' ? 'active' : ''}`}>Ulasan Pengunjung</button></li>
          <li><button onClick={() => setActiveMenu('statistik')} className={`sidebar-button ${activeMenu === 'statistik' ? 'active' : ''}`}>Statistik</button></li>
          <li><button onClick={() => setActiveMenu('profil')} className={`sidebar-button ${activeMenu === 'profil' ? 'active' : ''}`}>Profil</button></li>
          <li><button onClick={handleLogout} className="sidebar-button">Logout</button></li>
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
