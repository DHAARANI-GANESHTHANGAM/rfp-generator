# 🤖 ProposAI- AI Proposal Generator

An AI-powered web app that reads an RFP (Request for Proposal) and automatically drafts a professional response using LangChain agents and Google Gemini.

---

## 🗂️ Project Structure

```
rfp-generator/
├── backend/                  ← Python + FastAPI
│   ├── main.py               ← App entry point
│   ├── requirements.txt      ← Python dependencies
│   ├── .env.example          ← Copy to .env
│   ├── routers/
│   │   └── rfp.py            ← API endpoints
│   ├── agents/
│   │   └── rfp_agent.py      ← AI agent logic
│   └── utils/
│       └── pdf_reader.py     ← PDF text extraction
│
├── frontend/                 ← React + Tailwind
│   ├── package.json
│   ├── .env.example          ← Copy to .env.local
│   └── src/
│       ├── App.jsx           ← Routes
│       ├── pages/
│       │   ├── Home.jsx      ← Upload page
│       │   └── Response.jsx  ← View/edit response
│       └── components/
│           └── Navbar.jsx
│
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/rfp-generator.git
cd rfp-generator
```

---

### 2. Set up the Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Open .env and fill in your API keys

# Run the server
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 3. Set up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Getting Free API Keys

| Key | Where to Get It | Free Tier |
|---|---|---|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) | ✅ Free |
| `TAVILY_API_KEY` | [tavily.com](https://tavily.com) | ✅ 1000 req/month free |
| `SUPABASE_URL` + `SUPABASE_KEY` | [supabase.com](https://supabase.com) | ✅ Free tier |

---

## 🌐 Deployment (Free)

### Frontend → Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy ✅

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo → select `backend` folder
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (your API keys)
6. Deploy ✅

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Python, FastAPI |
| AI / Agents | LangChain, Google Gemini API |
| Database | Supabase (PostgreSQL) |
| PDF | pdfplumber |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📌 Next Features to Add
- [ ] User authentication (Supabase Auth)
- [ ] Save response history
- [ ] Web search tool for agent (Tavily)
- [ ] Lead scoring — rate how winnable the RFP is
- [ ] Export to DOCX
- [ ] CRM integration (Airtable API)
