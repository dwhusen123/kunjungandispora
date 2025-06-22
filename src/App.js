import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormKunjungan from './pages/FormKunjungan';
import LoginAdmin from './pages/LoginAdmin';
import LoginSekretaris from './pages/LoginSekretaris';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardSekretaris from './pages/DashboardSekretaris';
import AdminProfile from './pages/AdminProfile';
import UlasanPengunjung from './pages/UlasanPengunjung';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form-kunjungan" element={<FormKunjungan />} />
        <Route path="/login-admin" element= {<LoginAdmin />} />
        <Route path="/login-sekretaris" element= {<LoginSekretaris />} />
        <Route path="/dashboard-admin" element= {<DashboardAdmin />} />
        <Route path="/dashboard-sekretaris" element= {<DashboardSekretaris />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/ulasan" element={<UlasanPengunjung />} />
      </Routes>
    </Router>
  );
}

export default App;
