from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag import query_dpdp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    input: str

@app.post("/analyze")
def analyze(q: Query):
    mappings = query_dpdp(q.input)
    
    # Standardized response format (No AI branding)
    results = []
    for m in mappings:
        results.append({
            "finding": m["finding"],
            "section": m["section_number"],
            "title": m["section_title"],
            "chapter": m["chapter"],
            "description": m["description"]
        })
        
    return {
        "status": "success",
        "results": results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
