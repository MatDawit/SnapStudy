import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Archives from './Archives';
import Navbar from '../components/Navbar';
import UploadFile from './UploadFile';
import About from './About';
import '../styles/App.css';

export default function App() {
  return (
    <div className="cover-page d-flex flex-column min-vh-100 text-white text-center">

      {/* NavBar */}
      <Navbar />

      {/* Page Content */}
      <main className="cover-container container d-flex flex-column justify-content-center flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/uploadfile" element={<UploadFile />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mastfoot mt-auto py-3">
        <div className="container">
          <p>© 2025 Your Company</p>
        </div>
      </footer>
    </div>
  );
}

// Home page component
function HomePage() {
  return (
    <>
      <h1 className="cover-heading display-4">Cover your page.</h1>
      <p className="lead">
        Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.
      </p>
      <p className="lead">
        <a href="#" className="btn btn-lg btn-light">Learn more</a>
      </p>
    </>
  );
}
