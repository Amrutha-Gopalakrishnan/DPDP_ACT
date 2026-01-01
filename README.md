# Auto-Compliance Mapper: DPDP Act 2023 MVP

## Project Overview
The **Auto-Compliance Mapper** is a specialized GRC (Governance, Risk, and Compliance) tool designed to map technical security findings and organizational documentation directly to the **Digital Personal Data Protection (DPDP) Act, 2023**.

The MVP provides an offline, AI-powered semantic search engine that identifies specific legal sections and clauses based on technical observations (e.g., "Lack of encryption", "No consent withdrawal"), helping organizations bridge the gap between technical reality and legal requirements.

---

## 🚀 MVP Features (Current Status)

We have successfully integrated the backend search engine with the frontend UI.

### ✅ Completed Components:
1.  **AI Mapping Engine (Backend)**: 
    - **Local RAG Implementation**: Uses ChromaDB and Sentence-Transformers to perform semantic search across the DPDP Act.
    - **API Layer**: FastAPI/Flask endpoints (`/analyze`) that take technical findings and return relevant legal sections with rationale.
2.  **Compliance Dashboard (Frontend)**:
    - **Interactive Checklist**: Predefined common technical findings associated with DPDP violations.
    - **PDF Context Analysis**: Extracts text from technical audit PDFs using PDF.js to provide context for mapping.
    - **Results Viewer**: Displays mapped sections, risk levels (High/Medium), and technical impact summaries.
3.  **DPDP Act Library**:
    - **Live Search**: Real-time hierarchical search across all Chapters and Sections.
    - **Granular Data**: Structured JSON capturing subsections, clauses, illustrations, and provisos.
4.  **Reporting**:
    - **PDF Generation**: Export compliance mapping results into a professional PDF report.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, PDF.js, jsPDF.
- **Backend**: Python (FastAPI/Flask), ChromaDB, Sentence-Transformers (`all-MiniLM-L6-v2`).
- **Data Pipeline**: Python scripts for PDF hierarchical parsing.

---

## 📋 Project Structure

```text
DPDP/
├── data/
│   ├── raw/                # Official DPDP Act PDF
│   └── processed/          # Hierarchical JSON (Brain of the system)
├── backend/
│   ├── app.py              # Flask Backend with RAG logic
│   ├── rag.py              # ChromaDB retrieval logic
│   └── vector_store/       # Local vector database
├── Auto-Compliance Mapper/
│   ├── src/
│   │   ├── components/     # Upload, Dashboard, Results, Dpdp UI
│   │   ├── data/           # dpdpData predefined findings
│   │   └── utils/          # Transformation & Mapping logic
│   └── package.json        # Frontend dependencies
├── scripts/                # Data extraction & parsing scripts
└── README.md               # Main Documentation
```

---

## ⚙️ How to Run

### 1. Start the Backend
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1
# Install dependencies
pip install -r ../requirements.txt
# Run the API
python app.py 
```

### 2. Start the Frontend
```bash
cd "Auto-Compliance Mapper"
npm install
npm run dev
```

---

## 🔒 Security & Privacy
- **100% Offline**: All processing occurs locally. No data is sent to external APIs or cloud services.
- **Local Vectors**: The embeddings and vector database stay on the user's machine.
