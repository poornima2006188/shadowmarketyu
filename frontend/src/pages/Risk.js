import React, { useState, useMemo } from 'react';

// --- Risk Calculation Logic ---
function calcRisk(entryPrice, leverage, direction) {
  const lev = parseFloat(leverage);
  const entry = parseFloat(entryPrice);
  if (!lev || !entry || lev <= 0 || entry <= 0) return null;

  // Liquidation price formulas
  const liqPrice = direction === 'long'
    ? entry * (1 - 1 / lev)
    : entry * (1 + 1 / lev);

  // Distance to liquidation
  const distancePct = Math.abs((liqPrice - entry) / entry) * 100;

  // Risk level
  let riskLevel, riskColor, riskEmoji;
  if (lev <= 5) {
    riskLevel = 'LOW'; riskColor = '#10b981'; riskEmoji = '🟢';
  } else if (lev <= 10) {
    riskLevel = 'MEDIUM'; riskColor = '#f59e0b'; riskEmoji = '🟡';
  } else if (lev <= 20) {
    riskLevel = 'HIGH'; riskColor = '#ef4444'; riskEmoji = '🔴';
  } else {
    riskLevel = 'CRITICAL'; riskColor = '#ff00ff'; riskEmoji = '💀';
  }

  // Required margin per $1000 position
  const marginRequired = 1000 / lev;

  return { liqPrice, distancePct, riskLevel, riskColor, riskEmoji, marginRequired };
}

function Risk({ currentPrice }) {
  const [entry, setEntry] = useState(currentPrice > 0 ? currentPrice.toFixed(2) : '');
  const [leverage, setLeverage] = useState('');
  const [direction, setDirection] = useState('long');

  const result = useMemo(
    () => calcRisk(entry, leverage, direction),
    [entry, leverage, direction]
  );

  const leverageNum = parseFloat(leverage) || 0;
  const riskBarWidth = Math.min((leverageNum / 100) * 100, 100);

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>
          🛡️ Risk <span style={{ color: '#10b981' }}>Calculator</span>
        </h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Calculate your liquidation price and exposure risk before entering a position
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* --- INPUT PANEL --- */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 className="metric-label" style={{ margin: 0 }}>Position Setup</h3>

          {/* Direction Toggle */}
          <div>
            <div className="metric-label" style={{ marginBottom: '0.75rem' }}>Direction</div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['long', 'short'].map(dir => (
                <button
                  key={dir}
                  onClick={() => setDirection(dir)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: direction === dir
                      ? `1px solid ${dir === 'long' ? '#10b981' : '#ef4444'}`
                      : '1px solid rgba(255,255,255,0.08)',
                    background: direction === dir
                      ? dir === 'long' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'
                      : 'transparent',
                    color: direction === dir
                      ? dir === 'long' ? '#10b981' : '#ef4444'
                      : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                  }}
                >
                  {dir === 'long' ? '📈 LONG' : '📉 SHORT'}
                </button>
              ))}
            </div>
          </div>

          {/* Entry Price */}
          <div>
            <label className="metric-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
              Entry Price (USD)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                color: '#10b981', fontWeight: 700, fontSize: '1rem'
              }}>$</span>
              <input
                type="number"
                value={entry}
                onChange={e => setEntry(e.target.value)}
                placeholder={currentPrice > 0 ? currentPrice.toFixed(2) : 'e.g. 65000'}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.25rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={e => e.target.style.borderColor = '#10b981'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          {/* Leverage */}
          <div>
            <label className="metric-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
              Leverage — <span style={{ color: leverageNum > 20 ? '#ef4444' : leverageNum > 10 ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                {leverageNum > 0 ? `${leverageNum}x` : '--'}
              </span>
            </label>
            <input
              type="number"
              value={leverage}
              onChange={e => setLeverage(e.target.value)}
              placeholder="e.g. 10"
              min="1"
              max="125"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#f8fafc',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#10b981'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />

            {/* Leverage quick-select */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {[1, 2, 5, 10, 20, 50, 100].map(lev => (
                <button
                  key={lev}
                  onClick={() => setLeverage(String(lev))}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    border: leverage === String(lev) ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: leverage === String(lev) ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                    color: leverage === String(lev) ? '#10b981' : '#94a3b8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {lev}x
                </button>
              ))}
            </div>
          </div>

          {/* Risk Bar */}
          {leverageNum > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>SAFE</span>
                <span>EXTREME</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${riskBarWidth}%`,
                  background: `linear-gradient(90deg, #10b981, #f59e0b, #ef4444)`,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease',
                  boxShadow: result ? `0 0 8px ${result.riskColor}` : 'none',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* --- RESULTS PANEL --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {!result ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
              <p style={{ margin: 0 }}>Enter your entry price<br />and leverage to calculate risk</p>
            </div>
          ) : (
            <>
              {/* Risk Level Badge */}
              <div style={{
                padding: '2rem',
                borderRadius: '16px',
                background: `radial-gradient(circle at 50% 0%, ${result.riskColor}25, transparent 70%), rgba(17,24,39,0.7)`,
                border: `1px solid ${result.riskColor}40`,
                textAlign: 'center',
                backdropFilter: 'blur(12px)',
                boxShadow: `0 0 30px ${result.riskColor}20`,
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{result.riskEmoji}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: result.riskColor, letterSpacing: '0.1em' }}>
                  {result.riskLevel} RISK
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  {leverageNum}x leverage {direction.toUpperCase()} position
                </div>
              </div>

              {/* Liquidation Price */}
              <div className="glass-panel metric-card">
                <span className="metric-label">Liquidation Price</span>
                <span className="metric-value" style={{ color: result.riskColor }}>
                  ${result.liqPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {result.distancePct.toFixed(2)}% away from entry
                </span>
              </div>

              {/* Margin Required */}
              <div className="glass-panel metric-card">
                <span className="metric-label">Margin Required (per $1,000)</span>
                <span className="metric-value" style={{ fontSize: '1.5rem' }}>
                  ${result.marginRequired.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {((1 / leverageNum) * 100).toFixed(1)}% of position size
                </span>
              </div>

              {/* Warning for high leverage */}
              {leverageNum > 20 && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  fontSize: '0.85rem',
                  color: '#fca5a5',
                  lineHeight: 1.6,
                }}>
                  ⚠️ <strong>Extreme leverage detected.</strong> A {result.distancePct.toFixed(1)}% move against your position will cause full liquidation. This is especially dangerous in manipulated markets.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Risk;
