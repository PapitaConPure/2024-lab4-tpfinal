import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './output.css';
import Home from './pages/Home';
import Canchas from './pages/Canchas';
import Reservas from './pages/Reservas';
import axios from 'axios';
import config from './config.json';
import ErrorReport from './pages/ErrorReport';

const rootElem = document.getElementById('root');

if(!rootElem)
  throw new ReferenceError('Debe existir un elemento con id #root en el index.html de la app');

const root = ReactDOM.createRoot(rootElem);

axios.get(`${config.BACKEND_API_URI}/`)
.then(response => {
  console.info(response.data);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/canchas/' element={<Canchas />} />
        <Route path='/reservas/' element={<Reservas />} />
      </Routes>
    </BrowserRouter>
  );
})
.catch(err =>{
  console.error(err);
  console.warn('Falló el saludo con el servidor backend. El servicio API puede no estar disponible');
  root.render(
    <ErrorReport error={err}/>
  );
});
