// src/components/Navbar.jsx
import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';  // pastikan gambar logo benar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">DISPORA SUMSEL</span>
      </div>
    </nav>
  );
};

export default Navbar;
