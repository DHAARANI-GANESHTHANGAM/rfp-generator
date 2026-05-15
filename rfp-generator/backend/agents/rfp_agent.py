import os
from dotenv import load_dotenv
# from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

load_dotenv()

# ── Initialize Gemini LLM ───────────────────────────────────────────────
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7
)

parser = StrOutputParser()


def build_rag_retriever(rfp_text: str):
    """
    Takes the raw RFP text, splits it into chunks,
    stores in ChromaDB, and returns a retriever.
    """
    # Step 1: Split the RFP into smaller chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.create_documents([rfp_text])

    # Step 2: Convert chunks to embeddings and store in ChromaDB
    embeddings = SentenceTransformerEmbeddings(
        model_name="all-MiniLM-L6-v2"  # free, runs locally
    )
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings
    )

    # Step 3: Return a retriever that finds relevant chunks
    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 5}  # return top 5 most relevant chunks
    )

    return retriever


def get_relevant_context(retriever, query: str) -> str:
    """
    Finds the most relevant chunks from the RFP using RAG.
    """
    # docs = retriever.get_relevant_documents(query)
    docs = retriever.invoke(query)
    context = "\n\n".join([doc.page_content for doc in docs])
    return context


async def run_rfp_agent(rfp_text: str) -> dict:
    """
    RAG-powered multi-step AI agent that:
    1. Builds a vector store from the RFP
    2. Retrieves relevant chunks for each section
    3. Drafts each section using only actual RFP content
    """

    # ── Build RAG retriever from the RFP ───────────────────────────────
    print("Building RAG retriever...")
    retriever = build_rag_retriever(rfp_text)

    # ── Step 1: Summarize the RFP ───────────────────────────────────────
    summary_context = get_relevant_context(
        retriever, "main goals objectives requirements overview"
    )

    summary_prompt = ChatPromptTemplate.from_template("""
    You are an expert business analyst. Based on the RFP content below, provide:
    1. A 3-sentence summary of what is being requested
    2. The client's main goals
    3. Key requirements they are looking for

    RFP CONTENT:
    {context}

    Respond in clear, concise bullet points.
    """)

    summary_chain = summary_prompt | llm | parser
    summary = await summary_chain.ainvoke({"context": summary_context})

    # ── Step 2: Draft Executive Summary ────────────────────────────────
    exec_context = get_relevant_context(
        retriever, "project overview purpose background objectives"
    )

    exec_prompt = ChatPromptTemplate.from_template("""
    You are a professional proposal writer. Write a compelling Executive Summary
    for an RFP response. Be professional, confident, and client-focused.
    Base it strictly on the RFP content provided.

    RFP CONTENT:
    {context}

    Write 2-3 paragraphs for the Executive Summary section only.
    """)

    exec_chain = exec_prompt | llm | parser
    executive_summary = await exec_chain.ainvoke({"context": exec_context})

    # ── Step 3: Draft Technical Approach ───────────────────────────────
    tech_context = get_relevant_context(
        retriever, "technical requirements specifications deliverables methodology"
    )

    tech_prompt = ChatPromptTemplate.from_template("""
    You are a technical writer. Write a Technical Approach section for an
    RFP response. Describe how your team would deliver the project based
    strictly on what the RFP asks for.

    RFP CONTENT:
    {context}

    Write the Technical Approach section with clear headings and bullet points.
    """)

    tech_chain = tech_prompt | llm | parser
    technical_approach = await tech_chain.ainvoke({"context": tech_context})

    # ── Step 4: Draft Timeline & Pricing ───────────────────────────────
    timeline_context = get_relevant_context(
        retriever, "timeline deadline budget pricing cost schedule milestones"
    )

    timeline_prompt = ChatPromptTemplate.from_template("""
    You are a project manager. Write a proposed Timeline and Pricing section
    for an RFP response. Include realistic phases and milestones based on
    what the RFP requires.

    RFP CONTENT:
    {context}

    Write the Timeline and Pricing section only.
    """)

    timeline_chain = timeline_prompt | llm | parser
    timeline = await timeline_chain.ainvoke({"context": timeline_context})

    # ── Step 5: Combine into full response ─────────────────────────────
    full_response = f"""
# PROPOSAL RESPONSE

## Executive Summary
{executive_summary}

---

## Technical Approach
{technical_approach}

---

## Timeline & Pricing
{timeline}

---

*This proposal was generated by AI using RAG from your RFP content.
Please review and customize before submission.*
    """.strip()

    return {
        "summary": summary,
        "response": full_response,
        "sections": {
            "executive_summary": executive_summary,
            "technical_approach": technical_approach,
            "timeline": timeline
        }
    }