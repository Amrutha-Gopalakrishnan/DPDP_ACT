import chromadb
from sentence_transformers import SentenceTransformer
import os

VECTOR_DIR = "vector_store"
COLLECTION_NAME = "dpdp_act"

# Load model once
print("Loading search model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize client
client = chromadb.PersistentClient(path=VECTOR_DIR)

try:
    collection = client.get_collection(name=COLLECTION_NAME)
except Exception:
    print(f"Warning: Collection '{COLLECTION_NAME}' not found. Run index_dpdp.py first.")
    collection = None

def search(query, top_k=3):
    if collection is None:
        return []
        
    embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k
    )

    matches = []
    if results["documents"]:
        for i in range(len(results["documents"][0])):
            matches.append({
                "text": results["documents"][0][i],
                "section_id": results["metadatas"][0][i]["section_id"],
                "title": results["metadatas"][0][i]["title"],
                "chapter": results["metadatas"][0][i]["chapter"],
                "distance": results["distances"][0][i] if "distances" in results else None
            })

    return matches

if __name__ == "__main__":
    # Test query
    test_query = "Notice for processing personal data of children"
    print(f"Searching for: {test_query}")
    results = search(test_query)

    for r in results:
        print("\n---")
        print(f"Section {r['section_id']}: {r['title']}")
        print(f"Chapter {r['chapter']}")
        print(f"Text: {r['text'][:300]}...")
