import React from 'react';

const DashboardPage = ({ onNavigate }) => {
    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h2>Compliance Dashboard</h2>
                <div className="text-muted">Monitor your DPDP Act 2023 compliance status and audit findings</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="flex-row justify-between mb-4">
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>📋</div>
                        <div className="text-sm text-muted">TOTAL</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>127</div>
                    <div className="text-sm text-muted">Findings Analyzed</div>
                </div>

                <div className="card">
                    <div className="flex-row justify-between mb-4">
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b91c1c' }}>⚠️</div>
                        <div className="text-sm text-muted">CRITICAL</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c' }}>34</div>
                    <div className="text-sm text-muted">Violations Detected</div>
                </div>

                <div className="card">
                    <div className="flex-row justify-between mb-4">
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>✅</div>
                        <div className="text-sm text-muted">PASSED</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d' }}>93</div>
                    <div className="text-sm text-muted">Compliant Controls</div>
                </div>

                <div className="card">
                    <div className="flex-row justify-between mb-4">
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c' }}>🛡️</div>
                        <div className="text-sm text-muted">PRIORITY</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c2410c' }}>12</div>
                    <div className="text-sm text-muted">High-Risk Sections</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h4>Compliance Status Overview</h4>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {/* Simulated Chart */}
                        <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'conic-gradient(#10b981 0% 73%, #ef4444 73% 100%)', position: 'relative' }}></div>
                        <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>73.2%</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '0.8rem' }}>
                            <span style={{ color: '#10b981' }}>■ Compliant</span> <span style={{ color: '#ef4444' }}>■ Violations</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h4>Risk Level Distribution</h4>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '20px' }}>
                        <div style={{ width: '60px', height: '60%', background: '#ef4444', borderTopLeftRadius: 4, borderTopRightRadius: 4, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -20, width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>12</div>
                            <div style={{ position: 'absolute', bottom: -25, width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>High</div>
                        </div>
                        <div style={{ width: '60px', height: '80%', background: '#f59e0b', borderTopLeftRadius: 4, borderTopRightRadius: 4, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -20, width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>15</div>
                            <div style={{ position: 'absolute', bottom: -25, width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>Medium</div>
                        </div>
                        <div style={{ width: '60px', height: '40%', background: '#10b981', borderTopLeftRadius: 4, borderTopRightRadius: 4, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -20, width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>8</div>
                            <div style={{ position: 'absolute', bottom: -25, width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>Low</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Analyze Your Compliance?</h2>
                <p style={{ opacity: 0.9, marginBottom: '2rem' }}>Upload your audit findings and get Instant DPDP Act mapping</p>
                <button
                    className="btn"
                    onClick={() => onNavigate('upload')}
                    style={{ background: 'white', color: '#1e3a8a', padding: '0.8rem 2rem', fontWeight: 'bold' }}
                >
                    🚀 Start Compliance Analysis
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
