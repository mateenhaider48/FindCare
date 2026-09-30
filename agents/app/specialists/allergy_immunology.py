from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState



def allergy_immunology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = allergy_immunology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Allergy and Immunology Medical Assistant.

    Analyze allergy or immune-system-related symptoms.

    Consider possible conditions and ask relevant follow-up questions.

    Use the retrieved allergy and immunology knowledge.

    Do not make a definitive diagnosis.
    Do not prescribe personalized medication or dosage.

    Symptoms:
    {state["symptoms"]}

    Conversation:
    {state["messages"]}

    Allergy and Immunology knowledge:
    {context}
    """

    response = llm.invoke(prompt)

    return {"final_response": response.content}

