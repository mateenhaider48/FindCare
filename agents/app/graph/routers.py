from agents.app.schemas.state import MedicalState
from agents.app.llm import llm

def specialty_router(state: MedicalState) -> str:

    specialty = state["specialty"]

    if specialty == "cardiology":
        return "cardiology_agent"

    elif specialty == "neurology":
        return "neurology_agent"

    elif specialty == "pulmonology":
        return "pulmonology_agent"

    elif specialty == "gastroenterology":
        return "gastroenterology_agent"

    elif specialty == "nephrology":
        return "nephrology_agent"

    elif specialty == "urology":
        return "urology_agent"

    elif specialty == "endocrinology":
        return "endocrinology_agent"

    elif specialty == "dermatology":
        return "dermatology_agent"

    elif specialty == "orthopedics":
        return "orthopedics_agent"

    elif specialty == "rheumatology":
        return "rheumatology_agent"

    elif specialty == "ophthalmology":
        return "ophthalmology_agent"

    elif specialty == "ent":
        return "ent_agent"

    elif specialty == "gynecology":
        return "gynecology_agent"

    elif specialty == "pediatrics":
        return "pediatrics_agent"

    elif specialty == "psychiatry":
        return "psychiatry_agent"

    elif specialty == "hematology":
        return "hematology_agent"

    elif specialty == "oncology":
        return "oncology_agent"

    elif specialty == "hepatology":
        return "hepatology_agent"

    elif specialty == "vascular_surgery":
        return "vascular_surgery_agent"

    elif specialty == "neurosurgery":
        return "neurosurgery_agent"
    else:
        return "general_agent"

def conversation_router(state: MedicalState)-> str:

    active_agent = state.get("active_agent")
    new_symptoms = state.get("new_symptoms", [])

    # First message
    if not active_agent:
        return "specialty_classifier"

    # New symptom detected
    if new_symptoms:
        return "specialty_classifier"

    # No new symptom -> continue current specialist
    return active_agent

