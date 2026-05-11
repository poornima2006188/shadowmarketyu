import React, { useEffect, useState } from 'react';
import LiquidityDNA from "../components/LiquidityDNA";
import ConfidenceMeter from "../components/ConfidenceMeter";
import DataSource from "../components/DataSource";

// Derive mood from backend signals
function getMood(status) {
  const trap = status?.trap?.detected;
  const spoof = status?.spoof?.detected;

  if (trap && spoof) return {
    label: 'CRITICAL MANIPULATION',
    emoji: '🚨',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.3)',
    description: 'Both trap and spoofing patterns detected simultaneously. High-risk market conditions.',
    severity: 3,
  };
  if (trap) return {
    label: 'MANIPULATION DETECTED',
    emoji: '⚠️',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.2)',
    description: 'A bull or bear trap has been identified. Price reversal likely engineered.',
    severity: 2,
  };
  if (spoof) return {
    label: 'FAKE PRESSURE',
    emoji: '🟡',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.2)',
    description: 'Spoofed orders detected in the order book. Volume is artificially inflated.',
    severity: 1,
  };
  return {
    label: 'STABLE MARKET',
    emoji: '🟢',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.2)',
    description: 'No manipulation patterns detected. Market depth appears genuine.',
    severity: 0,
  };
}

function Intelligence({ status, currentPrice, alerts = [] }) {
  const mood = getMood(status);
  const [history, setHistory] = useState([]);
  const [tick, setTick] = useState(0);

  // Keep a rolling history of mood changes
  useEffect(() => {
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (!last || last.label !== mood.label) {
        const entry = {
          ...mood,
          time: new Date().toLocaleTimeString(),
          price: currentPrice,
        };
        return [...prev.slice(-19), entry]; // keep last 20
      }
      return prev;
    });
    setTick(t => t + 1);
  }, [status, mood.label]);

  const trapCount = alerts.filter(a => a.includes('TRAP')).length;
  const spoofCount = alerts.filter(a => a.includes('SPOOF')).length;

  // Derive an AI Confidence score based on signal strength/severity
  const confidence = React.useMemo(() => {
    if (mood.severity === 3) return 99;
    if (mood.severity === 2) return 85;
    if (mood.severity === 1) return 72;
    return 65;
  }, [mood.severity]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>
          🧠 Market Mood <span style={{ color: '#10b981' }}>AI</span>
        </h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Real-time market sentiment derived from Pacifica API signals
        </p>
      </div>

      {/* Main Mood Card */}
      <div style={{
        background: `radial-gradient(circle at 50% 0%, ${mood.glow}, transparent 70%), rgba(17,24,39,0.7)`,
        border: `1px solid ${mood.color}40`,
        borderRadius: '24px',
        padding: '3rem',
        textAlign: 'center',
        marginBottom: '2rem',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 60px ${mood.glow}`,
        transition: 'all 0.5s ease',
      }}>
        {/* Animated Emoji */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '1.5rem',
          animation: 'moodPulse 2s ease-in-out infinite',
          display: 'inline-block',
        }}>
          {mood.emoji}
        </div>

        <div style={{
          fontSize: '2rem',
          fontWeight: 900,
          color: mood.color,
          letterSpacing: '0.05em',
          textShadow: `0 0 30px ${mood.color}`,
          marginBottom: '1rem',
        }}>
          {mood.label}
        </div>

        <p style={{
          color: '#94a3b8',
          fontSize: '1rem',
          maxWidth: '480px',
          margin: '0 auto 2rem',
          lineHeight: 1.6,
        }}>
          {mood.description}
        </p>

        {/* Severity bar */}
        <div style={{ maxWidth: '360px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>STABLE</span>
            <span>CRITICAL</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(mood.severity / 3) * 100}%`,
              background: `linear-gradient(90deg, #10b981, ${mood.color})`,
              borderRadius: '4px',
              transition: 'width 0.6s ease',
              boxShadow: `0 0 10px ${mood.color}`,
            }} />
          </div>
        </div>

        {/* --- ADD NEW COMPONENTS HERE --- */}
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
           <LiquidityDNA 
             trap={status?.trap?.detected} 
             spoof={status?.spoof?.detected} 
           />
           <ConfidenceMeter value={confidence} />
        </div>
      </div>

      {/* Signal Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>

        <div className="glass-panel metric-card">
          <span className="metric-label">Trap Events (Session)</span>
          <span className="metric-value" style={{ color: '#ef4444', fontSize: '2rem' }}>{trapCount}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {status?.trap?.zone ? `Zone: ${JSON.stringify(status.trap.zone)}` : 'No active trap zone'}
          </span>
        </div>

        <div className="glass-panel metric-card">
          <span className="metric-label">Spoof Events (Session)</span>
          <span className="metric-value" style={{ color: '#f59e0b', fontSize: '2rem' }}>{spoofCount}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {status?.spoof?.level ? `Level: $${status.spoof.level}` : 'No active spoof level'}
          </span>
        </div>

        <div className="glass-panel metric-card">
          <span className="metric-label">Live BTC Price</span>
          <span className="metric-value" style={{ fontSize: '1.5rem' }}>
            ${(currentPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>via Pacifica API</span>
        </div>

      </div>

      {/* Mood History Log */}
      <div className="glass-panel">
        <h3 className="metric-label" style={{ marginBottom: '1rem' }}>Mood History</h3>
        {history.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Waiting for first signal...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.slice().reverse().map((entry, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${entry.color}30`,
                animation: i === 0 ? 'slideIn 0.4s ease-out' : 'none',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{entry.emoji}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, color: entry.color, fontSize: '0.85rem' }}>{entry.label}</span>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  ${(entry.price || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span style={{ color: '#475569', fontSize: '0.75rem' }}>{entry.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes moodPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>

      {/* Pacifica Data Source Panel */}
      <DataSource />

    </div>
  );
}

export default Intelligence;
