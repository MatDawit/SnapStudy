// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/pages/App.jsx';
import './src/styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
