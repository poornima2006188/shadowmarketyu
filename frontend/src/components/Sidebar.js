import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/replay', label: 'Replay', icon: '🕒' },
        { path: '/risk', label: 'Risk Calc', icon: '🛡️' },
        { path: '/intelligence', label: 'Market Mood', icon: '🧠' },
        { path: '/alerts', label: 'Alerts', icon: '🔔' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">X</div>
                <span className="logo-text">SHADOW</span>
            </div>
            
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="status-dot"></div>
                <span>NODE ONLINE</span>
            </div>
        </aside>
    );
};

export default Sidebar;
