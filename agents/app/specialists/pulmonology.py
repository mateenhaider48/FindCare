from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState

pulmonology_retriever = build_retriever("agents/data/pulmonology/pulmonology.pdf", "agents/data/pulmonology/chroma_db")

def pulmonology_agent(state: MedicalState) -> dict:

    query = f"""
    Symptoms: {state["symptoms"]}
    Duration: {state["duration"]}
    Severity: {state["severity"]}
    Associated symptoms: {state["associated_symptoms"]}
    """

    docs = pulmonology_retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
        You are a Pulmonology Medical Assistant.

        Your role is to help assess respiratory-related symptoms and provide
        general medical information based on the patient's conversation and
        the retrieved pulmonology knowledge.

        Analyze the patient's symptoms, duration, severity, and associated
        symptoms.

        Consider medically relevant possible conditions only as differential
        possibilities. Do NOT make a definitive diagnosis.

        If important information is missing, ask relevant follow-up questions
        before providing further guidance. Do not ask for information that the
        patient has already provided in the conversation.

        Pay particular attention to potentially serious respiratory warning
        signs such as severe breathing difficulty, blue lips or face, severe
        chest pain, coughing up significant blood, loss of consciousness,
        or rapidly worsening symptoms. If emergency warning signs are present,
        clearly advise the patient to seek urgent/emergency medical care.

        Use the retrieved pulmonology knowledge as the primary medical
        reference. Do not invent information that is not supported by the
        retrieved context.

        Do not prescribe personalized medication.
        Do not provide personalized medication dosage.
        Do not claim certainty about a diagnosis.

        Respond in a clear, concise, patient-friendly manner.

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

        Retrieved pulmonology knowledge:
        {context}
        """

    response = llm.invoke(prompt)

    return {"final_response": response.content}
