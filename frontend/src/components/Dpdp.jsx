import React, { useState, useMemo } from 'react';
import dpdpData from '../data/sections.json';

const Dpdp = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);

    // Flatten chapters into a single sections list
    const allSections = useMemo(() => {
        return dpdpData.chapters.flatMap(chapter =>
            chapter.sections.map(section => ({
                ...section,
                chapter_number: chapter.chapter_number,
                chapter_title: chapter.chapter_title
            }))
        );
    }, []);

    const filteredSections = useMemo(() => {
        return allSections.filter(section =>
            section.section_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            section.section_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (section.content.intro && section.content.intro.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, allSections]);

    const getExplanationPreview = (content) => {
        if (!content) return '';
        let text = content.intro || '';
        if (!text && content.text) text = content.text;

        // If still empty, try to get first item from subsections or clauses
        if (!text) {
            if (content.subsections) {
                const firstKey = Object.keys(content.subsections)[0];
                text = content.subsections[firstKey].intro || content.subsections[firstKey].text || '';
            } else if (content.clauses) {
                const firstKey = Object.keys(content.clauses)[0];
                text = content.clauses[firstKey].intro || content.clauses[firstKey].text || '';
            }
        }

        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    };

    const renderHierarchical = (content, depth = 0) => {
        if (!content) return null;

        return (
            <div style={{ marginLeft: `${depth * 1.5}rem`, marginTop: '0.5rem' }}>
                {content.intro && <div style={{ marginBottom: '0.5rem', fontWeight: depth === 0 ? '500' : 'normal' }}>{content.intro}</div>}
                {content.text && <div style={{ marginBottom: '0.5rem' }}>{content.text}</div>}

                {content.subsections && Object.entries(content.subsections).map(([key, sub]) => (
                    <div key={key} style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>({key})</span>
                        {renderHierarchical(sub, depth + 1)}
                    </div>
                ))}

                {content.clauses && Object.entries(content.clauses).map(([key, clause]) => (
                    <div key={key} style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>({key})</span>
                        {renderHierarchical(clause, depth + 1)}
                    </div>
                ))}

                {content.subclauses && Object.entries(content.subclauses).map(([key, sub]) => (
                    <div key={key} style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>({key})</span>
                        {renderHierarchical(sub, depth + 1)}
                    </div>
                ))}

                {content.subsubclauses && Object.entries(content.subsubclauses).map(([key, sub]) => (
                    <div key={key} style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>({key})</span>
                        {renderHierarchical(sub, depth + 1)}
                    </div>
                ))}

                {content.illustrations && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderLeft: '4px solid #0066cc', borderRadius: '4px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#0066cc', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Illustrations</div>
                        {content.illustrations.map((ill, idx) => (
                            <div key={idx} style={{ fontStyle: 'italic', marginBottom: '0.5rem', fontSize: '0.9rem' }}>• {ill}</div>
                        ))}
                    </div>
                )}

                {content.explanations && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderLeft: '4px solid #64748b', borderRadius: '4px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Explanation</div>
                        {content.explanations.map((exp, idx) => (
                            <div key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{exp}</div>
                        ))}
                    </div>
                )}

                {content.provisos && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fffbeb', borderLeft: '4px solid #d97706', borderRadius: '4px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#d97706', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Proviso</div>
                        {content.provisos.map((prov, idx) => (
                            <div key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{prov}</div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>DPDP Act 2023 Library</h1>
                    <p className="text-muted">Browse and search the official sections of the Digital Personal Data Protection Act.</p>
                </div>
                <div style={{ width: '350px' }}>
                    <input
                        type="text"
                        placeholder="Search by section number, title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'white' }}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', width: '80px' }}>ID</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', width: '250px' }}>Section Title</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Explanation Preview</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right', width: '120px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSections.map((section, idx) => (
                            <tr
                                key={section.section_number}
                                style={{
                                    borderBottom: idx === filteredSections.length - 1 ? 'none' : '1px solid var(--border-light)',
                                    transition: 'background 0.2s',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedSection(section)}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--brand-primary)' }}>{section.section_number}</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{section.section_title}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    {getExplanationPreview(section.content)}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSections.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No sections found matching "{searchTerm}"
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSection && (
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
                }} onClick={() => setSelectedSection(null)}>
                    <div className="animate-fade-in" style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid var(--border-light)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        Section {selectedSection.section_number}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        Chapter {selectedSection.chapter_number}: {selectedSection.chapter_title}
                                    </span>
                                </div>
                                <h2 style={{ margin: 0 }}>{selectedSection.section_title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedSection(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >×</button>
                        </div>

                        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, lineHeight: '1.6' }}>
                            {renderHierarchical(selectedSection.content)}
                        </div>

                        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedSection(null)}>Close Library View</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dpdp;
