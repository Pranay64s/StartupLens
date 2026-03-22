import sys
import os

print("---CELL 1---")
code1 = """import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from src.rag.retriever import get_failed_startups_info

print("Imports successful!")"""
try:
    exec(code1)
except Exception as e:
    print(e)

print("---CELL 2---")
code2 = """CHROMA_DB_DIR = os.path.join("data", "chroma")
db_exists = os.path.exists(CHROMA_DB_DIR)
print(f"ChromaDB exists at {CHROMA_DB_DIR}: {db_exists}")

if db_exists:
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma(persist_directory=CHROMA_DB_DIR, embedding_function=embeddings)
    print(f"Total documents in Vector Store: {vectorstore._collection.count()}")
"""
try:
    exec(code2)
except Exception as e:
    print(e)

print("---CELL 3---")
code3 = """query = "Fintech payments"
docs = vectorstore.as_retriever(search_kwargs={"k": 3}).invoke(query)
print(f"Retrieved {len(docs)} documents.")
for i, doc in enumerate(docs):
    print(f"\\n--- Document {i+1} ---")
    print(doc.page_content[:200].replace('\\n', ' | ') + "...")
"""
try:
    exec(code3)
except Exception as e:
    print(e)

print("---CELL 4---")
code4 = """from dotenv import load_dotenv
load_dotenv()
groq_key = os.environ.get("GROQ_API_KEY")

if not groq_key:
    print("GROQ_API_KEY is missing from .env, generation will return an error message.")

res = get_failed_startups_info("Fintech payments", groq_key)

import json
print(json.dumps(res, indent=2))
"""
try:
    exec(code4)
except Exception as e:
    print(e)
