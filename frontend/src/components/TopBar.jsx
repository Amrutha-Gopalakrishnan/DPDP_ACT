import React from 'react';

const TopBar = () => {
    return (
        <header style={{
            height: '64px',
            background: 'white',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 2rem',
            gap: '1.5rem'
        }}>
            <div style={{ position: 'relative' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>🔔</span>
                <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: 'red', borderRadius: '50%' }}></span>
            </div>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>⚙️</span>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--brand-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}>
                AC
            </div>
        </header>
    );
};

export default TopBar;
