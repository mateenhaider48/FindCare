from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

rheumatology_retriever = build_retriever("agents/data/rheumatology/rheumatology.pdf", "agents/data/rheumatology/chroma_db")

def rheumatology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = rheumatology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Rheumatology Medical Assistant.

    Analyze joint, inflammatory, autoimmune, and connective-tissue symptoms.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved rheumatology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Rheumatology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
