from agents.app.llm import llm
from agents.app.schemas.state import MedicalState
import json


def symptoms_extract_node(state: MedicalState) -> dict:
    """
    Analyze the latest user message using the previous conversation
    as context and extract medical information.
    """

    last_message = state["messages"][-1].content

    conversation_history = "\n".join(
        f"{type(message).__name__}: {message.content}"
        for message in state["messages"]
    )

    SYMPTOM_ANALYSIS_PROMPT = """
    You are a medical symptom extraction assistant.

    Your task is to analyze the patient's latest message using the
    previous conversation as context.

    The latest message may contain references such as:

    - "ye"
    - "ye sab"
    - "woh"
    - "haan"
    - "haan ye hota hai"
    - "bilkul"
    - "nahi"
    - "same"
    - "kal se"
    - "haan wohi"

    These messages may only make sense when combined with the
    previous conversation.

    Use the conversation history to understand what the patient
    is referring to.

    IMPORTANT RULES:

    - Do NOT diagnose the patient.
    - Do NOT suggest treatment or medication.
    - Do NOT invent symptoms.
    - Do NOT assume information that is not supported by the
    conversation.
    - Use previous conversation only to resolve references in the
    latest message.
    - If the latest message clearly confirms something that was
    previously asked about, include that information.
    - If something is unclear, do not guess it.
    - Extract information from the latest message and relevant
    conversation context.

    Return the following information:

    1. symptoms:
    - List of the main symptoms mentioned or clearly confirmed
    by the patient.
    - Return an empty list if none are available.

    2. duration:
    - How long the symptoms have been present.
    - Return null if not mentioned or clearly established.

    3. severity:
    - Severity such as mild, moderate, severe, or the exact
    description given by the patient.
    - Return null if not mentioned.

    4. associated_symptoms:
    - Other symptoms mentioned or clearly confirmed by the patient.
    - Return an empty list if none are available.

    5. red_flags:
    - Identify potentially serious warning signs explicitly
    mentioned or clearly confirmed by the patient.
    - Do not diagnose.
    - Return an empty list if no red flags are mentioned.

    6. is_emergency:
    - true only when the conversation contains clear emergency
    warning signs.
    - Otherwise false.

    Return ONLY valid JSON in this exact format:

    {{
    "symptoms": [],
    "duration": null,
    "severity": null,
    "associated_symptoms": [],
    "red_flags": [],
    "is_emergency": false
    }}

    Previous conversation:
    {conversation_history}

    Patient's latest message:
    {last_message}
    """

    prompt = SYMPTOM_ANALYSIS_PROMPT.format(
        conversation_history=conversation_history,
        last_message=last_message,
    )

    response = llm.invoke(prompt)

    content = response.content.strip()

    if content.startswith("```json"):
        content = content[7:]

    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    try:
        data = json.loads(content)

    except json.JSONDecodeError:
        # Safe fallback if LLM returns invalid JSON
        data = {
            "symptoms": [],
            "duration": None,
            "severity": None,
            "associated_symptoms": [],
            "red_flags": [],
            "is_emergency": False,
        }

    extracted_symptoms = data.get("symptoms", [])

    if not isinstance(extracted_symptoms, list):
        extracted_symptoms = []

    old_symptoms = state.get("symptoms", [])

    new_symptoms = [
        symptom
        for symptom in extracted_symptoms
        if symptom not in old_symptoms
    ]

    all_symptoms = old_symptoms.copy()

    for symptom in extracted_symptoms:
        if symptom not in all_symptoms:
            all_symptoms.append(symptom)

    extracted_associated = data.get(
        "associated_symptoms",
        []
    )

    if not isinstance(extracted_associated, list):
        extracted_associated = []

    associated_symptoms = list(
        dict.fromkeys(
            state.get("associated_symptoms", [])
            + extracted_associated
        )
    )

    extracted_red_flags = data.get(
        "red_flags",
        []
    )

    if not isinstance(extracted_red_flags, list):
        extracted_red_flags = []

    red_flags = list(
        dict.fromkeys(
            state.get("red_flags", [])
            + extracted_red_flags
        )
    )


    is_emergency = (
        state.get("is_emergency", False)
        or bool(data.get("is_emergency", False))
    )

    return {
        "symptoms": all_symptoms,
        "new_symptoms": new_symptoms,

        "duration": (
            data.get("duration")
            or state.get("duration")
        ),

        "severity": (
            data.get("severity")
            or state.get("severity")
        ),

        "associated_symptoms": associated_symptoms,

        "red_flags": red_flags,

        "is_emergency": is_emergency,
    }