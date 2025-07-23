import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';  // Import Logo Component

const Header = () => {
  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo Component on the left */}
        <Logo />
      </div>
      <nav style={navStyle}>
  <Link to="/" style={linkStyle}>Home</Link>
  <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
  <a href="/admin-login" target="_blank" rel="noopener noreferrer" style={adminLinkStyle}>
    Admin
  </a>
</nav>

    </header>
  );
};

const headerStyle = {
  backgroundColor: 'black',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',  // Spread Logo and Navigation
  alignItems: 'center',
};

const navStyle = {
  display: 'flex',
  gap: '20px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: 'bold',
};

const adminLinkStyle = {
  color: '#bbb',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
};

export default Header;
