# Haltev Trial Class

Mobile-first Next.js trial class registration site. The customer-facing page and privacy notice are implemented in `app/`.

## Run locally

Install Node.js 20 or newer, then run `npm install` and `npm run dev`.

## Current state

The class and slot cards contain clearly labeled preview data. The registration endpoint validates required fields and Indonesian WhatsApp numbers, then returns an unavailable response until persistent Google Sheets storage and Calendar invitations are configured. It does not claim to reserve seats or send invitations yet.

The tutor/admin portal, Google OAuth, live slot management, concurrency-safe seat reservation, Google Sheets/Calendar/Meet integration, and Turnstile are not implemented. These require the Haltev Google Workspace project, tutor roster, actual trial schedule, Cloudflare keys, and deployment environment. Never place service-account credentials in client code.

The PRD labels “Ruang lingkup rilis dan timeline” as section 9; it was treated as the timeline section to skip. Section 8 (data integrations and technology) was retained as implementation requirements.
