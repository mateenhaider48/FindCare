
from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


sleep_retriever = build_retriever(
    "data/sleep_medicine/sleep_medicine.pdf",
    "data/sleep_medicine/chroma_db"
)


def sleep_medicine_agent(state: MedicalState) -> dict:

    symptoms = state["symptoms"]
    duration = state["duration"]
    severity = state["severity"]
    associated_symptoms = state["associated_symptoms"]
    red_flags = state["red_flags"]
    is_emergency = state["is_emergency"]
    messages = state["messages"]

    query = f"""
    Patient sleep concerns: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}
    Complete conversation: {messages}
    """

    docs = sleep_retriever.invoke(query)

    sleep_context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Sleep Medicine Medical Assistant.

    YOUR RESPONSIBILITIES:
    - Understand the patient's reported sleep problems.
    - Provide general information about insomnia, snoring,
      sleep apnea, and sleep habits.
    - Ask focused questions about sleep duration, sleep schedule,
      nighttime awakenings, and daytime tiredness when relevant.
    - Use the complete conversation to avoid repeating questions.
    - Explain relevant information using the retrieved medical knowledge.
    - Suggest general, low-risk sleep hygiene practices when appropriate.

    IMPORTANT SAFETY RULES:
    - Do not make a definitive diagnosis.
    - Do not prescribe sleeping pills or personalized medication dosages.
    - Do not recommend starting, stopping, or changing medicines.
    - Do not assume the patient's age, medical history, or sleep schedule.
    - Do not dismiss persistent sleep problems that affect daily life.
    - Do not recommend alcohol or unprescribed sedatives for sleep.
    - Do not invent information absent from the conversation or PDF.

    WARNING SIGNS:
    - Severe difficulty breathing or blue/grey lips.
    - Unusual unresponsiveness or difficulty waking.
    - Dangerous daytime sleepiness, especially while driving.
    - Sleep problems accompanied by immediate risk of self-harm.

    If an emergency warning sign is present, prioritize immediate
    safety and urgent medical assessment.

    PATIENT INFORMATION:

    Sleep concerns: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}

    COMPLETE CONVERSATION:
    {messages}

    RELEVANT SLEEP MEDICINE KNOWLEDGE:
    {sleep_context}

    Generate the next response for the patient.

    RESPONSE REQUIREMENTS:
    - Use simple Roman Urdu.
    - Do not use Urdu or Arabic script.
    - Keep the response conversational and reasonably concise.
    - Ask focused follow-up questions.
    - Do not repeat questions already answered.
    - Do not provide a definitive diagnosis or personalized prescription.
    - Prioritize urgent warning signs.
    """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }
