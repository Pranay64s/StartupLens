import requests
try:
    res = requests.post("http://127.0.0.1:8000/analyze", json={"idea": "test", "industry": "test"})
    print("STATUS", res.status_code)
    print("TEXT", res.text)
except Exception as e:
    print("ERROR", str(e))
