function Alerts({ alerts = [] }) {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        🔔 Manipulation Audit Log
      </h2>

      <div className="glass-panel">
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <div className="threat-pulse" style={{ margin: '0 auto 1rem' }} />
            <p>Monitoring for manipulation events...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>#</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice().reverse().map((alert, idx) => {
                const type = alert.includes('TRAP') ? 'TRAP' : alert.includes('SPOOF') ? 'SPOOF' : 'ALERT';
                const color = type === 'TRAP' ? 'var(--threat-red)' : type === 'SPOOF' ? 'var(--threat-amber)' : 'var(--accent-color)';
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{alerts.length - idx}</td>
                    <td style={{ padding: '0.875rem 1rem', color, fontWeight: 700, fontSize: '0.8rem' }}>{type}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{alert}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Alerts;
