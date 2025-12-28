import re
import json
from pathlib import Path

RAW_PATH = Path("data/processed/raw_text.txt")
OUT_JSON = Path("data/processed/sections.json")

def clean_text(text):
    if not text:
        return ""
    # Remove excessive whitespace
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def get_sequence_val(key, name):
    if name == "subsections":
        return int(key) if key.isdigit() else 0
    if name == "clauses":
        # a, b, ... z, za, zb
        if len(key) == 1:
            return ord(key) - ord('a') + 1
        if len(key) == 2:
            return 26 + (ord(key[1]) - ord('a') + 1)
    if name == "subclauses":
        # i, ii, iii, iv, v...
        roman = {'i':1, 'ii':2, 'iii':3, 'iv':4, 'v':5, 'vi':6, 'vii':7, 'viii':8, 'ix':9, 'x':10,
                 'xi':11, 'xii':12, 'xiii':13, 'xiv':14, 'xv':15}
        return roman.get(key.lower(), 0)
    if name == "subsubclauses":
        return ord(key) - ord('A') + 1
    return 0

def parse_level(text, level_patterns):
    if not level_patterns:
        return {"text": clean_text(text)}

    best_name = None
    best_matches = []
    
    for name, pattern in level_patterns:
        # Require newline for top-level structural markers
        if name in ["subsections", "clauses"]:
            p = r"(?:^|\n)\s*" + pattern
        else:
            p = pattern
            
        matches = list(re.finditer(p, text, re.MULTILINE))
        if not matches:
            continue
            
        # Sequence-aware filtering
        ordered = []
        last_val = 0
        for m in matches:
            val = get_sequence_val(m.group(1), name)
            # Allow starting at something other than 1 for first item, or specifically 1
            if not ordered:
                if val > 0:
                    ordered.append(m)
                    last_val = val
            elif val == last_val + 1:
                ordered.append(m)
                last_val = val
        
        if ordered:
            # TIE-BREAK: 
            # 1. Earliest start wins.
            # 2. If same start, the one with MORE matches in sequence wins.
            if not best_matches or ordered[0].start() < best_matches[0].start():
                best_name = name
                best_matches = ordered
            elif ordered[0].start() == best_matches[0].start() and len(ordered) > len(best_matches):
                best_name = name
                best_matches = ordered

    if not best_name:
        return {"text": clean_text(text)}

    results = {}
    intro = text[:best_matches[0].start()].strip()
    if intro:
        results["intro"] = clean_text(intro)
    
    items = {}
    # We pass the same level_patterns to children but they must be in sequence there too
    for i, m in enumerate(best_matches):
        key = m.group(1).strip()
        start = m.end()
        end = best_matches[i+1].start() if i+1 < len(best_matches) else len(text)
        body = text[start:end]
        items[key] = parse_level(body, level_patterns)
    
    results[best_name] = items
    return results

def extract_special_blocks(text):
    special = {}
    # Increased specificity for stopping markers to avoid greedy consumption
    stop_regex = r"(?=\n\s*\(\d+\)|\n\s*\(\w\)\s|\n\s*Illustration|\n\s*Explanation|\n\s*Provided that|\Z)"
    
    # Extract Illustrations
    ills = list(re.finditer(r"\n\s*Illustration[s]?\.(.*?)" + stop_regex, text, re.DOTALL | re.IGNORECASE))
    if ills:
        special["illustrations"] = [clean_text(i.group(1)) for i in ills]
        for i in ills:
            text = text.replace(i.group(0), " ")

    # Extract Explanations
    exps = list(re.finditer(r"\n\s*Explanation\.\s*—(.*?)" + stop_regex, text, re.DOTALL | re.IGNORECASE))
    if exps:
        special["explanations"] = [clean_text(e.group(1)) for e in exps]
        for e in exps:
            text = text.replace(e.group(0), " ")

    # Extract Provisos
    provs = list(re.finditer(r"\n\s*Provided that\s+(.*?)" + stop_regex, text, re.DOTALL | re.IGNORECASE))
    if provs:
        special["provisos"] = [clean_text(p.group(1)) for p in provs]
        for p in provs:
            text = text.replace(p.group(0), " ")
            
    return special, text

def parse_hierarchical(text):
    # Refined patterns
    base_levels = [
        ("subsections", r"(?<!sub-section\s)(?<!sub-sections\s)\(\s*(\d+)\s*\)\s+"),
        # (a), (b)... (za), (zb)
        ("clauses", r"(?<!section\s)(?<!clause\s)\(\s*([a-z]{1,2})\s*\)\s+"),
        ("subclauses", r"\(\s*([ivx]+)\s*\)\s+"),
        ("subsubclauses", r"\(\s*([A-Z])\s*\)\s+")
    ]
    
    special, remaining_text = extract_special_blocks(text)
    structure = parse_level(remaining_text, base_levels)
    if special:
        structure.update(special)
    return structure

def main():
    if not RAW_PATH.exists():
        print("Error: raw_text.txt not found")
        return

    text = RAW_PATH.read_text(encoding="utf-8")

    # 1. Identify Chapters
    chapter_pattern = r"(?:CHAPTER\s+([IVXLC]+))\n(.*?)\n"
    chapters = []
    chapter_matches = list(re.finditer(chapter_pattern, text, re.IGNORECASE))

    for i, ch in enumerate(chapter_matches):
        ch_num = ch.group(1)
        ch_title = clean_text(ch.group(2))
        
        ch_start = ch.end()
        ch_end = chapter_matches[i+1].start() if i+1 < len(chapter_matches) else len(text)
        ch_text = text[ch_start:ch_end]

        # 2. Identify Sections
        section_pattern = r"\n(?:\d+\s+)?(\d+[A-Z]?)\.\s+"
        sections = []
        section_matches = list(re.finditer(section_pattern, ch_text))
        
        for j, s in enumerate(section_matches):
            sec_num = s.group(1)
            sec_start = s.end()
            sec_end = section_matches[j+1].start() if j+1 < len(section_matches) else len(ch_text)
            sec_body = ch_text[sec_start:sec_end]

            # 3. Title Matching - search near markers
            sec_title = "Unknown"
            title_candidates = [
                "Short title and commencement", "Definitions", "Application of Act",
                "Grounds for processing personal data", "Notice", "Consent", "Certain legitimate uses",
                "General obligations of Data Fiduciary", "Processing of personal data of children",
                "Additional obligations of Significant Data Fiduciary", "Right to access information about personal data",
                "Right to correction and erasure of personal data", "Right of grievance redressal", "Right to nominate",
                "Duties of Data Principal", "Processing of personal data outside India", "Exemptions",
                "Establishment of Board", "Composition and qualifications for appointment of Chairperson and Members",
                "Salary, allowances payable to and term of office", "Disqualifications for appointment and continuation as Chairperson and Members of Board",
                "Resignation by Members and filling of vacancy", "Proceedings of Board", "Officers and employees of Board",
                "Members and officers to be public servants", "Powers of Chairperson", "Powers and functions of Board",
                "Procedure to be followed by Board", "Appeal to Appellate Tribunal", "Orders passed by Appellate Tribunal to be executable as decree",
                "Alternate dispute resolution", "Voluntary undertaking", "Penalties", "Crediting sums realized by way of penalties to Consolidated Fund of India",
                "Protection of action taken in good faith", "Power to call for information", "Power of Central Government to issue directions",
                "Consistency with other laws", "Bar of jurisdiction", "Power to make rules", "Laying of rules and certain notifications",
                "Power to amend Schedule", "Power to remove difficulties", "Amendments to certain Acts",
                "Powers of Central Government to issue directions", "Action taken in good faith", "Power to call for information",
                "Power to amend Schedule", "Power to remove difficulties", "Amendments to certain Acts",
                "Powers of Central Government to issue directions", "Establishing the Board",
                "Composition and Information about Chairperson", "Appointment of Members",
                "Removal of Members", "Right to Nomination"
            ]
            
            for cand in title_candidates:
                # Look for candidate as a standalone line or followed by dot/newline
                # Use \b for word boundary and allow some flexibility for punctuation
                if re.search(rf"\b{re.escape(cand)}\b", sec_body, re.IGNORECASE):
                    sec_title = cand
                    sec_body = re.sub(rf"{re.escape(cand)}(\.|\s*)", " ", sec_body, flags=re.IGNORECASE)
                    break
            
            if sec_title == "Unknown":
                # Fallback: Try to find a line that looks like a title (short, no punctuation at end)
                # Or just use "Section " + number
                sec_title = f"Section {sec_num}"

            # 4. Parse deep hierarchy
            content = parse_hierarchical(sec_body)
            
            sections.append({
                "section_number": sec_num,
                "section_title": sec_title,
                "content": content
            })

        chapters.append({
            "chapter_number": ch_num,
            "chapter_title": ch_title,
            "sections": sections
        })

    # 5. Extract Schedule
    schedule_match = re.search(r"THE\s+SCHEDULE\s*(.*)", text, re.DOTALL | re.IGNORECASE)
    schedule_text = schedule_match.group(1).strip() if schedule_match else "None"

    final_output = {
        "act_name": "Digital Personal Data Protection Act, 2023",
        "chapters": chapters,
        "schedule": schedule_text
    }

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(final_output, f, indent=2, ensure_ascii=False)

    print(f"Successfully created {OUT_JSON} (Hierarchical V2)")

if __name__ == "__main__":
    main()
