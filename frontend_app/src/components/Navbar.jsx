import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';
import snapstudyLogo from '../assets/snapstudy.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="masthead py-3" style={{ position: 'relative' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center" style={{ height: '60px' }}>
    
      {/* Logo + Brand on left */}
      <a className="navbar-brand d-flex align-items-center" href="#">
        <img
          src={snapstudyLogo}
          alt="SnapStudy Logo"
          className="d-inline-block logo-img"
          style={{ height: '140px', marginRight: '10px'}}
        />
        <span className="text-white fs-4">SnapStudy</span>
      </a>

        {/* Mobile toggle button */}
        <button 
          className="navbar-toggle d-lg-none"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '0.4rem', borderRadius: '0.25rem' }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></span>
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></span>
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></span>
        </button>

        <nav className={`navbar-nav-container d-lg-block ${isOpen ? 'd-block' : 'd-none'}`}>
          <ul className="nav masthead-nav">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/uploadfile"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Upload Files
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/archives"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Archives
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/flashcards"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                Flashcards
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}