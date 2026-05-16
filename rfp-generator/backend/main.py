import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import rfp

app = FastAPI(title="RFP Generator API")

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(rfp.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "RFP Generator API is running ✅"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
