from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.google_search_tool import google_search
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import os
import asyncio
import aiohttp
from dotenv import load_dotenv

if not hasattr(aiohttp, 'ClientConnectorDNSError'):
    print("Applying monkey-patch for aiohttp.ClientConnectorDNSError")
    aiohttp.ClientConnectorDNSError = aiohttp.ClientConnectorError

retry_config = types.HttpRetryOptions(
    attempts=1, 
    http_status_codes=[500, 503, 504], 
)

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY is missing. Please check your .env file.")
else:
    print(f"API Key Loaded: ...{api_key[-5:]}")

model_primary_name = "gemini-2.5-flash-lite"
model_primary = Gemini(model=model_primary_name, api_key=api_key, retry_options=retry_config)

model_fallback_name = "gemini-2.5-flash-lite"
model_fallback = Gemini(model=model_fallback_name, api_key=api_key, retry_options=retry_config)

session_service = InMemorySessionService()

def run_agent(agent_instance, prompt_text, max_retries=1): 
    
    async def _run():
        full_text = ""
        try:
            session = await session_service.create_session(app_name="StartupLens", user_id="default_user")
            
            runner = Runner(
                agent=agent_instance,
                app_name="StartupLens",
                session_service=session_service
            )
            
            user_input = types.Content(role="user", parts=[types.Part(text=prompt_text)])
            
            async for event in runner.run_async(
                user_id="default_user", 
                session_id=session.id, 
                new_message=user_input
            ):
                if hasattr(event, 'content') and event.content:
                    for part in event.content.parts:
                        if part.text:
                            full_text += part.text
            
            if not full_text:
                raise ValueError("Agent returned empty response")
            
            return full_text

        except Exception as e:
            error_str = str(e)
            print(f"    [Agent Error] {agent_instance.name}: {error_str}")
            
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                 raise RuntimeError("API_QUOTA_EXHAUSTED") from e
            
            if "ClientConnectorDNSError" in error_str:
                 print("    -> Intermittent aiohttp error. (Caller should retry)")
                 raise RuntimeError("CONNECTION_ERROR") from e

            raise e

    try:
        return asyncio.run(_run())
    except RuntimeError as re:
        raise re
    except Exception as e:
        raise e

google_search_agent = LlmAgent(
    name="google_search_agent",
    model=model_primary,
    description="Searches for information using Google search",
    instruction="Use the google_search tool to find information.",
    tools=[google_search],
)

def create_agent_graph(target_model_name, target_api_key=None):
    key_to_use = target_api_key if target_api_key else api_key
    
    llm = Gemini(model=target_model_name, api_key=key_to_use, retry_options=retry_config)
    
    search_agent = LlmAgent(
        name="google_search_agent",
        model=llm,
        description="Searches for information using Google search",
        instruction="Use the google_search tool to find information.",
        tools=[google_search],
    )
    
    master_agent = LlmAgent(
        name="master_analyst_agent",
        model=llm,
        instruction="""
        Role: Senior Startup Analyst.
        
        You are an all-in-one branding, market research, and strategy expert.
        Your goal is to analyze a startup idea and output a comprehensive JSON report.
        
        Process:
        1. Understand the idea context.
        2. Use your knowledge (and Search if absolutely necessary) to identify Competitors and Opportunities.
        3. Formulate a Business Strategy (Model, Acquisition, Risks).
        4. Output EVERYTHING in a single valid JSON structure.
        
        Constraint: Output ONLY JSON. No preamble.
        """,
        tools=[AgentTool(agent=search_agent)],
    )
    
    return master_agent

def create_master_agent(model_to_use):
    return LlmAgent(
        name="master_analyst_agent",
        model=model_to_use,
        instruction="""
        Role: Senior Startup Analyst.
        
        You are an all-in-one branding, market research, and strategy expert.
        Your goal is to analyze a startup idea and output a comprehensive JSON report.
        
        Process:
        1. Understand the idea context.
        2. Use your knowledge (and Search if absolutely necessary) to identify Competitors and Opportunities.
        3. Formulate a Business Strategy (Model, Acquisition, Risks).
        4. Output EVERYTHING in a single valid JSON structure.
        
        Constraint: Output ONLY JSON. No preamble.
        """,
        tools=[AgentTool(agent=google_search_agent)],
    )

master_analyst_agent = create_master_agent(model_primary)
