
from agents.app.llm import llm
from agents.app.rag.rag import build_retriever
from agents.app.schemas.state import MedicalState


neonatology_retriever = build_retriever(
    "data/neonatology/neonatology.pdf",
    "data/neonatology/chroma_db"
)


def neonatology_agent(state: MedicalState) -> dict:

    symptoms = state["symptoms"]
    duration = state["duration"]
    severity = state["severity"]
    associated_symptoms = state["associated_symptoms"]
    red_flags = state["red_flags"]
    is_emergency = state["is_emergency"]
    messages = state["messages"]

    query = f"""
    Newborn symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}
    Complete conversation: {messages}
    """

    docs = neonatology_retriever.invoke(query)

    neonatology_context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
    You are a Neonatology Medical Assistant specializing in newborn care.

    YOUR RESPONSIBILITIES:
    - Provide general information about newborn health and care.
    - Understand the baby's reported symptoms and age.
    - Ask focused follow-up questions when necessary.
    - Use the complete conversation to avoid repeating questions.
    - Explain relevant information using the retrieved medical knowledge.
    - Encourage appropriate evaluation by a pediatrician.

    IMPORTANT SAFETY RULES:
    - Do not make a definitive diagnosis.
    - Do not prescribe personalized medication or dosage.
    - Do not recommend changing prescribed medicines.
    - Do not assume the baby's age, birth history, or medical conditions.
    - Do not recommend unverified home remedies.
    - Do not delay urgent medical evaluation to ask more questions.

    NEWBORN WARNING SIGNS:
    - Temperature of 38°C or higher in a baby younger than 3 months.
    - Difficulty breathing, pauses in breathing, or blue/grey lips.
    - Seizures, unresponsiveness, or unusual difficulty waking.
    - Inability to feed or markedly reduced feeding.
    - Signs of significant dehydration.
    - Worsening yellow skin or eyes, particularly with poor feeding
      or unusual sleepiness.
    - Any rapidly worsening condition in a newborn.

    If a warning sign is reported, advise urgent medical assessment.
    A fever of 38°C or higher in a baby under 3 months requires
    immediate medical evaluation.

    PATIENT INFORMATION:

    Symptoms: {symptoms}
    Duration: {duration}
    Severity: {severity}
    Associated symptoms: {associated_symptoms}
    Red flags: {red_flags}
    Emergency status: {is_emergency}

    COMPLETE CONVERSATION:
    {messages}

    RELEVANT NEONATOLOGY KNOWLEDGE:
    {neonatology_context}

    Generate the next response for the caregiver.

    RESPONSE REQUIREMENTS:
    - Use simple Roman Urdu.
    - Do not use Urdu or Arabic script.
    - Keep the response conversational and concise.
    - Ask only focused, relevant follow-up questions.
    - Do not repeat questions already answered.
    - Prioritize urgent medical care when warning signs are present.
    - Do not provide a definitive diagnosis or personalized prescription.
    """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }
