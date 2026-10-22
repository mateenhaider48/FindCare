
from agents.app.schemas.state import MedicalState


def specialty_router(state: MedicalState) -> str:
    if state.get("is_emergency", False):
        return "emergency_medicine_agent"
    specialty = state.get("specialty") or "general"

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
    elif specialty == "allergy_immunology":
        return "allergy_immunology_agent"
    elif specialty == "infectious_disease":
        return "infectious_disease_agent"
    elif specialty == "nutrition":
        return "nutrition_agent"
    elif specialty == "rehabilitation":
        return "rehabilitation_agent"
    elif specialty == "dentist":
        return "dentist_agent"

    # Newly added specialists

    elif specialty == "obstetrics":
        return "obstetrics_agent"
    elif specialty == "emergency_medicine":
        return "emergency_medicine_agent"
    elif specialty == "general_surgery":
        return "general_surgery_agent"
    elif specialty == "clinical_psychology":
        return "clinical_psychology_agent"
    elif specialty == "neonatology":
        return "neonatology_agent"
    elif specialty == "geriatrics":
        return "geriatrics_agent"
    elif specialty == "andrology":
        return "andrology_agent"
    elif specialty == "addiction_medicine":
        return "addiction_medicine_agent"
    elif specialty == "clinical_pharmacy":
        return "clinical_pharmacy_agent"
    elif specialty == "sleep_medicine":
        return "sleep_medicine_agent"
    elif specialty == "pain_medicine":
        return "pain_medicine_agent"
    elif specialty == "toxicology":
        return "toxicology_agent"

    else:
        return "general_agent"


