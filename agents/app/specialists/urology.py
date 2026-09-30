from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

urology_retriever = build_retriever("agents/data/urology/urology.pdf", "agents/data/urology/chroma_db")

def urology_agent(state: MedicalState) -> dict:
    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = urology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Urology Medical Assistant.

    Analyze urinary, bladder, prostate, or reproductive-system-related
    symptoms and the complete conversation.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved urology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Patient symptoms:
    {state["symptoms"]}

    Duration:
    {state["duration"]}

    Severity:
    {state["severity"]}

    Associated symptoms:
    {state["associated_symptoms"]}

    Conversation:
    {state["messages"]}

    Urology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
