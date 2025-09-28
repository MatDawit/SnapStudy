import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-2">
      <div className="container-fluid">
        {/* Logo + Brand */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/assets/snapstudy.svg"
            alt="SnapStudy Logo"
            style={{ height: '50px', marginRight: '8px' }}
          />
          <span className="text-white fs-5">SnapStudy</span>
        </NavLink>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Nav Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            {['/', '/uploadfile', '/archives', '/flashcards', '/about'].map((path, idx) => {
              const labels = ['Home', 'Upload Files', 'Archives', 'Flashcards', 'About'];
              return (
                <li className="nav-item" key={idx}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? 'active fw-bold' : ''}`
                    }
                  >
                    {labels[idx]}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

  // return (
  //   <nav className="navbar navbar-expand-lg bg-transparent py-3">
  //     <div className="container-fluid d-flex justify-content-between align-items-center" style={{ height: '60px' }}>
    
  //     {/* Logo + Brand on left */}
  //     <a className="navbar-brand d-flex align-items-center" href="#">
  //       <img
  //         src="./public/assets/snapstudy.svg"
  //         alt="SnapStudy Logo"
  //         //className="d-inline-block logo-img"
  //         style={{ height: '140px', marginRight: '-35px', marginLeft: '-30px'}} // small space
  //       />
  //       <span className="text-white fs-4">SnapStudy</span>
  //       {/* <span className="glowy-text">SnapStudy</span> */}
  //     </a>

  //       <nav>
  //         <ul className="navbar-nav ms-auto">
  //           <li className="nav-item">
  //             <NavLink
  //               to="/"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Home
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/uploadfile"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Upload Files
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/archives"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Archives
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/flashcards"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Flashcards
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/about"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               About
  //             </NavLink>
  //           </li>
  //         </ul>
  //       </nav>
  //     </div>
  //   </nav>
  // );



  // return (
  //   <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-3">
  //     <div className="container-fluid" style={{ height: '60px' }}>
    
  //     {/* Logo + Brand on left */}
  //     <a className="navbar-brand d-flex align-items-center" href="#">
  //       <img
  //         src="./public/assets/snapstudy.svg"
  //         alt="SnapStudy Logo"
  //         //className="d-inline-block logo-img"
  //         style={{ height: '140px', marginRight: '-35px', marginLeft: '-30px'}} // small space
  //       />
  //       <span className="text-white fs-4">SnapStudy</span>
  //       {/* <span className="glowy-text">SnapStudy</span> */}
  //     </a>

  //     {/* Hamburger button for mobile */}
  //     <button
  //     className="navbar-toggler"
  //     type="button"
  //     data-bs-toggle="collapse"
  //     data-bs-target="#navbarNav"
  //     aria-controls="navbarNav"
  //     aria-expanded="false"
  //     aria-label="Toggle navigation"
  //     >
  //     <span className="navbar-toggler-icon"></span>
  //     </button>

  //       <div className="collapse navbar-collapse mt-0" id="navbarNav">
  //         <ul className="navbar-nav ms-auto flex-lg-row text-lg-start flex-column text-end custom-mobile-menu">
  //           <li className="nav-item">
  //             <NavLink
  //               to="/"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Home
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/uploadfile"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Upload Files
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/archives"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Archives
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/flashcards"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Flashcards
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/about"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               About
  //             </NavLink>
  //           </li>
  //         </ul>
  //       </div>
  //     </div>
  //   </nav>
  // );

  //   return (
  //   <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-3">
  //     <div className="container-fluid" style={{ height: '60px' }}>
    
  //     {/* Logo + Brand on left */}
  //     <a className="navbar-brand d-flex align-items-center" href="#">
  //       <img
  //         src="./public/assets/snapstudy.svg"
  //         alt="SnapStudy Logo"
  //         //className="d-inline-block logo-img"
  //         style={{ height: '140px', marginRight: '-35px', marginLeft: '-30px'}} // small space
  //       />
  //       <span className="text-white fs-4">SnapStudy</span>
  //       {/* <span className="glowy-text">SnapStudy</span> */}
  //     </a>

  //     {/* Hamburger button for mobile */}
  //     <button
  //     className="navbar-toggler"
  //     type="button"
  //     data-bs-toggle="collapse"
  //     data-bs-target="#navbarNavSupportedContent"
  //     aria-controls="navbarNavSupportedContent"
  //     aria-expanded="false"
  //     aria-label="Toggle navigation"
  //     >
  //       <span className="navbar-toggler-icon"></span>
  //     </button>

  //       <div className="collapse navbar-collapse mt-0" id="navbarSupportedContent">
  //         <ul className="navbar-nav ms-auto flex-lg-row text-lg-start flex-column text-end custom-mobile-menu">
  //           <li className="nav-item">
  //             <NavLink
  //               to="/"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Home
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/uploadfile"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Upload Files
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/archives"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Archives
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/flashcards"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               Flashcards
  //             </NavLink>
  //           </li>
  //           <li className="nav-item">
  //             <NavLink
  //               to="/about"
  //               className={({ isActive }) =>
  //                 `nav-link text-white ${isActive ? 'active' : ''}`
  //               }
  //             >
  //               About
  //             </NavLink>
  //           </li>
  //         </ul>
  //       </div>
  //     </div>
  //   </nav>
  // );
