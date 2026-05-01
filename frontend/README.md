# Frontend — React App

The React + Vite frontend for the ATS Resume Analyzer.

## Structure

```
frontend/
├── src/
│   ├── api/          # API layer (axios calls to FastAPI)
│   ├── components/   # Reusable UI components
│   ├── pages/        # Full page components (LandingPage, AnalyzerPage)
│   ├── App.jsx       # Router setup
│   ├── main.jsx      # Entry point (ClerkProvider)
│   └── index.css     # Tailwind directives
├── index.html
├── vite.config.js
├── tailwind.config.js
└── .env              # Environment variables (not committed)
```

## Running

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (from clerk.com dashboard) |
| `VITE_API_BASE_URL` | FastAPI backend URL (default: http://localhost:8000) |

## Tech Stack

- **React 18** + **Vite** — fast dev server, HMR
- **TailwindCSS** — utility-first styling
- **Clerk** — authentication (sign in/up modals)
- **Recharts** — charts (donut gauge, bar chart, radar chart)
- **React Router v6** — client-side routing
- **Axios** — HTTP requests with multipart/form-data support
- **react-dropzone** — drag-and-drop file upload
