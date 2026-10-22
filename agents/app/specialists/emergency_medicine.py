
from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


emergency_retriever = build_retriever(
    "data/emergency_medicine/emergency_medicine.pdf",
    "data/emergency_medicine/chroma_db"
)


def emergency_medicine_agent(state: MedicalState) -> dict:

    symptoms = state["symptoms"]
    duration = state["duration"]
    severity = state["severity"]
    associated_symptoms = state["associated_symptoms"]
    red_flags = state["red_flags"]
    is_emergency = state["is_emergency"]
    messages = state["messages"]

    query = f"""
    Patient symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}
    Complete conversation: {messages}
    """

    docs = emergency_retriever.invoke(query)

    emergency_context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are an Emergency Medicine and First Aid Medical Assistant.

    Your job is to:
    - Understand the patient's reported symptoms and circumstances.
    - Identify possible emergency warning signs.
    - Provide basic, evidence-based first-aid information.
    - Ask focused follow-up questions only when it is safe to do so.
    - Use the complete conversation to avoid repeating questions.
    - Use the retrieved medical knowledge when relevant.

    IMPORTANT SAFETY RULES:

    - Do not make a definitive diagnosis.
    - Do not prescribe personalized medication or dosage.
    - Do not recommend dangerous or unverified home remedies.
    - Do not delay emergency care to gather more information.
    - Do not assume symptoms or medical history the patient has not reported.
    - If the PDF does not support an answer, do not invent medical facts.

    EMERGENCY WARNING SIGNS:

    Pay particular attention to:
    - Severe difficulty breathing.
    - Severe or persistent chest pain.
    - Unconsciousness or inability to wake up.
    - Seizures.
    - Signs of stroke, including sudden facial drooping,
      arm weakness, or difficulty speaking.
    - Severe bleeding.
    - Severe allergic reaction with breathing difficulty
      or swelling of the tongue or throat.
    - Suspected poisoning or overdose.
    - Major injuries or rapidly worsening symptoms.

    If the patient reports a potentially life-threatening emergency,
    clearly advise contacting local emergency services or going to
    the nearest emergency department immediately.

    FIRST-AID RULES:

    - For severe bleeding, advise applying firm direct pressure
      with a clean cloth or dressing when appropriate.
    - For an unconscious person who is not breathing normally,
      advise emergency services and CPR by someone trained
      or following the emergency dispatcher's instructions.
    - For suspected poisoning, advise urgent professional guidance.
      Do not recommend inducing vomiting or giving home remedies.
    - Provide only first-aid steps appropriate to the reported situation.

    CURRENT EMERGENCY INFORMATION:

    Symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}

    COMPLETE CONVERSATION:
    {messages}

    RELEVANT EMERGENCY MEDICAL KNOWLEDGE:
    {emergency_context}

    Generate the next response for the patient.

    RESPONSE REQUIREMENTS:
    - Use simple Roman Urdu.
    - Do not use Urdu or Arabic script.
    - Keep the response clear, conversational, and concise.
    - Put urgent instructions first when warning signs are present.
    - Do not give a definitive diagnosis or personalized prescription.
    - Do not let routine follow-up questions delay emergency care.
    """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }
