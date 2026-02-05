import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';
import Register from './pages/Register';
import ClinicalTrials from './pages/ClinicalTrials';
import TrialDetail from './pages/TrialDetail';
import CellTherapy from './pages/CellTherapy';
import CellTherapyInterest from './pages/CellTherapyInterest';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clinical-trials" element={<ClinicalTrials />} />
          <Route path="/trial/:nctId" element={<TrialDetail />} />
          <Route path="/cell-therapy" element={<CellTherapy />} />
          <Route path="/cell-therapy-interest" element={<CellTherapyInterest />} />
          <Route path="/cell-therapy-interest/:nctId" element={<CellTherapyInterest />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
