import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/pages/App.jsx';
import './src/styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter } from 'react-router-dom';

window.addEventListener('load', () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
});