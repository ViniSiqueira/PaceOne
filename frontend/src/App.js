import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import PrivateRoute from './routes/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import DefaultLayout from './layouts/DefaultLayout';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ListClients from './pages/Clients/List/ListClients';
import CreateClient from './pages/Clients/Create/CreateClient';
import ListModality from './pages/Modality/List/ListModality';
import CreateModality from './pages/Modality/Create/CreateModality';
import Financeiro from './pages/Financial/Financeiro';
import ListTraining from './pages/Training/List/ListTraining';
import CreateTraining from './pages/Training/Create/CreateTraining';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute><DefaultLayout /></PrivateRoute>}>
            <Route path="/home" element={<Home />} />
            <Route path="/listClients" element={<ListClients />} />
            <Route path="/createClient" element={<CreateClient />} />
            <Route path="/listModality" element={<ListModality />} />            
            <Route path="/createModality" element={<CreateModality />} />
            <Route path="/listTraining" element={<ListTraining />} />
            <Route path="/createTraining" element={<CreateTraining />} />
            <Route path="/financial" element={<Financeiro />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
