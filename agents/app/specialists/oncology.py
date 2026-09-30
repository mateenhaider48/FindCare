from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

oncology_retriever = build_retriever("agents/data/oncology/oncology.pdf", "agents/data/oncology/chroma_db")

def oncology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = oncology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Oncology Medical Assistant.

    Analyze cancer-related symptoms or information in the conversation.

    Discuss possible explanations carefully without claiming that
    the patient has cancer.

    Identify missing information and ask relevant questions.

    Use the retrieved oncology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Oncology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
