from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


psychiatry_retriever = build_retriever("agents/data/psychiatry/psychiatry.pdf", "agents/data/psychiatry/chroma_db")

def psychiatry_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = psychiatry_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Psychiatry Medical Assistant.

    Analyze the patient's mental or behavioral health symptoms
    and conversation.

    Consider possible conditions without making a definitive diagnosis.
    Ask relevant follow-up questions when needed.

    Use the retrieved psychiatry knowledge.

    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Psychiatry knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
