import React, { useState, useEffect } from 'react';
import '../Styles/DashboardAdmin.css'; // pastikan file CSS sudah include .profil-admin

const AdminProfile = () => {
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
  
    useEffect(() => {
      const storedProfile = JSON.parse(localStorage.getItem('adminProfile')) || {
        name: 'Admin Dispora',
        email: 'admin@dispora.go.id',
      };
      setProfile(storedProfile);
      setFormData(storedProfile);
    }, []);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSave = () => {
      localStorage.setItem('adminProfile', JSON.stringify(formData));
      setProfile(formData);
      setEditing(false);
    };
  
    return (
      <div className="profil-admin">
        <div className="admin-badge" title="Administrator">👤</div>
        <h2>Profil Admin</h2>
  
        {editing ? (
          <div className="form-container">
            <div className="input-group">
              <label htmlFor="name">Nama:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <button className="save-button" onClick={handleSave}>Simpan</button>
          </div>
        ) : (
          <div className="info-group">
            <p><strong>Nama:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <button className="edit-button" onClick={() => setEditing(true)}>Edit Profil</button>
          </div>
        )}
      </div>
    );
  };
  
  export default AdminProfile;