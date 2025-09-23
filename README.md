# FinTrack — Project Changes and Setup (Firebase‑Only)

This document summarizes the changes made and how to run the project now that all data flows use Firebase (free plan). The UI has not changed; only logic/integration did.

## What Changed

- Firebase‑only data model (no localStorage fallback):
  - All Income, Expenses, Savings, Reminders are stored in Firestore.
  - File uploads (invoices/receipts) go to Firebase Storage; exports use https links.
- Guest mode now uses Firebase Anonymous Auth (requires Firebase env). No offline guest.
- Login page:
  - Added Email/Password Sign Up and Sign In.
  - Google Sign‑in retained.
  - Continue as Guest triggers anonymous auth.
- Profile page:
  - Added Name, Email, Address, Phone fields.
  - Persists to Firestore (profiles/{uid}).
  - Removed Recent Incomes/Expenses sections (per request).
- Tax/Excel export:
  - Always includes optional URL columns; converts http(s) to clickable hyperlinks in Excel.
  - Filename matches UI selection.
- Dashboard: removed the ₹ symbol from metrics.

## Current Behavior (Summary)

- Auth (required): Google, Email/Password, or Anonymous (guest).
- Data: Firestore (incomes, expenses, reminders, savings) with real‑time subscriptions per user.
- Files: Firebase Storage with public download URLs saved in documents.
- Export: ITR/GST Excel with Incomes, Expenses, Reminders, Savings, Summary; optional URL columns.

## Tech Stack

- React 18, TypeScript, Vite, Tailwind, shadcn/ui (Radix)
- Firebase Auth, Firestore, Storage
- XLSX (SheetJS), recharts
- Express server build + Netlify function (optional)

## Project Structure (key files)

- client/context/AuthContext.tsx — Google, Email/Password, Anonymous auth
- client/context/FinanceContext.tsx — Firestore CRUD, Storage uploads, realtime
- client/pages/Login.tsx — Email/Password Sign In/Up, Google, Guest
- client/pages/Tax.tsx — filters and export trigger
- client/utils/exportToExcel.ts — workbook, URL columns, hyperlinks, filename
- client/pages/Profile.tsx — profile form saved to Firestore

## Setup (Firebase Required)

1) Create a Firebase project (console.firebase.google.com)
2) Enable providers in Authentication → Sign‑in method
   - Email/Password
   - Google (optional)
   - Anonymous (for guest)
   - Add your domain under Authorized domains
3) Create Firestore DB and Storage bucket
4) Create a Web App and copy config
5) Set these Vite env vars (all required):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID

In Builder.io, set env vars via [Open Settings](#open-settings) rather than committing .env files.

## Run

- Install deps: pnpm install (or npm/yarn)
- Dev server: pnpm dev
- Build: pnpm build
- Tests: pnpm test

## Usage Notes

- Sign in (Email/Password or Google) or continue as Guest (Anonymous auth) on Login.
- Add income/expenses; attach files — links are persisted as https URLs.
- Export ITR/GST from Tax page; enable “Include invoice/receipt URLs” for link columns.
- Update Profile details; saved to Firestore.

## Troubleshooting

- Auth disabled/greyed out: Ensure ALL VITE_FIREBASE_* vars are set and providers enabled (Email/Password, Google, Anonymous). Add your domain under Authorized domains.
- Export links not clickable: Only http(s) are hyperlink‑enabled. Storage URLs are http(s) and work; ensure you’re signed in and uploads succeeded.

## License

MIT
