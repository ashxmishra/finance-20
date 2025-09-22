# FinTrack — Personal Finance Tracker (ITR/GST Ready)

FinTrack is a React + TypeScript app that helps you track income, expenses, savings, and reminders. Attach invoices/receipts, visualize totals, and export ITR/GST‑ready Excel files. Works fully in guest/local mode and optionally with Firebase for auth, cloud storage, and sync.

## Features

- Income and Expenses with file attachments (invoice/receipt)
- Savings and Reminders tracking
- Dashboard with charts and quick metrics
- ITR/GST export to Excel (multi‑sheet) with optional URL columns
  - Guest/local mode: blob links (not clickable in Excel)
  - Firebase mode: https URLs (clickable in Excel)
- Profile page with Name, Email, Address, Phone (stored locally per user/guest)
- Authentication (optional) via Firebase Google Sign‑In
- Responsive UI with shadcn/ui + Tailwind CSS

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix primitives)
- XLSX (SheetJS) for Excel export
- Firebase (Auth, Firestore, Storage) — optional
- Express SSR build target and Netlify function (optional)
- Vitest for unit testing

## Project Structure

- client/
  - App.tsx, pages/ (Dashboard, Income, Expenses, Savings & Reminders, Tax, Profile)
  - context/ (AuthContext, FinanceContext)
  - components/ (layout, charts, ui, MetricCard)
  - utils/exportToExcel.ts (workbook generation, hyperlinks)
  - lib/firebase.ts (runtime Firebase config)
- server/
  - index.ts, node-build.ts (Express adapter)
- netlify/functions/api.ts (serverless handler)
- public/ (static)
- vite.config.ts, vite.config.server.ts, tailwind.config.ts

## Getting Started

Prerequisites: Node 18+ recommended. Package manager: pnpm (declared in package.json). You may use npm/yarn if preferred.

Install deps:
- pnpm install
- npm install
- yarn

Development:
- pnpm dev
- npm run dev
- yarn dev

Type-check:
- pnpm typecheck

Format:
- pnpm format.fix

Build (SPA + server build):
- pnpm build

Preview server build locally:
- node dist/server/node-build.mjs

Tests (Vitest):
- pnpm test

## Environment Configuration (Firebase Optional)

The app runs entirely in guest/local mode when Firebase env vars are missing. To enable auth/cloud:

Required Vite env variables (prefix VITE_):
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

When all are present, Firebase features are enabled automatically (see client/lib/firebase.ts). In Builder.io, prefer using the Dev Server environment variable management instead of committing .env files.

## Data Model & Storage

- Guest/local mode: data is stored in localStorage under fintrack:{uid|guest}. File inputs are kept as blob URLs for in‑app preview. Note: blob: links will not open from Excel after export. This is expected.
- Firebase mode: data rows are stored in Firestore; files are uploaded to Storage and exported as https URLs (clickable in Excel).

## Excel Export (ITR/GST)

The Tax page allows filtering by All/Month/Custom Range, including optional sheets (Reminders, Savings), and optionally including URL columns. The export generates the following sheets:
- Incomes (date, source, amount, invoiceUrl?)
- Expenses (date, category, amount, receiptUrl?)
- Reminders (title, dueDate, amount)
- Savings (name, amount, date)
- Summary (aggregates)

Hyperlinks: http(s) URL cells are annotated as Excel hyperlinks. blob: links (guest mode) appear as text.

File name reflects UI selection (variant/date range) and uses the visible filename base.

## Key Files

- client/utils/exportToExcel.ts
  - Normalizes column order and adds hyperlink metadata for URL columns
  - Accepts optional fileNameBase to control the saved filename
- client/context/FinanceContext.tsx
  - Manages all entities (Income, Expense, Reminder, Saving)
  - Local mode (localStorage + blob URLs) and Firebase mode (Firestore + Storage)
  - Add/Update/Delete helpers
- client/pages/Tax.tsx
  - Filtering, preview, and export trigger
- client/pages/Profile.tsx
  - Profile details (name, email, address, phone) stored per user/guest in localStorage

## Deployment

Use Builder.io MCP integrations for zero‑config deployment:
- Netlify: Click [Connect Netlify MCP](#open-mcp-popover), then trigger deploy
- Vercel: Click [Connect Vercel MCP](#open-mcp-popover), then trigger deploy

Notes:
- Netlify builds from source; local build is optional
- You can share [Open Preview](#open-preview) during development (not production‑ready)

## Accessibility & UX Notes

- Uses semantic HTML, keyboard‑focusable controls, aria labels in UI components
- Toasts/notifications via sonner and Radix Toast

## Common Questions

- Why URLs sometimes don’t open from Excel?
  - In guest/local mode, file links are blob: and only work within the browser session. Sign in (Firebase) to get https links that open from Excel.
- Can I export without URL columns?
  - Yes — uncheck "Include invoice/receipt URLs" on the Tax page.

## License

MIT
