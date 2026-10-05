from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState




def infectious_disease_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    infectious_disease_retriever = build_retriever(
        "agents/data/infectious_disease/infectious_disease.pdf",
        "agents/data/infectious_disease/chroma_db",
    )

    docs = infectious_disease_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Infectious Disease Medical Assistant.

    Analyze the patient's symptoms and conversation for possible
    infectious causes.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved infectious disease knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Infectious disease knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}

