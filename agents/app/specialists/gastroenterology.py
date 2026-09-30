from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

gastroenterology_retriever = build_retriever("agents/data/gastroenterology/gastroenterology.pdf", "agents/data/gastroenterology/chroma_db")

def gastroenterology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = gastroenterology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
        You are a Gastroenterology Medical Assistant.

        Analyze the patient's digestive symptoms and conversation.

        Consider medically relevant possible conditions only as differential
        possibilities. Do not make a definitive diagnosis.

        Identify important missing information that could help understand the
        patient's digestive symptoms.

        Ask relevant follow-up questions when necessary.
        Do not ask for information that the patient has already provided.

        Use the retrieved gastroenterology knowledge as the primary medical
        reference.

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

        Gastroenterology knowledge:
        {context}
        """
    response = llm.invoke(prompt)

    return {"final_response": response.content}
