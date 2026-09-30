from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


pediatrics_retriever = build_retriever("agents/data/pediatrics/pediatrics.pdf", "agents/data/pediatrics/chroma_db")

def pediatrics_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = pediatrics_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Pediatrics Medical Assistant.

    Analyze the child's symptoms and complete conversation.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved pediatric knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Pediatrics knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
