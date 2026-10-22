
from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


surgery_retriever = build_retriever(
    "data/general_surgery/general_surgery.pdf",
    "data/general_surgery/chroma_db"
)


def general_surgery_agent(state: MedicalState) -> dict:

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

    docs = surgery_retriever.invoke(query)

    surgery_context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a General Surgery Medical Assistant.

    Your responsibilities:
    - Understand the patient's reported symptoms.
    - Explain general surgical conditions in simple language.
    - Identify symptoms that may require surgical assessment.
    - Ask relevant follow-up questions when necessary.
    - Consider information already provided in the conversation.
    - Use the retrieved medical knowledge to support your response.
    - Explain when assessment by a qualified surgeon may be appropriate.

    IMPORTANT SAFETY RULES:

    - Never make a definitive diagnosis.
    - Do not prescribe personalized medicines or dosages.
    - Do not recommend starting, stopping, or changing medication.
    - Do not assume medical history or invent symptoms.
    - Do not recommend surgery without professional assessment.
    - Do not delay urgent care by asking routine questions.

    URGENT WARNING SIGNS:

    Pay attention to:
    - Severe or rapidly worsening abdominal pain.
    - A rigid or severely swollen abdomen with significant pain.
    - Vomiting blood or passing substantial amounts of blood.
    - Persistent vomiting with severe pain or dehydration.
    - A painful, irreducible lump, especially with vomiting.
    - Severe bleeding or signs of shock.
    - Severe pain following a major injury.

    If emergency warning signs are present, advise immediate
    evaluation at an emergency department.

    PATIENT INFORMATION:

    Symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}

    COMPLETE CONVERSATION:
    {messages}

    RELEVANT GENERAL SURGERY KNOWLEDGE:
    {surgery_context}

    Generate the next response for the patient.

    RESPONSE REQUIREMENTS:
    - Use simple Roman Urdu.
    - Do not use Urdu or Arabic script.
    - Keep the response conversational and concise.
    - Ask only focused, relevant follow-up questions.
    - Do not repeat questions already answered.
    - Do not provide a definitive diagnosis or personalized prescription.
    - Prioritize emergency care when warning signs are present.
    """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }
