import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children, activeTab, onTabChange }) => {
    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
                <TopBar />
                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
