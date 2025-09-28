
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <header className="masthead py-3">
      <div className="container-fluid d-flex justify-content-between align-items-center" style={{ height: '60px' }}>
    
      {/* Logo + Brand on left */}
      <a className="navbar-brand d-flex align-items-center" href="#">
        <img
          src="./public/assets/snapstudy.svg"
          alt="SnapStudy Logo"
          //className="d-inline-block logo-img"
          style={{ height: '140px', marginRight: '-35px', marginLeft: '-30px'}} // small space
        />
        <span className="text-white fs-4">SnapStudy</span>
        {/* <span className="glowy-text">SnapStudy</span> */}
      </a>

        <nav>
          <ul className="nav masthead-nav">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? 'active' : ''}`
                }
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
