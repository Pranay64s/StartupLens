import os
import json
import re
from src.agents.agent import create_agent_graph, run_agent, model_primary_name

def test():
    idea = "A platform that integrates with Continuous Glucose Monitors (CGM) and wearable data to automate grocery shopping."
    industry = "Healthtech"
    master_prompt = f"""
    Analyze the startup idea: '{idea}' in the '{industry}' industry. 
    
    Perform a complete business deep-dive:
    1. Research 3 Competitors (Name, Market Share %, Audience, Strategy).
    2. Identify the Whitespace Opportunity.
    3. Calculate Viability Score (0-100).
    4. Define Risk, Roadmap, Business Models (3), Acquisition Channels (3), Target Persona, and SWOT.
    5. Financial Projections (Revenue per user, Min Investment, Break-even, Growth Rate).
    6. Market Trends (4 Key trends).
    7. Demographics Data (Age group distribution percentages).
    
    Output strictly VALID JSON with this structure:
    {{
      "research": {{
          "competitors": [ {{ "name": "...", "market_share": 30, "target_audience": "...", "marketing_strategy": "..." }} ],
          "opportunity": "...",
          "market_trends": ["Trend 1...", "Trend 2...", "Trend 3...", "Trend 4..."],
          "market_share_insight": "Brief insight on competitor dominance..."
      }},
      "strategy": {{
          "viability_score": 85,
          "risk_analysis": "...",
          "roadmap": ["Step 1...", "Step 2...", "Step 3..."],
          "summary": "...",
          "business_models": ["Model: Why..."],
          "user_acquisition": ["Channel: How..."],
          "target_users": "...",
          "financials": {{
              "revenue_per_user": "$...",
              "min_investment": "$...",
              "break_even": "... months",
              "user_growth_rate": "...%"
          }},
          "demographics": {{
              "age_groups": {{ "18-24": 20, "25-34": 40, "35-44": 25, "45+": 15 }},
              "demographics_insight": "Brief insight on target age group..."
          }},
          "swot": {{ "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] }}
      }}
    }}
    """
    
    # Try multiple times to catch intermittent hallucinatory errors
    for attempt in range(2):
        print(f"\n--- Attempt {attempt+1} ---")
        agent = create_agent_graph(model_primary_name)
        try:
            resp = run_agent(agent, master_prompt)
            print(f"Raw response generated, length: {len(resp)}")
            with open(f"test_raw_resp_{attempt}.txt", "w", encoding="utf-8") as f:
                f.write(resp)
                
            match = re.search(r'\{.*\}', resp, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group(0))
                    print("JSON parsing SUCCESS")
                except Exception as e:
                    print(f"JSON parsing FAILED: {e}")
                    import traceback
                    traceback.print_exc()
            else:
                print("No JSON curly braces matched in response.")
        except Exception as e:
            print(f"Agent run failed: {e}")

if __name__ == "__main__":
    test()
