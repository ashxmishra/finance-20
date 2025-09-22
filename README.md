# FinTrack — Personal Finance Tracker (ITR/GST Ready)

Track income, expenses, savings, and reminders; attach invoices/receipts; visualize totals; export ITR/GST‑ready Excel. Works offline in guest/local mode and, when configured, syncs via Firebase (Auth + Firestore + Storage).

## Highlights

- Income & Expenses with file attachments (invoice/receipt)
- Savings & Reminders tracking
- Dashboard with charts and key metrics
- ITR/GST Excel export (multi‑sheet) with optional URL columns and clickable hyperlinks for http(s)
- Profile page (Name, Email, Address, Phone) saved per user/guest locally
- Authentication options:
  - Email/Password Sign Up & Sign In (Firebase)
  - Google Sign‑In (Firebase)
  - Continue as Guest (local only)

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- XLSX (SheetJS) for Excel export
- Firebase Auth, Firestore, Storage (optional)
- Express server build + Netlify function (optional)
- Vitest for unit testing

## Project Structure

```
client/
  App.tsx
  components/
    charts/Charts.tsx
    layout/AppLayout.tsx
    ui/*
    MetricCard.tsx
  context/
    AuthContext.tsx
    FinanceContext.tsx
  lib/firebase.ts
  pages/
    Dashboard.tsx
    Income.tsx
    Expenses.tsx
    Profile.tsx
    Tax.tsx
    Login.tsx
  utils/exportToExcel.ts
server/
  index.ts
  node-build.ts
netlify/functions/api.ts
public/
```

## Setup

Prerequisites
- Node.js 18+
- pnpm (declared in package.json), or npm/yarn

Install
- pnpm install
- npm install
- yarn

Dev
- pnpm dev
- npm run dev
- yarn dev

Typecheck: pnpm typecheck

Format: pnpm format.fix

Build (SPA + server): pnpm build

Run built server: node dist/server/node-build.mjs

Test: pnpm test

## Firebase Configuration (Optional but required for auth/cloud)

The app runs fully in guest/local mode without Firebase. To enable Google or Email/Password auth, cloud data, and real file URLs:

1) Create Firebase project (console.firebase.google.com)
2) Enable Authentication
   - Go to Build → Authentication → Sign‑in method
   - Enable “Email/Password” provider
   - Enable “Google” provider (optional)
   - Add your app’s origin under Authorized domains
3) Create Firestore database (production or test mode)
4) Create Storage bucket (default)
5) Add a Web App in Project settings → General → Your apps → Web
6) Copy config and set Vite env variables:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID

Notes
- All vars must be present for Firebase to be considered enabled (see client/lib/firebase.ts)
- In Builder.io, prefer using the environment variable UI instead of committing .env files

## Authentication UX

Login page (client/pages/Login.tsx) offers:
- Sign in / Sign up with Email & Password
  - Toggle between modes; both require Firebase configured and Email/Password provider enabled
  - Password minimum: 6 chars (Firebase default)
- Continue with Google (requires Google provider enabled)
- Continue as Guest (no Firebase needed)

Auth behaviors
- When Firebase is not configured, the page shows a notice and disables provider buttons; Guest still works
- After successful auth (any method), user is routed to /dashboard
- Sign out from Profile page

Under the hood: AuthContext.tsx
- signUpWithEmail(email, password) → Firebase createUserWithEmailAndPassword
- signInWithEmail(email, password) → Firebase signInWithEmailAndPassword
- signInWithGoogle() → Firebase signInWithPopup(Google)
- continueAsGuest() → local guest session (no backend)

## Data & Storage

- Entities: Income, Expense, Reminder, Saving
- Guest/local mode (default):
  - Stored in localStorage under fintrack:{uid|guest}
  - File inputs use blob: URLs for in‑app preview; these will not open from Excel
- Firebase mode: 
  - Firestore collections: incomes, expenses, reminders, savings
  - File uploads go to Storage → public https URLs are saved and exported

## Excel Export (ITR/GST)

- Located in client/pages/Tax.tsx, logic in client/utils/exportToExcel.ts
- Filters: All time, Month, Custom range
- Optional sheets: Reminders, Savings
- Optional columns: invoiceUrl/receiptUrl (toggle in UI)
- Sheets generated:
  - Incomes: date, source, amount, invoiceUrl (if included)
  - Expenses: date, category, amount, receiptUrl (if included)
  - Reminders: title, dueDate, amount
  - Savings: name, amount, date
  - Summary: variant, totals, savings
- Hyperlinks: http(s) URL cells are marked as clickable; blob: links (guest mode) appear as text only
- Filename reflects UI selection (variant + date range)

## UI/UX

- Responsive layout via Tailwind CSS
- shadcn/ui + Radix primitives for accessible components
- Charts: recharts
- Notifications: sonner, Radix Toast

## Deployment

Use Builder.io MCP integrations:
- Netlify: Click [Connect Netlify MCP](#open-mcp-popover), then deploy. Netlify builds from source automatically
- Vercel: Click [Connect Vercel MCP](#open-mcp-popover), then deploy
- For development share, use [Open Preview](#open-preview) (not production‑ready)

## Troubleshooting

- Email/Password buttons disabled
  - Ensure all VITE_FIREBASE_* env vars are set
  - In Firebase console, enable Email/Password provider and add your domain under Authorized domains
- “Authentication failed” on sign up/in
  - Check password length (≥ 6)
  - Confirm the domain is authorized and SDK config matches your project
- Exported Excel URLs not opening
  - Guest mode uses blob: URLs (not valid outside browser). Sign in to store real https URLs

## License

MIT
