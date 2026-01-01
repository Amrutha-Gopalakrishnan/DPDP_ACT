import React, { useState } from 'react';

const ResultsPage = ({ data }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    if (!data) return <div className="text-center p-8">No analysis data available. Please run a mapping first.</div>;

    const closeModal = () => setSelectedItem(null);

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h2>Compliance Mapping Results</h2>
                <div className="text-muted">Technical findings mapped to corresponding DPDP Act 2023 requirements</div>
            </div>

            {/* Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1rem' }}>
                    <div className="text-sm text-muted mb-2">IDENTIFIED FINDINGS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{data.totalFindings}</div>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <div className="text-sm text-muted mb-2">VIOLATIONS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc2626' }}>{data.violations}</div>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <div className="text-sm text-muted mb-2">REQUIRED CONTROLS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>{data.violations}</div>
                </div>
                <div className="card" style={{ padding: '1rem' }}>
                    <div className="text-sm text-muted mb-2">CRITICAL MAPPINGS</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ea580c' }}>
                        {data.details.filter(d => d.risk === 'High' || d.risk === 'Critical').length}
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>TECHNICAL FINDING</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>RELEVANT DPDP SECTION</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>STATUS</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>PRIORITY</th>
                            <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.details.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '1rem', width: '35%' }}>
                                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.finding}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {item.section ? (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                                <span style={{ color: 'var(--brand-primary)' }}>🛡️</span> {item.section.number}
                                            </div>
                                            <div className="text-xs text-muted" style={{ fontWeight: '600', marginBottom: '4px' }}>{item.section.chapter}</div>
                                            <div className="text-sm text-muted">{item.section.title}</div>
                                        </div>
                                    ) : <span>-</span>}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge badge-${item.status === 'Non-Compliant' ? 'High' : 'Compliant'}`}>
                                        {item.status === 'Non-Compliant' ? 'Non-Compliant' : 'Compliant'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge badge-${item.risk}`}>{item.risk === 'High' ? 'High' : 'Medium'}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--brand-primary)',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                    >
                                        View Requirement →
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.totalFindings === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No findings identified.</div>
                )}
            </div>

            {/* Requirement Detail Modal */}
            {selectedItem && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }} onClick={closeModal}>
                    <div style={{
                        background: 'white',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        borderRadius: '16px',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        position: 'relative',
                        padding: '2.5rem'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: '#f1f5f9',
                                border: 'none',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                fontWeight: 'bold'
                            }}
                        >×</button>

                        <div className="mb-6">
                            <h2 style={{ marginBottom: '0.5rem' }}>Requirement Insight</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className={`badge badge-${selectedItem.risk}`}>{selectedItem.risk} Priority</span>
                                <span className="text-muted text-sm">{selectedItem.section.number}: {selectedItem.section.title}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <section>
                                <h4 style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Technical Observation</h4>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #cbd5e1', fontStyle: 'italic' }}>
                                    "{selectedItem.finding}"
                                </div>
                            </section>

                            <section>
                                <h4 style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Mapping Rationale</h4>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#1e293b' }}>
                                    {selectedItem.mapping_rationale}
                                </p>
                            </section>

                            <section>
                                <h4 style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Technical Impact</h4>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#1e293b' }}>
                                    {selectedItem.technical_impact}
                                </p>
                            </section>

                            <section>
                                <h4 style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Statutory Requirement Description</h4>
                                <div style={{
                                    padding: '1.25rem',
                                    background: '#fff7ed',
                                    borderRadius: '8px',
                                    border: '1px solid #ffedd5',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6',
                                    color: '#9a3412'
                                }}>
                                    {selectedItem.relevant_text}
                                </div>
                            </section>
                        </div>

                        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={closeModal}>Close Details</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
