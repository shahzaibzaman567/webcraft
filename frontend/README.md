# Webcraft Frontend

React 19 + Vite frontend for the Webcraft AI website builder.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `VITE_BACKEND_URL`.
3. Start the backend from `../backend`.
4. Run the app: `npm run dev`

## Authentication

Clerk is the production authentication provider. Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env` and the matching Clerk secret keys to the backend.

When Clerk is not configured, login and signup show a development-only email form that requires the backend to have `ALLOW_DEV_AUTH=true`. This fallback must not be enabled in production.

## AI Provider Keys

Do not add AI provider keys to frontend environment variables. They are bundled into the browser build and would be public. Add Gemini, Groq, OpenRouter, or Together keys through the admin panel in the backend.

## Background AI Jobs

Project generation and iterative chat are submitted as background jobs and polled by the Builder. The backend uses Inngest when `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` are configured; without those keys it falls back to an in-process job runner so local development still works. This prevents long AI requests from hitting HTTP timeouts. In Inngest Cloud, sync the app using `https://<your-backend-host>/api/inngest`.
