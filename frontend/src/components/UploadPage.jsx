import React, { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { analyzeCompliance } from "../api";
import { transformMappings } from "../utils/complianceEngine";
import { PREDEFINED_FINDINGS } from "../data/dpdpData";

// PDF.js Worker Configuration
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const UploadPage = ({ onAnalyze }) => {
    const [selectedFindings, setSelectedFindings] = useState([]);
    const [manualIssue, setManualIssue] = useState("");
    const [extractedText, setExtractedText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const fileInputRef = useRef(null);

    const toggleFinding = (finding) => {
        setSelectedFindings((prev) =>
            prev.includes(finding)
                ? prev.filter((f) => f !== finding)
                : [...prev, finding]
        );
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }

        setIsProcessing(true);
        setUploadStatus("uploading");

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let text = "";
            const maxPages = Math.min(pdf.numPages, 10); // Check up to 10 pages

            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map((item) => item.str).join(" ") + "\n";
            }

            setExtractedText(text);
            setUploadStatus("success");
        } catch (err) {
            console.error("PDF Parsing Error:", err);
            setUploadStatus("error");
            alert("Could not parse PDF document.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRunAnalysis = async () => {
        const combinedInput = (extractedText + " " + selectedFindings.join(". ") + " " + manualIssue).trim();

        if (!combinedInput) {
            alert("Please provide input for compliance mapping.");
            return;
        }

        setIsProcessing(true);
        try {
            const response = await analyzeCompliance(combinedInput);

            if (response.status === "success" && response.results) {
                // Transform granular mappings into report data
                const structuredData = transformMappings(response.results);

                if (onAnalyze) {
                    onAnalyze(structuredData);
                }
            } else {
                throw new Error("Invalid response from mapping engine.");
            }
        } catch (err) {
            console.error("Analysis Error:", err);
            alert("Error connecting to the compliance engine. Ensure the backend is running.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h2>Compliance Mapping Engine</h2>
                <div className="text-muted">
                    Submit audit findings to identify corresponding DPDP Act 2023 sections
                </div>
            </div>

            {/* Upload Area */}
            <div
                className="card mb-4"
                style={{
                    padding: "3rem",
                    textAlign: "center",
                    border: "2px dashed var(--border-light)",
                    cursor: "pointer",
                    background: uploadStatus === "success" ? "#f0fdf4" : "white",
                    borderRadius: '12px'
                }}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    accept=".pdf"
                />

                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    {isProcessing && uploadStatus === 'uploading' ? "⏳" : uploadStatus === "success" ? "📄" : "☁️"}
                </div>

                <h3>
                    {isProcessing && uploadStatus === 'uploading'
                        ? "Processing Document..."
                        : uploadStatus === "success"
                            ? "Document Ready"
                            : "Click to upload Technical Audit PDF"}
                </h3>
                {extractedText && (
                    <div className="text-muted text-sm mt-3">
                        PDF Context Loaded ( {extractedText.split(/\s+/).length} words )
                    </div>
                )}
            </div>

            {/* Manual Entry */}
            <div className="card mb-4" style={{ borderRadius: '12px' }}>
                <h4 className="mb-2">Manual Technical Findings</h4>
                <textarea
                    rows={4}
                    value={manualIssue}
                    onChange={(e) => setManualIssue(e.target.value)}
                    placeholder="Describe technical observations (one per line)..."
                    style={{
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border-light)",
                        fontFamily: 'inherit',
                        fontSize: '14px'
                    }}
                />
            </div>

            {/* Selection Grid */}
            <div className="card mb-4" style={{ borderRadius: '12px' }}>
                <h4 className="mb-4">Technical Finding Checklist</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {PREDEFINED_FINDINGS.map((finding, idx) => (
                        <div
                            key={idx}
                            onClick={() => toggleFinding(finding)}
                            style={{
                                padding: "0.85rem",
                                border: selectedFindings.includes(finding)
                                    ? "1px solid var(--brand-primary)"
                                    : "1px solid var(--border-light)",
                                background: selectedFindings.includes(finding)
                                    ? "var(--brand-light)"
                                    : "white",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedFindings.includes(finding)}
                                readOnly
                            />
                            <span className="text-sm">{finding}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: '2rem' }}>
                <button
                    className="btn btn-outline"
                    onClick={() => {
                        setSelectedFindings([]);
                        setManualIssue("");
                        setExtractedText("");
                        setUploadStatus(null);
                    }}
                >
                    Clear Form
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleRunAnalysis}
                    disabled={isProcessing}
                    style={{ padding: '0.75rem 2.5rem' }}
                >
                    {isProcessing ? 'Processing...' : 'Run Compliance Mapping'}
                </button>
            </div>
        </div>
    );
};

export default UploadPage;
