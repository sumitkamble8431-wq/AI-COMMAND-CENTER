from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from gmail_service import fetch_latest_emails
from triage_engine import categorize_email
from pydantic import BaseModel

from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv() # This searches for the .env file and loads the variables
api_key = os.getenv("GEMINI_API_KEY")


app = FastAPI()


class ActionRequest(BaseModel):
    email_id: str
    action: str

@app.post("/triage-action")
def perform_action(request: ActionRequest):
    from gmail_service import manage_email
    result = manage_email(request.email_id, request.action)
    return {"status": "success", "action_taken": result}


# THE SECURITY PASS (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,  # Add this line
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Inbox Command Center is Online"}

@app.get("/command-center")
def get_command_center():
    from gmail_service import fetch_latest_emails
    from triage_engine import categorize_email
    
    raw_emails = fetch_latest_emails(count=3)
    triage_results = []
    
    for email in raw_emails:
        # Get the AI category (IMMEDIATE, ACADEMIC, or SILENT)
        category = categorize_email(email['subject'], email['sender'])
        
        triage_results.append({
            "id": email['id'],
            "subject": email['subject'],
            "sender": email['sender'],
            "category": category.strip().upper() # Force uppercase for consistency
        })
        
    return {"focus_queue": triage_results}