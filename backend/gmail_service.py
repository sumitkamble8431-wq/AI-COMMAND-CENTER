import os.path
import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Permissions: 'modify' allows us to read and archive emails later
SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

def get_gmail_service():
    creds = None
    # token.json stores your login so you don't have to log in every time
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # This looks for the file you downloaded from Google Cloud
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

def fetch_latest_emails(count=3):
    service = get_gmail_service()
    
    # Updated: We added the 'q' parameter to filter for ONLY Inbox messages
    results = service.users().messages().list(
        userId='me', 
        q='label:INBOX', 
        maxResults=count
    ).execute()
    
    messages = results.get('messages', [])
    emails = []

    for msg in messages:
        # Get full email details
        txt = service.users().messages().get(userId='me', id=msg['id']).execute()
        payload = txt['payload']
        headers = payload['headers']

        subject = "No Subject"
        sender = "Unknown"
        for d in headers:
            if d['name'] == 'Subject':
                subject = d['value']
            if d['name'] == 'From':
                sender = d['value']

        emails.append({
            "id": msg['id'],
            "subject": subject,
            "sender": sender
        })
    return emails

if __name__ == "__main__":
    # Test it!
    print("Fetching your latest emails...")
    emails = fetch_latest_emails()
    for e in emails:
        print(f"From: {e['sender']} | Subject: {e['subject']}")

def manage_email(email_id, action):
    service = get_gmail_service()
    if action == "archive":
        # Removing 'INBOX' label effectively archives the email
        service.users().messages().modify(
            userId='me',
            id=email_id,
            body={'removeLabelIds': ['INBOX']}
        ).execute()
        return "Archived"
    
    elif action == "read":
        # Removing 'UNREAD' label marks it as read
        service.users().messages().modify(
            userId='me',
            id=email_id,
            body={'removeLabelIds': ['UNREAD']}
        ).execute()
        return "Marked as Read"        