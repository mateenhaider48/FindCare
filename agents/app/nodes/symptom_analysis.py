
import json
import re

from agents.app.llm import llm
from agents.app.schemas.state import MedicalState


ALLOWED_SPECIALTIES = {
    "cardiology", "neurology", "pulmonology", "gastroenterology",
    "nephrology", "urology", "endocrinology", "dermatology",
    "orthopedics", "rheumatology", "ophthalmology", "ent",
    "gynecology", "pediatrics", "psychiatry", "hematology",
    "oncology", "hepatology", "vascular_surgery",
    "allergy_immunology", "infectious_disease", "neurosurgery",
    "general", "obstetrics", "emergency_medicine", "general_surgery",
    "clinical_psychology", "neonatology", "geriatrics", "andrology",
    "addiction_medicine", "clinical_pharmacy", "sleep_medicine",
    "pain_medicine", "toxicology", "nutrition", "rehabilitation",
    "dentist",
}


def _parse_json(content: str) -> dict:
    """LLM output se JSON safely parse karo."""
    content = content.strip()
    content = re.sub(r"^```(?:json)?\s*", "", content)
    content = re.sub(r"\s*```$", "", content)

    try:
        data = json.loads(content)
        return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, TypeError):
        return {}


def _string_list(value) -> list[str]:
    if not isinstance(value, list):
        return []

    return list(dict.fromkeys(
        item.strip()
        for item in value
        if isinstance(item, str) and item.strip()
    ))


def symptoms_extract_node(state: MedicalState) -> dict:
    messages = state.get("messages", [])

    if not messages:
        return {
            "specialty": state.get("specialty") or "general",
            "active_agent": state.get("active_agent") or "general_agent",
        }

    last_message = messages[-1].content

    conversation_history = "\n".join(
        f"{type(message).__name__}: {message.content}"
        for message in messages
    )

    prompt = f"""
You are a medical intake and specialty-routing assistant.

Analyze the patient's latest message using the conversation history.
Extract only information stated or clearly confirmed by the patient.
Do not diagnose, prescribe, or invent patient information.

Return ONE valid JSON object with exactly these keys:
{{
  "symptoms": [],
  "duration": null,
  "severity": null,
  "associated_symptoms": [],
  "red_flags": [],
  "is_emergency": false,
  "specialty": "general"
}}

Rules:
- symptoms: main symptoms reported or clearly confirmed.
- duration: string or null.
- severity: string or null.
- associated_symptoms: list of additional reported symptoms.
- red_flags: list of explicitly reported potentially serious warning signs.
- is_emergency: true only if clear emergency warning signs are described.
  Do not treat false as proof that an emergency is absent.
- specialty: select exactly one specialty from the allowed list below.
- For possible poisoning or overdose, choose toxicology or emergency_medicine
  according to the immediate concern.
- For potentially life-threatening symptoms, prioritize emergency_medicine.
- If the complaint does not clearly fit a specialty, choose general.
- Use conversation history to understand short replies such as "haan",
  "nahi", "yehi", or answers to earlier questions.
- Do not treat an assistant's question as a symptom confirmed by the patient.
- Do not repeat an old symptom as a new symptom unless the latest message
  confirms it or provides relevant new information.
- Return JSON only, with no markdown or explanation.

Allowed specialties:
{", ".join(sorted(ALLOWED_SPECIALTIES))}

Conversation history:
{conversation_history}

Latest patient message:
{last_message}
"""

    response = llm.invoke(prompt)
    data = _parse_json(response.content)

    # Invalid output: preserve existing state and use safe routing fallback.
    # This fallback is NOT an emergency assessment.
    if not data or not isinstance(data.get("is_emergency"), bool):
        return {
            "specialty": state.get("specialty") or "general",
            "active_agent": state.get("active_agent") or "general_agent",
            "is_emergency": state.get("is_emergency", False),
        }

    old_symptoms = _string_list(state.get("symptoms", []))
    extracted_symptoms = _string_list(data.get("symptoms", []))

    all_symptoms = list(dict.fromkeys(old_symptoms + extracted_symptoms))
    new_symptoms = [
        item for item in extracted_symptoms
        if item not in old_symptoms
    ]

    old_associated = _string_list(state.get("associated_symptoms", []))
    extracted_associated = _string_list(data.get("associated_symptoms", []))
    associated_symptoms = list(dict.fromkeys(
        old_associated + extracted_associated
    ))

    old_red_flags = _string_list(state.get("red_flags", []))
    extracted_red_flags = _string_list(data.get("red_flags", []))
    red_flags = list(dict.fromkeys(old_red_flags + extracted_red_flags))

    specialty = data.get("specialty")
    if not isinstance(specialty, str):
        specialty = "general"

    specialty = specialty.strip().lower()
    if specialty not in ALLOWED_SPECIALTIES:
        specialty = "general"

    duration = data.get("duration")
    if not isinstance(duration, str) or not duration.strip():
        duration = state.get("duration")

    severity = data.get("severity")
    if not isinstance(severity, str) or not severity.strip():
        severity = state.get("severity")

    is_emergency = (
        state.get("is_emergency", False)
        or data["is_emergency"]
    )

    return {
        "symptoms": all_symptoms,
        "new_symptoms": new_symptoms,
        "duration": duration,
        "severity": severity,
        "associated_symptoms": associated_symptoms,
        "red_flags": red_flags,
        "is_emergency": is_emergency,
        "specialty": specialty,
        "active_agent": f"{specialty}_agent",
    }
