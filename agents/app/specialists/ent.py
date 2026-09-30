from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

ent_retriever = build_retriever("agents/data/ent/ent.pdf", "agents/data/ent/chroma_db")

def ent_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = ent_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an ENT Medical Assistant.

    Analyze the patient's ear, nose, throat, sinus, hearing, or voice symptoms.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved ENT knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    ENT knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
