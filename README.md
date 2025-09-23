# FinTrack — Personal Finance Tracker (ITR/GST Ready)

A full‑featured React + TypeScript application to track income, expenses, savings, and reminders. Attach invoices/receipts, visualize totals, and export ITR/GST‑ready Excel files. The UI is responsive and accessible. Data, auth, and file storage are backed by Firebase (free plan). The project is optimized for Builder.io workflows and Netlify/Vercel deployment.

---

## Table of Contents

- Overview
- Features
- Tech Stack
- Project Structure
- Quick Start
- Firebase Setup (Required)
  - Enable Auth Providers (Email/Password, Google, Anonymous)
  - Firestore & Storage
  - Web App Config (Vite env)
  - Recommended Security Rules
- App Architecture
  - Routing & Pages
  - State & Data Flow
  - Data Models
  - File Storage Layout
- Authentication UX
- Excel Export (ITR/GST)
- UI Walkthrough
- Deployment (Netlify / Vercel via MCP)
- Troubleshooting & FAQ
- Changelog (Recent Changes)
- Appendix A: Environment Variables
- Appendix B: Development Scripts
- License

---

## Overview

FinTrack helps users record income and expenses with evidence (invoices/receipts), track savings and bill reminders, preview charts and metrics, and export filtered data into ITR/GST‑ready Excel workbooks.

- Firebase‑only data model: All data in Firestore; files in Storage; auth required (Google, Email/Password, or Anonymous).
- Excel export supports optional link columns and clickable hyperlinks for http(s) Storage URLs.

---

## Features

- Income & Expenses with file attachments (invoice/receipt)
- Savings & Reminders tracking
- Dashboard with charts and key metrics
- ITR/GST Excel export (multi‑sheet)
  - Optional invoice/receipt URL columns
  - Clickable hyperlinks for http(s) links
- Profile page with Name, Email, Address, Phone (stored in Firestore)
- Authentication options: Email/Password, Google, Anonymous guest
- Responsive, accessible UI (shadcn/ui + Tailwind)

---

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix)
- recharts (charts)
- XLSX (SheetJS) for Excel export
- Firebase: Auth, Firestore, Storage
- Express server build target + optional Netlify function
- Vitest for tests

---

## Project Structure

```
client/
  App.tsx
  components/
    charts/Charts.tsx
    layout/AppLayout.tsx
    ui/* (shadcn/ui + Radix primitives)
    MetricCard.tsx
  context/
    AuthContext.tsx            # Google, Email/Password, Anonymous auth
    FinanceContext.tsx         # Firestore CRUD, Storage uploads, realtime
  lib/firebase.ts              # Firebase runtime config + enable check
  pages/
    Dashboard.tsx
    Income.tsx
    Expenses.tsx
    Profile.tsx                # Profile -> Firestore (profiles/{uid})
    Tax.tsx                    # Filters + export trigger
    Login.tsx                  # Email/Password Sign In/Up, Google, Guest
  utils/exportToExcel.ts       # workbook, URL columns, hyperlinks, filename
server/
  index.ts
  node-build.ts
netlify/
  functions/api.ts
public/
```

---

## Quick Start

- Install deps: pnpm install (or npm/yarn)
- Configure Firebase (see below)
- Dev server: pnpm dev
- Build: pnpm build
- Tests: pnpm test

---

## Firebase Setup (Required)

The app requires Firebase for auth, data, and file storage (free plan works):

1. Create a Firebase project at console.firebase.google.com
2. Authentication → Sign‑in method
   - Enable Email/Password
   - Enable Google (optional)
   - Enable Anonymous (for Guest)
   - Add your app’s domain in Authorized domains
3. Firestore
   - Create a database (Production or Test mode)
4. Storage
   - Create a default bucket
5. Project settings → General → Your apps → Web → Register app
   - Copy Web SDK config
6. Set Vite env variables (all required):
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID

In Builder.io, prefer using [Open Settings](#open-settings) to set env vars instead of committing .env files.

### Recommended Security Rules (example)

Adjust to your needs, but the app assumes user‑scoped documents with a uid field:

Firestore (rules v2 example):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isOwner() { return isSignedIn() && request.resource.data.uid == request.auth.uid; }
    function isOwnerExisting() { return isSignedIn() && resource.data.uid == request.auth.uid; }

    match /incomes/{id} {
      allow read: if isSignedIn();
      allow create: if isOwner();
      allow update, delete: if isOwnerExisting();
    }
    match /expenses/{id} {
      allow read: if isSignedIn();
      allow create: if isOwner();
      allow update, delete: if isOwnerExisting();
    }
    match /reminders/{id} {
      allow read: if isSignedIn();
      allow create: if isOwner();
      allow update, delete: if isOwnerExisting();
    }
    match /savings/{id} {
      allow read: if isSignedIn();
      allow create: if isOwner();
      allow update, delete: if isOwnerExisting();
    }
    match /profiles/{uid} {
      allow read, write: if isSignedIn() && uid == request.auth.uid;
    }
  }
}
```

Storage (restrict to signed‑in users):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /invoices/{uid}/{file} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /receipts/{uid}/{file} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## App Architecture

### Routing & Pages

- Dashboard: totals and charts
- Income / Expenses: CRUD with file upload
- Tax: filter data and export Excel (ITR/GST)
- Profile: profile form (Name, Email, Address, Phone) saved in Firestore
- Login: Email/Password Sign In/Up, Google, Anonymous guest

### State & Data Flow

- AuthContext.tsx: Firebase auth state + methods
  - signUpWithEmail, signInWithEmail, signInWithGoogle, continueAsGuest (anonymous auth)
- FinanceContext.tsx: Firestore subscriptions per user + CRUD
  - Realtime on incomes, expenses, reminders, savings
  - File uploads to Storage
- Profile.tsx: Firestore document profiles/{uid}

### Data Models

- Income: { id, uid, date, source, amount, invoiceUrl? }
- Expense: { id, uid, date, category, amount, receiptUrl? }
- Reminder: { id, uid, title, dueDate, amount? }
- Saving: { id, uid, name, amount, date? }
- Profile: { name, email, address, phone, updatedAt }

### File Storage Layout

- Invoices: invoices/{uid}/{timestamp}-{filename}
- Receipts: receipts/{uid}/{timestamp}-{filename}

---

## Authentication UX

- Login page (Login.tsx)
  - Toggle between Sign in / Sign up (Email & Password)
  - Continue with Google
  - Continue as Guest (Anonymous)
- Profile page: Sign out button

---

## Excel Export (ITR/GST)

Location: Tax.tsx (UI) + exportToExcel.ts (logic)

- Filters: All time, Month, Custom Range
- Optional sheets: Reminders, Savings
- Optional columns: invoiceUrl/receiptUrl
- Sheets:
  - Incomes: date, source, amount, invoiceUrl?
  - Expenses: date, category, amount, receiptUrl?
  - Reminders: title, dueDate, amount
  - Savings: name, amount, date
  - Summary: variant, totals, net savings
- Hyperlinks: http(s) cells become clickable hyperlinks in Excel
- Filename mirrors the UI selection (variant + date range)

---

## UI Walkthrough

- Header & Navigation: Dashboard, Income, Expenses, Savings & Reminders, ITR/GST, Profile, Login
- Dashboard: four Metric cards (Income, Expenses, Savings, Reminders)
- Income/Expenses: forms + list, file upload placement; edit/delete controls
- Profile: form for Name, Email, Address, Phone; Save button
- Tax: metrics, filters, include options, filename preview, export button; previews for income/expenses

---

## Deployment (Netlify / Vercel via MCP)

- Netlify: [Connect Netlify MCP](#open-mcp-popover), then deploy; Netlify will build from source
- Vercel: [Connect Vercel MCP](#open-mcp-popover), then deploy
- For development sharing, use [Open Preview](#open-preview) (not production)

---

## Troubleshooting & FAQ

- Buttons disabled on Login
  - Ensure ALL VITE*FIREBASE*\* are set and providers (Email/Password, Google, Anonymous) are enabled
  - Add domain under Authorized domains
- “Authentication failed” on Sign Up/In
  - Password ≥ 6 chars; check provider settings and domain authorization
- Export links not clickable
  - Only http(s) become hyperlinks; ensure uploads completed and URLs saved
- Can I run without Firebase?
  - No. Project now requires Firebase for auth, data, and files (free plan is sufficient)

---

## Changelog (Recent Changes)

- Firebase‑only data model; removed localStorage fallbacks
- Guest uses Anonymous Auth (Firebase)
- Login: added Email/Password Sign Up & Sign In; kept Google + Guest
- Profile: added Name, Email, Address, Phone; persisted to Firestore; removed Recent Income/Expenses sections
- Excel export: stable URL columns + http(s) hyperlinks; filename aligns with UI; minor reliability fixes
- Dashboard: removed ₹ symbol from cards

---

## Appendix A: Environment Variables

Set all:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Use [Open Settings](#open-settings) in Builder.io to manage env vars.

---

## Appendix B: Development Scripts

- Dev: pnpm dev
- Build SPA + server: pnpm build
- Typecheck: pnpm typecheck
- Format: pnpm format.fix
- Tests: pnpm test
- Start built server: node dist/server/node-build.mjs

---

## License

MIT
