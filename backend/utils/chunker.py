def flatten_content(content, path=""):
    """Recursively flatten the hierarchical content into a list of strings."""
    lines = []
    
    if "intro" in content:
        lines.append(content["intro"])
    if "text" in content:
        lines.append(content["text"])
    
    # Process nested blocks
    for level_key in ["subsections", "clauses", "subclauses", "subsubclauses"]:
        if level_key in content:
            for key, sub_content in content[level_key].items():
                lines.extend(flatten_content(sub_content, f"{path} ({key})"))
    
    # Process special blocks
    if "illustrations" in content:
        for ill in content["illustrations"]:
            lines.append(f"Illustration: {ill}")
    if "explanations" in content:
        for exp in content["explanations"]:
            lines.append(f"Explanation: {exp}")
    if "provisos" in content:
        for prov in content["provisos"]:
            lines.append(f"Proviso: {prov}")
            
    return lines

def extract_chunks(data, max_words=300):
    """
    Extract searchable chunks from the structured DPDP JSON.
    Each chunk will include section metadata for traceability.
    """
    chunks = []
    
    # Handle the root object structure
    chapters = data.get("chapters", [])
    
    for chapter in chapters:
        ch_num = chapter.get("chapter_number")
        ch_title = chapter.get("chapter_title")
        
        for sec in chapter.get("sections", []):
            sec_num = sec.get("section_number")
            sec_title = sec.get("section_title")
            
            # Get all text elements from this section
            text_elements = flatten_content(sec.get("content", {}))
            
            # Combine elements into chunks of ~max_words
            current_chunk = []
            current_word_count = 0
            
            for element in text_elements:
                words = element.split()
                if current_word_count + len(words) > max_words and current_chunk:
                    chunks.append({
                        "section_id": sec_num,
                        "title": sec_title,
                        "chapter": f"{ch_num}: {ch_title}",
                        "text": " ".join(current_chunk)
                    })
                    current_chunk = []
                    current_word_count = 0
                
                current_chunk.append(element)
                current_word_count += len(words)
            
            if current_chunk:
                chunks.append({
                    "section_id": sec_num,
                    "title": sec_title,
                    "chapter": f"{ch_num}: {ch_title}",
                    "text": " ".join(current_chunk)
                })
                
    return chunks
