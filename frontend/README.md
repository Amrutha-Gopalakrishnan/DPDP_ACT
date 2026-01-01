# Auto-Compliance Mapper - Frontend

This is the React-based frontend for the DPDP Auto-Compliance Mapper.

## Features
- **Upload Page**: Extract text from Technical Audit PDFs and select from a checklist of common findings.
- **Results Page**: View semantic mappings from the Backend RAG engine, including risk levels and technical impact.
- **Report Page**: Preview and download a PDF compliance summary.
- **DPDP Library**: browse the full text of the DPDP Act 2023 with hierarchical navigation.

## Setup
```bash
npm install
npm run dev
```

## Environment
Ensure the backend is running at `http://localhost:8000` for the mapping features to work.