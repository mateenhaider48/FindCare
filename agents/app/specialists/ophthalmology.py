from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

ophthalmology_retriever = build_retriever("agents/data/ophthalmology/ophthalmology.pdf", "agents/data/ophthalmology/chroma_db")


def ophthalmology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = ophthalmology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Ophthalmology Medical Assistant.

    Analyze the patient's eye and vision-related symptoms.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved ophthalmology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Ophthalmology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
