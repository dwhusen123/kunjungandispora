import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormKunjungan from './pages/FormKunjungan';
import LoginPegawai from './pages/LoginPegawai';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardSekretaris from './pages/DashboardSekretaris';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form-kunjungan" element={<FormKunjungan />} />
        <Route path="/login-pegawai" element= {<LoginPegawai />} />
        <Route path="/dashboard-admin" element= {<DashboardAdmin />} />
        <Route path="/dashboard-sekretaris" element= {<DashboardSekretaris />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
