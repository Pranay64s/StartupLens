# 🚀 StartupLens

**StartupLens** is a full-stack AI-powered application designed to analyze startup ideas, evaluate market sizes, research competitors, and learn from past startup failures using Retrieval-Augmented Generation (RAG).

## 🌍 Live Demos
- **Frontend (UI)**: [StartupLens on Vercel](https://frontend-steel-eta-86.vercel.app/)

---
---

## 🏗️ Architecture & Split Deployment

To effectively host this robust AI application without incurring massive cloud costs, we employed an industry-standard **Split Deployment Strategy**:

1. **Frontend (Vite + React)**: Hosted on **Vercel**
   - Vercel's global Edge network ensures lightning-fast load times for the UI.
   - Utilizes a serverless architecture highly optimized for static assets and React apps.

2. **Backend (Python + FastAPI + Docker)**: Hosted on **Hugging Face Spaces**
   - *Why not host the backend on Vercel?* The Python backend uses heavy Machine Learning frameworks (`torch`, `sentence-transformers`, `chromadb`, `google-adk`, `langchain`) that immediately exceed Vercel's strict 250MB–500MB serverless function size limits. 
   - Additionally, AI generation and vector database querying can take extended periods of time, which causes Vercel's 10-to-60-second execution timeouts to flag a `504 Gateway Timeout`.
   - **The Solution:** Hugging Face Spaces provides a dedicated "always-on" Docker container with standard 16GB of RAM, allowing heavy vector database querying and long-running AI inference without arbitrary constraints. A custom Linux `Dockerfile` (`python:3.10-slim`) was written to handle system-level AI dependencies effortlessly.

---

## ✨ Features
- **Idea Validation:** Uses state-of-the-art LLMs (Google Gemini & Groq) to evaluate startup pitches.
- **RAG Failure Analysis:** Embeds historical startup failure data into local **ChromaDB** vector storage to warn you about potential pitfalls related to your specific idea.
- **Competitor Tracking:** AI Agents autonomously search the web via DuckDuckGo to identify and compile lists of active competitors in your domain.

## 💻 Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, Flask, Hugging Face Spaces Docker SDK
- **AI / ML:** LangChain, ChromaDB, Sentence-Transformers, Google ADK, Groq

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone git@github.com:Pranay64s/StartupLens.git
cd StartupLens
```

### 2. Backend Setup
1. Create a virtual environment and activate it:
```bash
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
```
2. Install Python dependencies:
```bash
pip install -r requirements.txt
```
3. Set up your `.env` file at the root with your API keys:
```env
GOOGLE_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
PORT=7860
```
4. Run the backend server:
```bash
python -m src.server
```

### 3. Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install Node dependencies:
```bash
npm install
```
3. Create a `.env.local` or `.env.production` file pointing to your backend:
```env
VITE_API_URL=http://127.0.0.1:7860
```
4. Start the Vite dev server:
```bash
npm run dev
```



