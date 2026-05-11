import React from 'react';

const LiquidityDNA = ({ status, trap: propTrap, spoof: propSpoof }) => {
  const trap = propTrap ?? status?.trap?.detected;
  const spoof = propSpoof ?? status?.spoof?.detected;

  let dnaState = {
    label: 'Accumulation',
    emoji: '🟢',
    message: 'Smart money is quietly accumulating',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.2)'
  };

  if (trap) {
    dnaState = {
      label: 'Manipulation',
      emoji: '⚠️',
      message: 'Market is actively hunting stop-losses',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.2)'
    };
  } else if (spoof) {
    dnaState = {
      label: 'Distribution',
      emoji: '🟡',
      message: 'There is artificial pressure — likely distribution phase',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.2)'
    };
  }

  return (
    <div className="glass-panel metric-card" style={{ 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: `0 0 20px ${dnaState.glow}`,
        transition: 'all 0.3s ease'
    }}>
      <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: '4rem',
          opacity: 0.1,
          animation: 'pulse 2s infinite'
      }}>
          🧬
      </div>
      
      <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Liquidity DNA 🧬
      </span>
      
      <div style={{ marginTop: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: dnaState.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {dnaState.emoji} {dnaState.label}
        </span>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {dnaState.message}
        </p>
      </div>
    </div>
  );
};

export default LiquidityDNA;
