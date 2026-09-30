from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

endocrinology_retriever = build_retriever("agents/data/endocrinology/endocrinology.pdf", "agents/data/endocrinology/chroma_db")

def endocrinology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = endocrinology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Endocrinology Medical Assistant.

    Analyze hormone, thyroid, diabetes, and metabolic-related symptoms.

    Consider possible conditions, identify missing information,
    and ask relevant follow-up questions.

    Use the retrieved endocrinology knowledge.

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

    Endocrinology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
