# API Studio - Chatwoot Integration

A secure Next.js application that acts as an interface between incoming URLs with query parameters and Chatwoot messaging.

## Features

- Parse URL query parameters (phone number and message body)
- Extract examination access codes (Código and Senha) from URL-encoded text
- Display a user-friendly confirmation interface
- Allow editing of credentials before sending
- Select target Chatwoot inbox dynamically
- Send formatted messages to Chatwoot

## Setup

1. Install dependencies (handled automatically by v0)

2. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Chatwoot credentials:
     - `CHATWOOT_URL`: Your Chatwoot instance URL
     - `CHATWOOT_API_TOKEN`: Your Chatwoot API token
     - `CHATWOOT_ACCOUNT_ID`: Your Chatwoot account ID

3. The app works with mock data if Chatwoot credentials are not configured, perfect for development.

## Usage

Access the app with URL parameters:

```
https://yourdomain.com/?number=NUMBER&body=CODE
```

The app will:
1. Parse the phone number and body
2. Extract Código and Senha automatically
3. Display a confirmation form
4. Allow you to select an inbox and edit credentials
5. Send the formatted message to Chatwoot

## Security

- All Chatwoot credentials are stored server-side only
- No sensitive data is exposed to the frontend
- Input validation on both client and server
- Designed for internal use by clinic staff

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS v4
- shadcn/ui components
- Server Components & Server Actions
