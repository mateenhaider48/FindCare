from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


vascular_surgery_retriever = build_retriever("agents/data/vascular_surgery/vascular_surgery.pdf","agents/data/vascular_surgery/chroma_db")


def vascular_surgery_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = vascular_surgery_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Vascular Surgery Medical Assistant.

    Analyze symptoms related to arteries, veins, circulation,
    or blood vessels.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved vascular surgery knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Vascular Surgery knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
