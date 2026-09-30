from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

gynecology_retriever = build_retriever("agents/data/gynaecology/gynaecology.pdf", "agents/data/gynaecology/chroma_db")

def gynecology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = gynecology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Gynecology Medical Assistant.

    Analyze the patient's gynecological symptoms and conversation.

    Consider possible conditions and identify missing information.
    Ask relevant follow-up questions when needed.

    Use the retrieved gynecology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Gynecology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}        
