import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div className="cover-page d-flex flex-column min-vh-100 text-white text-center">

      {/* Header */}
      <header className="masthead py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h3 className="masthead-brand m-0">Cover</h3>
          <nav>
            <ul className="nav masthead-nav">
              <li className="nav-item">
                <a className="nav-link active text-white" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Centered Cover Content */}
      <main className="cover-container container d-flex flex-column justify-content-center flex-grow-1">
        <h1 className="cover-heading display-4">Cover your page.</h1>
        <p className="lead">
          Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.
        </p>
        <p className="lead">
          <a href="#" className="btn btn-lg btn-light">Learn more</a>
        </p>
      </main>

      {/* Optional Footer */}
      <footer className="mastfoot mt-auto py-3">
        <div className="container">
          <p>© 2025 Your Company</p>
        </div>
      </footer>

    </div>
  );
}
