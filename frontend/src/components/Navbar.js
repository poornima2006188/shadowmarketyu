import { NavLink } from "react-router-dom";

function Navbar({ user, logout, currentPrice, threat }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 2rem',
      background: 'rgba(3, 7, 18, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
            SHADOW MARKET <span style={{ color: '#10b981' }}>X</span>
          </span>
          <span style={{ fontSize: '0.6rem', color: '#00d2d3', letterSpacing: '0.08em', fontWeight: 600, opacity: 0.85 }}>
            Powered by Pacifica ⚡
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[
            { to: '/', label: '📊 Dashboard' },
            { to: '/replay', label: '🎬 Replay' },
            { to: '/risk', label: '🛡️ Risk' },
            { to: '/intelligence', label: '🧠 Intelligence' },
            { to: '/alerts', label: '🔔 Alerts' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isActive ? '#10b981' : '#94a3b8',
                background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right: Price + Threat + User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

        {/* Live Price */}
        <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
          BTC ${(currentPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Threat Badge */}
        {threat && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3rem 0.75rem', borderRadius: '8px',
            background: 'rgba(17,24,39,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.7rem', fontWeight: 700, color: threat.color
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: threat.color,
              boxShadow: `0 0 6px ${threat.color}`,
              animation: 'pulse 2s infinite'
            }} />
            {threat.label}
          </div>
        )}

        {/* Operator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {user?.google?.email || user?.email?.address || 'Operator'}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '0.3rem 0.75rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
