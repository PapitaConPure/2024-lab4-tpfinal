import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './output.css';
import Home from './pages/Home';
import Canchas from './pages/Canchas';
import Reservas from './pages/Reservas';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/canchas/' element={<Canchas />} />
      <Route path='/reservas/' element={<Reservas />} />
    </Routes>
  </BrowserRouter>
);
