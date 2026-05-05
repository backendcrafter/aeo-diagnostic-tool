# 🔍 AEO Diagnostic Tool — AI Brand Visibility Analyzer

> **Built for [Pixii.ai](https://pixii.ai) Founding Engineer Application**  
> Discover how your brand ranks across multiple AI engines — simultaneously.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aeo--diagnostic--tool.vercel.app-6c63ff?style=for-the-badge&logo=vercel)](https://aeo-diagnostic-tool.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://aeo-diagnostic-backend-emg7.onrender.com)

---

## 🚀 What is this?

**AEO (Answer Engine Optimization)** is the new SEO. As shoppers increasingly ask AI assistants for product recommendations, brands need to know — *does AI recommend me?*

This tool lets Amazon sellers and brand managers type any product query (e.g. *"best magnesium supplement for seniors"*) and instantly see:

- Which brands each AI engine recommends
- How rankings differ across AI models
- Which brands have **strong consensus** across all engines
- Which brands appear in only one AI's results

---

## ✨ Features

- ⚡ **Simultaneous AI querying** — all 3 engines called in parallel via `Promise.allSettled`
- 📊 **Brand Report Card** — consensus scoring (green = all 3 agree, yellow = 2 agree, gray = 1 only)
- 💡 **Example queries** — one-click example searches for instant demo
- 🎨 **Dark themed UI** — professional SaaS-style interface
- 🦴 **Skeleton loading** — smooth loading states while APIs respond
- 📱 **Responsive** — works on desktop and mobile

---

## 🖥️ Demo

> **Live:** [https://aeo-diagnostic-tool.vercel.app](https://aeo-diagnostic-tool.vercel.app)

Type any product query like:
- `best magnesium supplement for seniors`
- `best protein powder for gym beginners`
- `best sleep aid for adults`
- `best collagen supplement for skin`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| AI Engine 1 | Groq API (LLaMA 3.3 70B) |
| AI Engine 2 | Groq API (LLaMA 3.1 8B) |
| AI Engine 3 | Cohere API (Command-R) |
| Deployment (FE) | Vercel |
| Deployment (BE) | Render |

---

## 📁 Project Structure

```
aeo-diagnostic-tool/
│
├── aeo-diagnostic/          # Backend
│   ├── server.js            # Express server + API calls
│   ├── package.json
│   └── .env                 # API keys (not committed)
│
└── frontend/                # React Frontend
    ├── src/
    │   └── App.jsx          # Main UI component
    ├── index.html
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- Groq API key → [console.groq.com](https://console.groq.com) (free)
- Cohere API key → [cohere.com](https://cohere.com) (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/backendcrafter/aeo-diagnostic-tool.git
cd aeo-diagnostic-tool
```

### 2. Setup Backend
```bash
cd aeo-diagnostic
npm install
```

Create `.env` file:
```env
GROQ_API_KEY=gsk_...
COHERE_API_KEY=...
OPENROUTER_API_KEY=...
PORT=3001
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3001
```

Start frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### `POST /analyze`

**Request:**
```json
{
  "query": "best magnesium supplement for seniors"
}
```

**Response:**
```json
{
  "gpt": [
    { "rank": 1, "brand": "Nature Made", "product": "Magnesium 250mg", "reason": "Widely trusted brand" }
  ],
  "claude": [...],
  "gemini": [...],
  "reportCard": [
    { "brand": "Nature Made", "count": 3 },
    { "brand": "Doctor's Best", "count": 2 }
  ],
  "query": "best magnesium supplement for seniors"
}
```

---

## 🚀 Deployment

### Backend → Render
1. Connect GitHub repo on [render.com](https://render.com)
2. Set **Root Directory** to `aeo-diagnostic`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. Add environment variables: `GROQ_API_KEY`, `COHERE_API_KEY`

### Frontend → Vercel
1. Connect GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

---

## 🔮 What I'd Build Next

- **Real Amazon listing input** — paste a product URL, auto-extract brand name
- **Historical tracking** — monitor brand rank changes over time
- **Competitor alerts** — get notified when a competitor enters the top 3
- **More AI engines** — add Perplexity, ChatGPT, Claude API directly
- **Export reports** — download PDF report cards for clients

---

## 👨‍💻 Built By

**Harsh Pratap Singh**  
Final Year BTech CSE — GLA University, Mathura  
Built as part of the Pixii.ai Founding Engineer application
