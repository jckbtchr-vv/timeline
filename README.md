# Timeline Page

A Linktree-style app, but time-native. A single public page showing an immutable, chronological list of entries.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite via Prisma
- **Icons:** Lucide React

## Core Product Rules
- **Append-only:** Entries can be created but never edited or deleted.
- **Chronological:** Ordered by date (newest first by default).
- **Brutalist UI:** Minimal, black/white, typographic.

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory and add:
```bash
ADMIN_PASSWORD=your_secure_password_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
Initialize the SQLite database and generate the Prisma client:
```bash
npx prisma db push
```

### 4. Seed Data
Populate the timeline with sample entries:
```bash
npx prisma db seed
```

### 5. Run Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## Admin Access
To add new entries, navigate to `/admin` and enter the password configured in your `.env` file.

## Customization
- **Site Title/Subtitle:** Change these in `src/app/page.tsx` and `src/app/layout.tsx`.
- **Styling:** Modify `tailwind.config.ts` and `src/app/globals.css` for visual changes.
- **Constraints:** Max title length (80 chars) and consequence length (160 chars) are enforced in the admin form and API.

## API Endpoints
- `GET /api/entries`: Fetch all entries (public).
- `POST /api/entries`: Create a new entry (admin only, requires `x-admin-password` header).

