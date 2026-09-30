from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

hepatology_retriever = build_retriever("agents/data/hepatology/hepatology.pdf","agents/data/hepatology/chroma_db")


def hepatology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = hepatology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Hepatology Medical Assistant.

    Analyze liver and biliary-system-related symptoms.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved hepatology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Hepatology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
