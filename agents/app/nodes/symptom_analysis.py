from agents.app.llm import llm
from agents.app.schemas.state import MedicalState
import json


def symptoms_extract_node(state: MedicalState) -> dict:

    """Look at the latest user message and extract symptoms."""

    last_message = state["messages"][-1].content

    SYMPTOM_ANALYSIS_PROMPT = """
        You are a medical symptom extraction assistant.

        Your task is to analyze the patient's latest message and extract the
        symptoms they have mentioned.

        Do NOT diagnose the patient.
        Do NOT suggest treatment or medication.
        Do NOT assume symptoms that the patient did not mention.

        Extract only information that is explicitly present in the patient's
        latest message.

        Return the following information:

        1. symptoms:
        - List of the main symptoms mentioned by the patient.

        2. duration:
        - How long the symptoms have been present.
        - Return null if not mentioned.

        3. severity:
        - Severity such as mild, moderate, severe, or the exact description
          given by the patient.
        - Return null if not mentioned.

        4. associated_symptoms:
        - Other symptoms mentioned along with the main symptoms.
        - Return an empty list if none are mentioned.

        5. red_flags:
        - Identify any potentially serious warning signs explicitly mentioned.
        - Do not diagnose.
        - Return an empty list if no red flags are mentioned.

        6. is_emergency:
        - true only if the latest message contains clear emergency warning signs.
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

        Patient's latest message:
        {last_message}
    """

    prompt = SYMPTOM_ANALYSIS_PROMPT.format(
        last_message=last_message
    )

    response = llm.invoke(prompt)

    content = response.content.strip()

    # Remove markdown code fences if the LLM returns ```json ... ```
    if content.startswith("```json"):
        content = content[7:]

    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    # Convert LLM JSON string into Python dictionary
    data = json.loads(content)

    # ---------------------------------------------------------
    # GET EXTRACTED SYMPTOMS
    # ---------------------------------------------------------

    extracted_symptoms = data.get("symptoms", [])

    # Existing symptoms already stored in state
    old_symptoms = state.get("symptoms", [])

    # ---------------------------------------------------------
    # FIND ONLY GENUINELY NEW SYMPTOMS
    # ---------------------------------------------------------

    new_symptoms = [
        symptom
        for symptom in extracted_symptoms
        if symptom not in old_symptoms
    ]

    # ---------------------------------------------------------
    # MERGE OLD + NEW SYMPTOMS
    # ---------------------------------------------------------

    all_symptoms = old_symptoms.copy()

    for symptom in extracted_symptoms:
        if symptom not in all_symptoms:
            all_symptoms.append(symptom)

    # ---------------------------------------------------------
    # MERGE ASSOCIATED SYMPTOMS
    # ---------------------------------------------------------

    associated_symptoms = list(
        dict.fromkeys(
            state.get("associated_symptoms", [])
            + data.get("associated_symptoms", [])
        )
    )

    # ---------------------------------------------------------
    # MERGE RED FLAGS
    # ---------------------------------------------------------

    red_flags = list(
        dict.fromkeys(
            state.get("red_flags", [])
            + data.get("red_flags", [])
        )
    )

    # ---------------------------------------------------------
    # RETURN UPDATED STATE
    # ---------------------------------------------------------

    return {
        "symptoms": all_symptoms,

        # Only genuinely new symptoms
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

        "is_emergency": (
            state.get("is_emergency", False)
            or data.get("is_emergency", False)
        )
    }
