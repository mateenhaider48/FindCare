from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

nephrology_retriever = build_retriever("agents/data/nephrology/nephrology.pdf", "agents/data/nephrology/chroma_db")

def nephrology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = nephrology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
        You are a Nephrology Medical Assistant.

        Analyze the patient's kidney-related symptoms and conversation.

        Consider medically relevant possible conditions only as differential
        possibilities. Do not make a definitive diagnosis.

        Identify important missing information that could help understand the
        patient's kidney-related symptoms.

        Ask relevant follow-up questions when necessary.
        Do not ask for information that the patient has already provided.

        Use the retrieved nephrology knowledge as the primary medical reference.

        Do not make a definitive diagnosis.
        Do not prescribe personalized medication.
        Do not provide personalized medication dosage.
        Do not assume symptoms or medical history that the patient has not mentioned.

        If the retrieved knowledge does not provide enough information to support
        an answer, ask an appropriate follow-up question rather than inventing
        information.

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

        Nephrology knowledge:
        {context}
        """
    response = llm.invoke(prompt)

    return {"final_response": response.content}    
