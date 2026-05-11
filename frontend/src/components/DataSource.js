import React, { useState, useEffect } from 'react';

function DataSource() {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0, 210, 211, 0.05), rgba(0, 210, 211, 0.02))',
      border: '1px solid rgba(0, 210, 211, 0.2)',
      padding: '14px 18px',
      borderRadius: '12px',
      marginTop: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Left side: source info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: '#00d2d3',
          boxShadow: pulse ? '0 0 10px #00d2d3' : '0 0 3px #00d2d3',
          transition: 'box-shadow 0.6s ease',
          flexShrink: 0,
          display: 'inline-block'
        }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Data Source
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00d2d3' }}>
            ⚡ Pacifica API — Live Market Data
          </div>
        </div>
      </div>

      {/* Right side: mode + testnet button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          padding: '4px 10px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          fontSize: '0.72rem',
          color: '#10b981',
          fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          TESTNET LIVE
        </span>
        <button
          onClick={() => window.open('https://test-app.pacifica.fi/', '_blank')}
          style={{
            padding: '5px 14px',
            background: 'rgba(0, 210, 211, 0.1)',
            border: '1px solid rgba(0, 210, 211, 0.35)',
            borderRadius: '8px',
            color: '#00d2d3',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.03em'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,210,211,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,210,211,0.1)'; }}
        >
          Open Pacifica Testnet ↗
        </button>
      </div>
    </div>
  );
}

export default DataSource;
