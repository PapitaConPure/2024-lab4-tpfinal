import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './output.css';
import Home from './pages/Home';
import Canchas from './pages/Canchas';
import Reservas from './pages/Reservas';

const rootElem = document.getElementById('root');

if(!rootElem)
  throw new ReferenceError('Debe existir un elemento con id #root en el index.html de la app');

const root = ReactDOM.createRoot(rootElem);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/canchas/' element={<Canchas />} />
      <Route path='/reservas/' element={<Reservas />} />
    </Routes>
  </BrowserRouter>
);
