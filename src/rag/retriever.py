import os
import pandas as pd
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

# Instead of complex ML embeddings, just load the CSV directly into Pandas memory!
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "CSV", "Startup Failures.csv")
try:
    df = pd.read_csv(CSV_PATH) if os.path.exists(CSV_PATH) else pd.DataFrame()
except Exception as e:
    df = pd.DataFrame()

class FailedStartupInfo(BaseModel):
    name: str = Field(description="Name of the startup")
    sector: str = Field(description="The sector or industry it belonged to")
    product_type: str = Field(description="What they did or their product/service")
    cash_burned: str = Field(description="Total cash burned or how much they raised before failing")
    years_of_operation: str = Field(description="Years of operation (format: start_year - end_year)")
    failure_analysis: str = Field(description="Why they failed, main reasons for shutting down")
    learnings: str = Field(description="Startup learnings or key takeaways from their failure")

class FailedStartupResponse(BaseModel):
    startups: list[FailedStartupInfo] = Field(description="List of maximum 3 relevant failed startups from the context")
    summary: str = Field(description="A brief summary of why startups in this space typically fail")

def get_failed_startups_info(query: str, groq_api_key: str):
    try:
        groq_api_key = groq_api_key.strip() if groq_api_key else ""
        
        context = "No relevant startup data found."
        
        if not df.empty:
            # 1. Broadened keyword search scoring
            keywords = [kw.lower() for kw in query.replace(',', ' ').replace('.', ' ').split() if len(kw) > 2]
            
            # Map common startup terms to CSV sectors to improve RAG relevance
            sector_mapping = {
                "education": "information", "edtech": "information", "learning": "information",
                "finance": "finance and insurance", "fintech": "finance and insurance", "banking": "finance and insurance",
                "health": "health care", "medical": "health care", "wellness": "health care",
                "manufacturing": "manufacturing", "hardware": "manufacturing", "robotics": "manufacturing",
                "retail": "retail trade", "ecommerce": "retail trade", "shopping": "retail trade", "clothing": "retail trade",
                "tech": "information professional scientific and technical services",
                "legal": "professional scientific and technical services"
            }
            
            for kw in list(keywords):
                if kw in sector_mapping:
                    keywords.extend(sector_mapping[kw].split())
            
            # Create a huge text blob per row to search against
            text_data = df.astype(str).apply(lambda row: ' '.join(row.values).lower(), axis=1)
            
            # Score rows based on how many keywords match
            scores = text_data.apply(lambda text: sum(1 for kw in set(keywords) if kw in text))
            
            # 2. Extract top 10 most relevant rows for context (MUST have at least one match)
            relevant_df = df[scores > 0]
            if not relevant_df.empty:
                top_indices = scores[scores > 0].nlargest(10).index
                top_rows = df.iloc[top_indices]
                
                context_list = []
                for _, row in top_rows.iterrows():
                    context_list.append("\n".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)]))
                context = "\n\n---\n\n".join(context_list)
            else:
                # IMPORTANT: If no database matches, return empty result immediately to prevent LLM hallucinations
                return {
                    "startups": [],
                    "summary": "No directly relevant failed startup case studies were found in our specialized database for this specific niche."
                }
        
        # 3. Use standard ChatGroq with perfectly clean context!
        llm = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant", groq_api_key=groq_api_key)
        parser = JsonOutputParser(pydantic_object=FailedStartupResponse)
        
        prompt = PromptTemplate(
            template="You are an expert startup analyst specializing in failure post-mortems.\n"
                     "Your task is to provide real examples of failed startups from the provided context database.\n\n"
                     "CRITICAL RULES:\n"
                     "1. ONLY use startups present in the 'Context Database Records' below.\n"
                     "2. If a startup in the context isn't truly relevant to the query '{query}', discard it.\n"
                     "3. If you find no relevant startups in the context, return an empty 'startups' list [] and in the 'summary', clearly state that no direct matches were found.\n"
                     "4. If you DO find relevant startups in the context, list a maximum of 3.\n\n"
                     "Context Database Records:\n{context}\n\n"
                     "Query: The user is building a startup in the '{query}' space.\n\n"
                     "{format_instructions}",
            input_variables=["query", "context"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )
        
        chain = prompt | llm | parser
        
        result = chain.invoke({"query": query, "context": context})
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "startups": [],
            "summary": f"Data processing error: {str(e)}. Please check your API key."
        }
