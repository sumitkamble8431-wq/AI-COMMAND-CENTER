import requests
import time

# Global Cache to save your API quota
category_cache = {}

def categorize_email(subject, sender):
    cache_key = f"{subject}-{sender}"
    if cache_key in category_cache:
        return category_cache[cache_key]

    # YOUR API KEY
    API_KEY = "AIzaSyBHzXPKKE677iTcQFbv11sPp-y9Luy4zDA"
    
    # UPDATED APRIL 2026: gemini-2.5-flash is the current stable standard
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{
                "text": f"Task: Categorize this email. Respond ONLY with one word: 'ACADEMIC', 'IMMEDIATE', or 'SILENT'. Subject: {subject}. Sender: {sender}"
            }]
        }]
    }

    try:
        # Throttle to avoid hitting free tier limits
        time.sleep(1.0)
        
        response = requests.post(url, json=payload, timeout=10)
        data = response.json()

        if "error" in data:
            # This will help us see if it's a DIFFERENT error now
            print(f"Google API Error: {data['error']['message']}")
            return "SILENT"

        # Safe extraction of the AI response
        if 'candidates' in data and len(data['candidates']) > 0:
            result = data['candidates'][0]['content']['parts'][0]['text'].strip().upper()
            
            # Final mapping
            if "ACADEMIC" in result: final = "ACADEMIC"
            elif "IMMEDIATE" in result: final = "IMMEDIATE"
            else: final = "SILENT"

            category_cache[cache_key] = final
            return final
        
        return "SILENT"

    except Exception as e:
        print(f"Connection Error: {e}")
        return "SILENT"