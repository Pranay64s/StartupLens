import os
import pandas as pd
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# Paths relative to the project root
CSV_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "CSV")
CHROMA_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "chroma")

def load_documents_from_csvs():
    documents = []
    if not os.path.exists(CSV_DIR):
        print(f"Directory {CSV_DIR} does not exist.")
        return documents

    for filename in os.listdir(CSV_DIR):
        if not filename.endswith(".csv"):
            continue
            
        file_path = os.path.join(CSV_DIR, filename)
        try:
            df = pd.read_csv(file_path)
            # Ensure proper string reading
            df = df.astype(str)
            for _, row in df.iterrows():
                content_parts = []
                metadata = {"source": filename}
                
                for col in df.columns:
                    val = row[col]
                    if pd.isna(val) or val == 'nan':
                        continue
                    content_parts.append(f"{col}: {val}")
                    
                    # Store key fields in metadata for easier extraction later if needed
                    col_lower = col.lower()
                    if col_lower in ["name", "sector", "years of operation", "what they did"]:
                        metadata[col_lower] = str(val)
                
                page_content = "\n".join(content_parts)
                documents.append(Document(page_content=page_content, metadata=metadata))
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            
    return documents

def ingest_data():
    print("Loading documents from CSVs...")
    docs = load_documents_from_csvs()
    print(f"Loaded {len(docs)} records from CSV files.")
    
    if not docs:
        print("No documents to ingest. Aborting.")
        return

    print("Initializing HuggingFace embeddings (all-MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    print("Creating/updating Chroma vector store...")
    os.makedirs(os.path.dirname(CHROMA_DB_DIR), exist_ok=True)
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=CHROMA_DB_DIR
    )
    print("Ingestion complete. Database stored at", CHROMA_DB_DIR)

if __name__ == "__main__":
    ingest_data()
