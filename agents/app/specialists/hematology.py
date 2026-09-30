from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


hematology_retriever = build_retriever("agents/data/hematology/hematology.pdf","agents/data/hematology/chroma_db")


def hematology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = hematology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Hematology Medical Assistant.

    Analyze blood-related symptoms and available information.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved hematology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Hematology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
