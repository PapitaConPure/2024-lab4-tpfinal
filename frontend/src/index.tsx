import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './output.css';
import Dashboard from './pages/Dashboard';
import Canchas from './pages/Canchas';
import Reservas from './pages/Reservas';
import axios from 'axios';
import config from './config.json';
import ErrorReport from './pages/ErrorReport';
import DeleteConfirmation from './pages/DeleteConfirmation';

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
        <Route path='/' element={<Dashboard />} />
        <Route path='/canchas/' element={<Canchas />} />
        <Route path='/reservas/' element={<Reservas />} />
        <Route path='/confirm-delete/' element={<DeleteConfirmation />} />
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
