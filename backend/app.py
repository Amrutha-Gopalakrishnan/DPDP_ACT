from flask import Flask, request, jsonify
from flask_cors import CORS
from rag import query_dpdp

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        query_text = data.get("input") or data.get("text")
        
        if not query_text:
            return jsonify({"error": "No input provided"}), 400

        mappings = query_dpdp(query_text)
        
        results = []
        for m in mappings:
            results.append({
                "finding": m["finding"],
                "section": m["section_number"],
                "title": m["section_title"],
                "chapter": m["chapter"],
                "description": m["description"]
            })
            
        return jsonify({
            "status": "success",
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)