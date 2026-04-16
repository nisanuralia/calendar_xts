// main.jsx - This should be your entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Make sure this points to your App.jsx
import './index.css'; // Optional

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);