import json
import chromadb
import os
from sentence_transformers import SentenceTransformer
from utils.chunker import extract_chunks

DATA_PATH = os.path.join("..", "data", "processed", "sections.json")
VECTOR_DIR = "vector_store"
COLLECTION_NAME = "dpdp_act"

def main():
    print("Starting DPDP indexing")

    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found. Run the extraction scripts first.")
        return

    # Load DPDP sections
    with open(DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)

    # Pass the whole data object, chunker handles chapters/sections
    chunks = extract_chunks(data)
    print(f"Total chunks created: {len(chunks)}")

    # Load embedding model
    print("Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # Initialize vector DB (Modern PersistentClient)
    client = chromadb.PersistentClient(path=VECTOR_DIR)

    # Remove existing collection to re-index correctly
    try:
        client.delete_collection(name=COLLECTION_NAME)
    except:
        pass
        
    collection = client.create_collection(name=COLLECTION_NAME)

    # Embed and store chunks
    print("Indexing chunks into ChromaDB...")
    documents = [c["text"] for c in chunks]
    embeddings = model.encode(documents).tolist()
    metadatas = [{
        "section_id": c["section_id"],
        "title": c["title"],
        "chapter": c["chapter"]
    } for c in chunks]
    ids = [f"dpdp_{idx}" for idx in range(len(chunks))]

    # Batch add
    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    print("DPDP Act indexed successfully")
    print(f"Vector store saved at: {VECTOR_DIR}")

if __name__ == "__main__":
    main()
