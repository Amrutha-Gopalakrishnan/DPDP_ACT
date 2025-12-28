import json
import numpy as np
import os
import re
from sentence_transformers import SentenceTransformer

# Load Model (Offline)
print("Loading compliance mapping model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "data", "processed", "sections.json"))

with open(DATA_PATH, encoding="utf-8") as f:
    dpdp_data = json.load(f)

documents = []
metadata = []

def extract_all_text(content):
    text = ""
    if not isinstance(content, dict): return text
    if "intro" in content: text += content["intro"] + " "
    if "text" in content: text += content["text"] + " "
    for key in ["subsections", "clauses", "subclauses"]:
        if key in content and isinstance(content[key], dict):
            for sub_key, sub_val in content[key].items():
                text += f"({sub_key}) " + extract_all_text(sub_val)
    return text.strip()

# Indexing
print("Analyzing legal sections...")
for ch in dpdp_data.get("chapters", []):
    chapter_info = f"Chapter {ch.get('chapter_number')}: {ch.get('chapter_title')}"
    for sec in ch.get("sections", []):
        sec_num = sec.get('section_number', 'Unknown')
        sec_title = sec.get('section_title', 'Unknown')
        full_content = extract_all_text(sec.get("content", {}))
        
        doc_text = f"Section {sec_num}. {sec_title}. {full_content}"
        documents.append(doc_text)
        metadata.append({
            "section_number": sec_num,
            "section_title": sec_title,
            "chapter": chapter_info,
            "description": full_content
        })

# Create Vector Index (Numpy version)
print(f"Indexing {len(documents)} sections...")
section_embeddings = model.encode(documents, convert_to_numpy=True)
# Normalize for Cosine Similarity
section_embeddings = section_embeddings / np.linalg.norm(section_embeddings, axis=1, keepdims=True)

def query_dpdp(raw_input, threshold=0.3):
    """
    Splits input into granular findings and maps each to a DPDP section using Numpy Cosine Similarity.
    """
    sentences = re.split(r'[\.\!\?\n]+', raw_input)
    candidate_findings = [s.strip() for s in sentences if len(s.strip()) > 10]
    
    if not candidate_findings:
        return []

    # Encode and Normalize query embeddings
    query_embs = model.encode(candidate_findings, convert_to_numpy=True)
    query_embs = query_embs / np.linalg.norm(query_embs, axis=1, keepdims=True)
    
    # Compute Cosine Similarities (Dot product of normalized vectors)
    similarities = np.dot(query_embs, section_embeddings.T)
    
    results = []
    for i, finding in enumerate(candidate_findings):
        # Get highest similarity score and its index
        best_match_idx = np.argmax(similarities[i])
        score = similarities[i][best_match_idx]
        
        # In Cosine Similarity, higher is better (0 to 1)
        if score > threshold:
            match = metadata[best_match_idx]
            results.append({
                "finding": finding,
                "section_number": match["section_number"],
                "section_title": match["section_title"],
                "chapter": match["chapter"],
                "description": match["description"]
            })
            
    return results
