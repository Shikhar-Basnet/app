import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the use of 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; // Import your App component
import './index.css';

// Create the root element and render the app
const root = ReactDOM.createRoot(document.getElementById('root')); // Create root
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
