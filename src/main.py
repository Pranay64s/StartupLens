import asyncio
import sys
from src.agents.agent import (
    macro_analyst_agent,
    competitor_analyst_agent,
    customer_voice_agent,
    strategy_agent
)

async def run_analysis(idea: str, industry: str):
    print(f"\n Starting StartupLens Analysis for: '{idea}' in '{industry}'...\n")

    def call_agent(agent, prompt):
        response = agent.invoke(prompt)
        if hasattr(response, 'output'):
            return response.output
        if hasattr(response, 'text'):
            return response.text
        return str(response)

    print("running research agents in parallel...")
    
    pestel_prompt = f"Perform a PESTEL Analysis for the industry: {industry}. Include a Mermaid Mindmap."
    market_prompt = f"Estimate Market Size (TAM, SAM, SOM) for idea: '{idea}' in industry: '{industry}'. Include a Mermaid Pie Chart."
    competitor_prompt = f"Identify Top 5 Competitors for idea: '{idea}' in industry: '{industry}'. Include a Mermaid Quadrant Chart."
    pain_point_prompt = f"Identify Customer Pain Points for idea: '{idea}' in industry: '{industry}'. Include a Mermaid Pie Chart of complaints."

    results = await asyncio.gather(
        asyncio.to_thread(call_agent, macro_analyst_agent, pestel_prompt),
        asyncio.to_thread(call_agent, macro_analyst_agent, market_prompt),
        asyncio.to_thread(call_agent, competitor_analyst_agent, competitor_prompt),
        asyncio.to_thread(call_agent, customer_voice_agent, pain_point_prompt)
    )
    
    macro_trends, market_size, competitors, pain_points = results
    
    research_context = f"""
    MACRO TRENDS:
    {macro_trends}
    
    MARKET SIZE:
    {market_size}
    
    COMPETITOR LANDSCAPE:
    {competitors}
    
    CUSTOMER PAIN POINTS:
    {pain_points}
    """
    
    print("\n💡 Research Complete. Synthesizing Strategy & Roadmap...\n")
    
    strategy_prompt = f"Develop a Strategy, VRIO, and Roadmap for '{idea}' based on this research: {research_context}. Include a Mermaid Timeline."
    strategy = await asyncio.to_thread(call_agent, strategy_agent, strategy_prompt)

    report = f"""
# StartupLens Report: {idea}

## 1. Market Context (Macro Analysis)
{macro_trends}

## 2. Market Size (TAM/SAM/SOM)
{market_size}

## 3. Competitor Landscape
{competitors}

## 4. Customer Voice (Pain Points)
{pain_points}

## 5. Strategic Blueprint & Roadmap
{strategy}
    """
    
    filename = f"{idea.replace(' ', '_')}_blueprint.md"
    with open(filename, "w", encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n Analysis Complete! Report saved to {filename}")
    return report

def main():
    print("Welcome to StartupLens (CLI)")
    idea = input("1. Describe your idea: ")
    industry = input("2. Select Industry: ")
    
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(run_analysis(idea, industry))

if __name__ == "__main__":
    main()
