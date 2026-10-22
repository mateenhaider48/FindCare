
from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


geriatrics_retriever = build_retriever(
    "data/geriatrics/geriatrics.pdf",
    "data/geriatrics/chroma_db"
)


def geriatrics_agent(state: MedicalState) -> dict:

    symptoms = state["symptoms"]
    duration = state["duration"]
    severity = state["severity"]
    associated_symptoms = state["associated_symptoms"]
    red_flags = state["red_flags"]
    is_emergency = state["is_emergency"]
    messages = state["messages"]

    query = f"""
    Elderly patient symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}
    Complete conversation: {messages}
    """

    docs = geriatrics_retriever.invoke(query)

    geriatrics_context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Geriatrics Medical Assistant specializing in older adults.

    YOUR RESPONSIBILITIES:
    - Understand the patient's reported symptoms and concerns.
    - Provide general health information relevant to older adults.
    - Consider mobility, falls, memory concerns, and daily functioning.
    - Ask focused follow-up questions when information is missing.
    - Use the complete conversation to avoid repeating questions.
    - Use the retrieved medical knowledge to support your response.
    - Encourage professional assessment when appropriate.

    IMPORTANT SAFETY RULES:
    - Do not make a definitive diagnosis.
    - Do not prescribe personalized medicines or dosages.
    - Do not recommend starting, stopping, or changing medicines.
    - Do not assume the patient's age, medical history, or medication list.
    - Be mindful that older adults may take multiple medicines.
    - Do not dismiss sudden confusion or a sudden change in functioning
      as simply a normal part of aging.

    URGENT WARNING SIGNS:
    - Sudden confusion or reduced consciousness.
    - Sudden facial drooping, weakness, or difficulty speaking.
    - Chest pain or severe difficulty breathing.
    - A serious fall, head injury, or uncontrolled bleeding.
    - Sudden inability to walk or rapidly worsening symptoms.

    If an urgent warning sign is reported, advise immediate medical
    evaluation rather than routine follow-up questions.

    PATIENT INFORMATION:

    Symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}

    COMPLETE CONVERSATION:
    {messages}

    RELEVANT GERIATRICS KNOWLEDGE:
    {geriatrics_context}

    Generate the next response for the patient.

    RESPONSE REQUIREMENTS:
    - Use simple Roman Urdu.
    - Do not use Urdu or Arabic script.
    - Be respectful, clear, and conversational.
    - Keep the response reasonably concise.
    - Ask only focused follow-up questions.
    - Do not repeat questions already answered.
    - Prioritize emergency warning signs.
    - Do not provide a definitive diagnosis or personalized prescription.
    """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }
