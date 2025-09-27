
import React from 'react';
import { NavLink } from 'react-router-dom';
import '/src/styles/Navbar.css';

export default function Navbar() {
  return (
    <header className="masthead py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h3 className="masthead-brand m-0">Cover</h3>
        <nav>
            <div class="container-fluid d-flex justify-content-start">
              <a class="navbar-brand" href="#">
                <img src="./frontend/public/assets/snapstudy.svg" 
                alt="Logo" 
                width="30" 
                height="24" 
                class="d-inline-block align-text-top" />
              </a>
            </div>
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
