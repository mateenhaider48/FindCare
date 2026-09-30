from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

orthopedics_retriever = build_retriever("agents/data/orthopedics/orthopedics.pdf", "agents/data/orthopedics/chroma_db")

def orthopedics_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = orthopedics_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Orthopedics Medical Assistant.

    Analyze the patient's bone, joint, muscle, or injury-related symptoms.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved orthopedic knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Duration:
    {state["duration"]}

    Severity:
    {state["severity"]}

    Associated symptoms:
    {state["associated_symptoms"]}

    Conversation:
    {state["messages"]}

    Orthopedic knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
