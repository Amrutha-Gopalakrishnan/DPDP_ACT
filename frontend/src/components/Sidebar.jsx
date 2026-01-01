import React from 'react';

const Sidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'upload', label: 'Upload & Analyze', icon: '📤' },
        { id: 'results', label: 'Mapping Results', icon: '📝' },
        { id: 'report', label: 'Compliance Report', icon: '📊' },
        { id: 'dpdp', label: 'DPDP Acts Library', icon: '📚' }
    ];

    const resourceItems = [
        { label: 'Training Modules', icon: '🎓' },
        { label: 'Support', icon: '🎧' },
    ];

    return (
        <aside style={{
            width: '260px',
            background: 'white',
            borderRight: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', color: 'var(--brand-primary)', fontSize: '1.1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                    Auto-Compliance Mapper
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '2.5rem' }}>DPDP Act 2023 Advisory</div>
            </div>

            <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '6px',
                            marginBottom: '0.5rem',
                            cursor: 'pointer',
                            background: activeTab === item.id ? 'var(--brand-primary)' : 'transparent',
                            color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                            fontWeight: activeTab === item.id ? '500' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}

                <div style={{ marginTop: '2rem', marginBottom: '1rem', paddingLeft: '1rem', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.05em' }}>
                    RESOURCES
                </div>

                {resourceItems.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.6rem 1rem',
                            borderRadius: '6px',
                            marginBottom: '0.25rem',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <span style={{ opacity: 0.7 }}>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                v1.0.0 Prototype
            </div>
        </aside>
    );
};

export default Sidebar;
