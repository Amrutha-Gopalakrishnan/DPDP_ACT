import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReportPage = ({ data }) => {
    if (!data) return <div className="text-center p-8">No assessment data available to generate a report.</div>;

    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDownloadPDF = async () => {
        const element = document.getElementById('report-content');
        if (!element) return;

        setIsDownloading(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 1.5, // Slightly lower scale to prevent memory issues on large docs
                useCORS: true,
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if needed
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('DPDP_Compliance_Report.pdf');
        } catch (err) {
            console.error("PDF Export failed", err);
            alert("Failed to generate report. If the report is very large, try analyzing fewer findings at once.");
        } finally {
            setIsDownloading(false);
        }
    };

    const downloadButtonText = isDownloading ? "⌛ Preparing PDF..." : "⬇ Download Assessment PDF";

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h2>Technical Assessment Report</h2>
                <div className="text-muted">Consolidated summary of findings and DPDP Act 2023 compliance mapping</div>
            </div>

            <div id="report-content" style={{ background: '#f5f7fa', padding: '15px', borderRadius: '12px' }}>
                <div className="card mb-4" style={{ borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <h3>Compliance Mapping Summary</h3>
                            <div className="text-sm text-muted">Technical Audit for DPDP Act 2023</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="text-sm text-muted">Compliance Readiness</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: data.score > 70 ? '#16a34a' : '#ea580c' }}>{data.score}%</div>
                        </div>
                    </div>
                    <div style={{ height: '8px', width: '100%', background: '#e1e4e8', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${data.score}%`, background: data.score > 70 ? '#16a34a' : '#ea580c', transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
                        <div style={{ padding: '10px', background: '#fee2e2', borderRadius: '8px', color: '#b91c1c' }}>⚠️</div>
                        <div>
                            <div className="text-muted text-xs">Total Issues</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{data.violations}</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
                        <div style={{ padding: '10px', background: '#dbeafe', borderRadius: '8px', color: '#1d4ed8' }}>📋</div>
                        <div>
                            <div className="text-muted text-xs">Sections Affected</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{data.violations}</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
                        <div style={{ padding: '10px', background: '#ffedd5', borderRadius: '8px', color: '#c2410c' }}>🔥</div>
                        <div>
                            <div className="text-muted text-xs">High Priority</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{data.details.filter(d => d.risk === 'High').length}</div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4" style={{ borderRadius: '12px' }}>
                    <h4 className="mb-4">Compliance Gaps & Detailed Mapping</h4>
                    {data.details.map((item, idx) => (
                        <div key={idx} style={{ padding: '1.5rem', borderBottom: idx === data.details.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
                                    {item.section?.number}: {item.section?.title}
                                </span>
                                <span className={`badge badge-${item.risk}`}>{item.risk} Priority</span>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Technical Observation</div>
                                <div style={{ fontSize: '14px', background: '#fff', borderLeft: '3px solid #cbd5e1', padding: '10px 14px', borderRadius: '0 4px 4px 0', color: '#334155' }}>
                                    {item.finding}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Mapping Rationale</div>
                                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{item.mapping_rationale}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Technical Impact</div>
                                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{item.technical_impact}</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Statutory Requirement Description</div>
                                <div style={{ fontSize: '12px', color: '#1e293b', background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
                                    {item.relevant_text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card mb-4" style={{ borderRadius: '12px' }}>
                    <h4 className="mb-4">Remediation Roadmap</h4>
                    {data.details.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>
                                {idx + 1}
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{item.recommendation}</div>
                                <div className="text-xs text-muted" style={{ marginTop: '3px' }}>Reference: {item.section?.number}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={handleDownloadPDF}
                    style={{ padding: '10px 25px' }}
                    disabled={isDownloading}
                >
                    {downloadButtonText}
                </button>
            </div>
        </div>
    );
};

export default ReportPage;
