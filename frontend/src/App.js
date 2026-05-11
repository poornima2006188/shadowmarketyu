import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePrivy } from '@privy-io/react-auth';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Replay from './pages/Replay';
import Risk from './pages/Risk';
import Intelligence from './pages/Intelligence';
import Alerts from './pages/Alerts';

import './App.css';

function App() {
  const { login, logout, authenticated, user } = usePrivy();
  const [alerts, setAlerts] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [status, setStatus] = useState({ trap: { detected: false }, spoof: { detected: false } });

  useEffect(() => {
    if (!authenticated) return;

    const fetchData = async () => {
      try {
        const [alertsRes, priceRes, statusRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/alerts'),
          axios.get('http://127.0.0.1:8000/price'),
          axios.get('http://127.0.0.1:8000/status')
        ]);
        setAlerts(alertsRes.data.alerts || []);
        const price = priceRes.data.price || 0;
        console.log('[DEBUG] /price response:', priceRes.data, '→ using price:', price);
        setCurrentPrice(price);
        setStatus(statusRes.data);
      } catch (error) {
        console.error('API Sync Error:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 800);
    return () => clearInterval(interval);
  }, [authenticated]);

  const getThreatLevel = () => {
    if (status?.trap?.detected && status?.spoof?.detected) return { label: 'CRITICAL', color: '#ef4444' };
    if (status?.trap?.detected || status?.spoof?.detected) return { label: 'HIGH', color: '#f59e0b' };
    return { label: 'LOW', color: '#10b981' };
  };

  const threat = getThreatLevel();

  // --- Login Screen ---
  if (!authenticated) {
    return (
      <div className="login-screen">
        <div className="glass-panel login-card">
          <h2 className="login-title">
            SHADOW MARKET <span className="accent">X</span>
          </h2>
          <p className="login-subtitle">
            Identity-verified monitoring node. <br /> Authenticate to establish connection.
          </p>
          <button onClick={login} className="login-button">
            Authenticate with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Navbar
        user={user}
        logout={logout}
        currentPrice={currentPrice}
        threat={threat}
      />
      <Routes>
        <Route path="/" element={<Dashboard currentPrice={currentPrice} alerts={alerts} status={status} />} />
        <Route path="/replay" element={<Replay />} />
        <Route path="/risk" element={<Risk currentPrice={currentPrice} />} />
        <Route path="/intelligence" element={<Intelligence status={status} currentPrice={currentPrice} alerts={alerts} />} />
        <Route path="/alerts" element={<Alerts alerts={alerts} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
