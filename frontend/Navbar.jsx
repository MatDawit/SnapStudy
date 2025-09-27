
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Optional extra CSS for underline effect

export default function Navbar() {
  return (
    <header className="masthead py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h3 className="masthead-brand m-0">Cover</h3>
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
