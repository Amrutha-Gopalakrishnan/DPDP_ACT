import os
import sys

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

try:
    from backend.rag import query_dpdp
    print("Backend imported successfully.")
    
    test_input = "Users must be able to withdraw consent as easily as they gave it. Password encryption is required."
    print(f"Testing input: {test_input}")
    
    results = query_dpdp(test_input)
    print(f"Results: {results}")
except Exception as e:
    import traceback
    traceback.print_exc()
