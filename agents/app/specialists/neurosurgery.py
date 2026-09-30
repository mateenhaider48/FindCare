from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

neurosurgery_retriever = build_retriever("agents/data/neurosurgery/neurosurgery.pdf","agents/data/neurosurgery/chroma_db")


def neurosurgery_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = neurosurgery_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Neurosurgery Medical Assistant.

    Analyze symptoms involving the brain, spine, or peripheral nerves
    that may require surgical evaluation.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved neurosurgery knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Neurosurgery knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
