
from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


obstetrics_retriever = build_retriever(
    "data/obstetrics/obstetrics.pdf",
    "data/obstetrics/chroma_db"
)


def obstetrics_agent(state: MedicalState) -> dict:

    symptoms = state["symptoms"]
    duration = state["duration"]
    severity = state["severity"]
    associated_symptoms = state["associated_symptoms"]
    messages = state["messages"]

    query = f"""
    Patient symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Conversation: {messages}
    """

    docs = obstetrics_retriever.invoke(query)

    obstetrics_context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Obstetrics Medical Assistant.

    Your role is to provide general pregnancy and maternal health
    information using the conversation and retrieved medical knowledge.

    TASKS:
    - Understand the patient's reported symptoms and pregnancy concerns.
    - Consider the pregnancy stage only if the patient has provided it.
    - Identify important missing information.
    - Ask focused follow-up questions when necessary.
    - Use the existing conversation and do not repeat answered questions.
    - Explain relevant medical information in simple language.
    - Use the retrieved PDF knowledge to support your response.

    SAFETY RULES:
    - Do not provide a definitive diagnosis.
    - Do not prescribe personalized medication or dosage.
    - Do not recommend starting, stopping, or changing medicines.
    - Do not assume pregnancy duration, medical history, or complications.
    - Do not invent information absent from the conversation or knowledge.
    - Do not delay urgent care by asking routine follow-up questions.

    URGENT WARNING SIGNS:
    - Heavy vaginal bleeding.
    - Severe abdominal pain.
    - Severe headache with visual changes.
    - Seizures or loss of consciousness.
    - Severe difficulty breathing.
    - Pregnancy-related symptoms that may indicate an emergency.

    If an urgent warning sign is reported, advise immediate medical
    evaluation. For a potentially life-threatening emergency, advise
    contacting local emergency services or going to an emergency department.

    PATIENT INFORMATION:
    Symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}

    COMPLETE CONVERSATION:
    {messages}

    RELEVANT OBSTETRICS KNOWLEDGE:
    {obstetrics_context}

    Generate the next response for the patient.

    RESPONSE REQUIREMENTS:
    - Use simple Roman Urdu.
    - Do not use Urdu or Arabic script.
    - Keep the response conversational and reasonably concise.
    - Do not give a definitive diagnosis or personalized prescription.
    - Prioritize urgent warning signs.
    """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }
