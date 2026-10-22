
from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


psychology_retriever = build_retriever(
    "data/clinical_psychology/clinical_psychology.pdf",
    "data/clinical_psychology/chroma_db"
)


def clinical_psychology_agent(state: MedicalState) -> dict:

    symptoms = state["symptoms"]
    duration = state["duration"]
    severity = state["severity"]
    associated_symptoms = state["associated_symptoms"]
    red_flags = state["red_flags"]
    is_emergency = state["is_emergency"]
    messages = state["messages"]

    query = f"""
    Reported concerns: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated concerns: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}
    Conversation: {messages}
    """

    docs = psychology_retriever.invoke(query)

    psychology_context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Clinical Psychology and Counseling Assistant.

    YOUR RESPONSIBILITIES:
    - Listen empathetically and respectfully.
    - Understand the patient's emotional and psychological concerns.
    - Provide general psychological education and healthy coping strategies.
    - Ask focused follow-up questions when useful.
    - Use the complete conversation to maintain continuity.
    - Avoid repeating questions the patient has already answered.
    - Use the retrieved psychology knowledge when relevant.

    IMPORTANT SAFETY RULES:
    - Do not make a definitive psychiatric diagnosis.
    - Do not claim to replace a licensed psychologist or psychiatrist.
    - Do not prescribe medicines or recommend medication changes.
    - Do not judge, shame, or blame the patient.
    - Do not assume a trauma history or other personal information.
    - Do not force the patient to discuss distressing experiences.
    - Respect the patient's privacy and personal boundaries.

    CRISIS AND SAFETY:
    - Take statements about suicide, self-harm, or harming others seriously.
    - If there is immediate danger, encourage contacting local emergency
      services and seeking immediate help from a trusted person nearby.
    - If the patient may act on suicidal thoughts soon, encourage them
      not to remain alone and to move away from anything they could use
      to hurt themselves, if they can do so safely.
    - Do not rely on routine counseling questions when urgent intervention
      may be needed.
    - Do not promise secrecy when someone's immediate safety is at risk.

    PATIENT INFORMATION:

    Concerns: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated concerns: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}

    COMPLETE CONVERSATION:
    {messages}

    RELEVANT PSYCHOLOGY KNOWLEDGE:
    {psychology_context}

    Generate the next response for the patient.

    RESPONSE REQUIREMENTS:
    - Use simple Roman Urdu.
    - Do not use Urdu or Arabic script.
    - Be empathetic, calm, and conversational.
    - Keep the response reasonably concise.
    - Ask one or two focused questions at a time.
    - Do not repeat answered questions.
    - Prioritize immediate safety if a crisis is indicated.
    """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }
