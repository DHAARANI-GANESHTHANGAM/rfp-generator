from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import json
from agents.rfp_agent import run_rfp_agent
from utils.pdf_reader import extract_text

router = APIRouter()

@router.post("/generate")
async def generate_rfp_response(file: UploadFile = File(...), profile: str = Form("{}")):
    """
    Accepts an RFP PDF file, extracts text,
    runs the AI agent, and returns a drafted response.
    """
    # Step 1: Make sure it's a PDF
    allowed = [".pdf", ".docx", ".doc", ".txt"]
    if not any(file.filename.lower().endswith(ext) for ext in allowed):
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, DOC, and TXT files are accepted.")

    # Step 2: Read and extract text from PDF
    contents = await file.read()
    rfp_text = extract_text(contents, file.filename)

    if not rfp_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

    # Step 3: Run the AI agent
    profile_data = json.loads(profile)
    result = await run_rfp_agent(rfp_text, profile_data)

    return {
        "filename": file.filename,
        "rfp_summary": result["summary"],
        "drafted_response": result["response"],
        "sections": result["sections"],
        "win_score": result.get("win_score", {})
    }


@router.post("/generate-text")
async def generate_from_text(data: dict):
    """
    Accepts raw RFP text (pasted by user) and returns AI response.
    """
    rfp_text = data.get("text", "")

    if not rfp_text or len(rfp_text) < 50:
        raise HTTPException(status_code=400, detail="RFP text is too short.")

    profile = data.get("profile", {})
    result = await run_rfp_agent(rfp_text, profile)

    return {
        "rfp_summary": result["summary"],
        "drafted_response": result["response"],
        "sections": result["sections"],
        "win_score": result.get("win_score", {})
    }
