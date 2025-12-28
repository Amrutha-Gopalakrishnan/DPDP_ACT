from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from search_dpdp import search
import uvicorn

app = FastAPI(title="DPDP Compliance Engine API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "online", "engine": "DPDP RAG v1.0"}

@app.get("/search")
def run_search(q: str = Query(..., min_length=3), top_k: int = 3):
    """
    Semantic search across the DPDP Act.
    Returns the most relevant sections/clauses based on the input query.
    """
    try:
        results = search(q, top_k=top_k)
        return {
            "query": q,
            "results": results
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
