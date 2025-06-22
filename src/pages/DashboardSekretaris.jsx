import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import '../Styles/DashboardAdmin.css';
import axios from 'axios';

const DashboardSekretaris = () => {
  const [pengunjungData, setPengunjungData] = useState([]);
  const [dataYangDikirim, setDataYangDikirim] = useState([]); // Data yang sudah dikirim admin
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

useEffect(() => {
  loadData();
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

const handleValidasi = async (id) => {
  const confirmed = window.confirm('Validasi data ini?');
  if (!confirmed) return;

  try {
    const response = await fetch(`http://localhost:5001/api/kunjungan/${id}/validasi`, {
      method: 'PUT',
    });

    if (response.ok) {
      alert('✅ Data berhasil divalidasi!');
      loadData(); // refresh data
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

  // Filter data berdasarkan pencarian dan bulan/tahun
  const filteredData = dataYangDikirim.filter((item) => {
    const itemDate = new Date(item.tanggal);
    const itemMonth = itemDate.getMonth() + 1;
    const itemYear = itemDate.getFullYear();

    return (
      item.nama.toLowerCase().includes(search.toLowerCase()) &&
      (selectedMonth ? itemMonth === parseInt(selectedMonth) : true) &&
      (selectedYear ? itemYear === parseInt(selectedYear) : true)
    );
  });

  const renderDashboard = () => (
    <div className="dashboard-stats">
      <h2>Selamat Datang Sekretaris</h2>
      <p>Total Kunjungan yang Dikirim: <strong>{dataYangDikirim.length}</strong></p>
      <p>Menunggu Validasi: <strong>{dataYangDikirim.filter(d => d.status === 'dikirim ke sekretaris').length}</strong></p>
      <p>Sudah Divalidasi: <strong>{dataYangDikirim.filter(d => d.status === 'sudah divalidasi').length}</strong></p>
      
      {dataYangDikirim.length === 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '5px' 
        }}>
          <p style={{ margin: 0, color: '#6c757d' }}>
            Belum ada data pengunjung yang dikirim oleh admin.
          </p>
        </div>
      )}
    </div>
  );

  const renderDataPengunjung = () => (
    <div className="data-pengunjung">
      <h2>Data Pengunjung yang Dikirim</h2>
      
      {dataYangDikirim.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px',
          margin: '20px 0' 
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>Tidak Ada Data</h3>
          <p style={{ color: '#6c757d', margin: 0 }}>
            Belum ada data pengunjung yang dikirim oleh admin. 
            Data akan muncul setelah admin mengirim data pengunjung.
          </p>
        </div>
      ) : (
        <>
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <label>Bulan: </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Semua</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
              <label>Tahun: </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Semua</option>
                {[...new Set(dataYangDikirim.map((data) => new Date(data.tanggal).getFullYear()))].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button onClick={handleCetakData}>Cetak Data Bulanan</button>
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
        </>
      )}
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
      {/* Sidebar */}
      <div className="sidebar" style={{ marginTop: '60px' }}>
        <h3>Panel Sekretaris</h3>
        <ul>
          <li>
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={activeMenu === 'dashboard' ? 'active' : ''}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveMenu('data')}
              className={activeMenu === 'data' ? 'active' : ''}
            >
              Data Pengunjung
            </button>
          </li>
          <li>
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Navbar />
        {activeMenu === 'dashboard' && renderDashboard()}
        {activeMenu === 'data' && renderDataPengunjung()}
      </div>
    </div>
  );
};

export default DashboardSekretaris;