# StartupLens API Documentation

## Overview
The StartupLens API exposes the AI agent swarm for startup analysis. It performs deep market research (PESTEL, Competitors, Customer Pain Points) and generates a strategic roadmap.

## Base URL
`http://localhost:8000`

## Endpoints

### 1. `POST /analyze`
Triggers the full analysis workflow.

**Request Body (JSON):**
```json
{
  "idea": "An AI app that helps students find roommates based on sleep schedules",
  "industry": "Real Estate / EdTech",
  "extra_context": "Targeting US colleges first"
}
```

**Response (JSON):**
```json
{
  "idea": "...",
  "industry": "...",
  "report_sections": {
    "macro_trends": "Markdown string with Mermaid diagrams...",
    "market_size": "...",
    "competitor_analysis": "...",
    "customer_voice": "...",
    "strategy_roadmap": "..."
  },
  "full_report_markdown": "# Combined Report..."
}
```

## How to Run
1. Ensure dependencies are installed: `pip install -r requirements.txt`
2. Set your `GOOGLE_API_KEY` in `.env`.
3. Run the server:
   ```bash
   python src/server.py
   # OR
   uvicorn src.server:app --reload
   ```
4. Access Swagger UI at `http://localhost:8000/docs`.
