from agents.app.llm import llm
from agents.app.schemas.state import MedicalState


def specialty_classifier_node(state: MedicalState) -> dict:


    symptoms = state["symptoms"]
    duration = state["duration"]
    severity = state["severity"]
    associated_symptoms = state["associated_symptoms"]

    prompt = f"""
    You are a medical specialty classification assistant.

    Your task is to select the ONE most relevant medical specialty
    based on the patient's symptoms.

    Do NOT diagnose the patient.
    Do NOT suggest treatment or medication.

    Choose ONLY ONE specialty from the following list:

    - cardiology
    - neurology
    - pulmonology
    - gastroenterology
    - nephrology
    - urology
    - endocrinology
    - dermatology
    - orthopedics
    - rheumatology
    - ophthalmology
    - ent
    - gynecology
    - pediatrics
    - psychiatry
    - hematology
    - oncology
    - hepatology
    - vascular_surgery
    - allergy_immunology
    - infection_disease
    - neurosurgery
    - general


    SPECIALTY GUIDELINES:

    Cardiology:
    Heart and cardiovascular problems such as chest discomfort,
    palpitations, irregular heartbeat, blood-pressure-related symptoms,
    or circulation concerns primarily related to the heart.

    Neurology:
    Brain and nervous-system problems such as headaches, seizures,
    numbness, weakness, dizziness, confusion, tremors, or coordination
    problems.

    Pulmonology:
    Lung and respiratory problems such as cough, wheezing,
    shortness of breath, or breathing difficulties.

    Gastroenterology:
    Digestive-system problems such as abdominal pain, nausea,
    vomiting, diarrhea, constipation, indigestion, or heartburn.

    Nephrology:
    Kidney-related problems such as kidney disease, abnormal kidney
    function, or kidney-related laboratory abnormalities.

    Urology:
    Urinary-system problems involving urination, bladder, prostate,
    or urinary tract.

    Endocrinology:
    Hormonal and metabolic problems such as diabetes, thyroid disorders,
    or other hormone-related conditions.

    Dermatology:
    Skin, hair, and nail problems such as rashes, itching, acne,
    skin lesions, or hair loss.

    Orthopedics:
    Bones, joints, muscles, fractures, injuries, and musculoskeletal
    problems.

    Rheumatology:
    Inflammatory joint diseases, arthritis, autoimmune conditions,
    and connective-tissue disorders.

    Ophthalmology:
    Eye and vision problems such as eye pain, vision changes,
    red eyes, or other eye-related symptoms.

    ENT:
    Ear, nose, throat, sinus, hearing, swallowing, or voice problems.

    Gynecology:
    Female reproductive-system problems.

    Pediatrics:
    Medical problems primarily involving children.

    Psychiatry:
    Mental-health, mood, anxiety, behavioral, or psychiatric symptoms.

    Hematology:
    Blood-related disorders, abnormal blood counts, clotting,
    or bleeding problems.

    Oncology:
    Known cancer or symptoms being evaluated specifically in relation
    to cancer.

    Hepatology:
    Liver and biliary-system problems.

    Vascular Surgery:
    Problems involving arteries, veins, blood vessels, or circulation
    outside the heart.

    Neurosurgery:
    Brain, spine, or peripheral-nerve conditions that may require
    surgical evaluation.

    General:
    Use when the symptoms do not clearly fit one specialty.


    PATIENT INFORMATION:

    Symptoms:
    {symptoms}

    Duration:
    {duration}

    Severity:
    {severity}

    Associated symptoms:
    {associated_symptoms}


    Return ONLY ONE value from this list:

    cardiology
    neurology
    pulmonology
    gastroenterology
    nephrology
    urology
    endocrinology
    dermatology
    orthopedics
    rheumatology
    ophthalmology
    ent
    gynecology
    pediatrics
    psychiatry
    hematology
    oncology
    hepatology
    vascular_surgery
    neurosurgery
    general

    Do not return any explanation.
    """


    response = llm.invoke(prompt)

    specialty = response.content.strip().lower()


    allowed_specialties = {
        "cardiology",
        "neurology",
        "pulmonology",
        "gastroenterology",
        "nephrology",
        "urology",
        "endocrinology",
        "dermatology",
        "orthopedics",
        "rheumatology",
        "ophthalmology",
        "ent",
        "gynecology",
        "pediatrics",
        "psychiatry",
        "hematology",
        "oncology",
        "hepatology",
        "vascular_surgery",
        "neurosurgery",
        "general",
    }


    if specialty not in allowed_specialties:
        specialty = "general"


    return {
        "specialty": specialty,
        "active_agent": f"{specialty}_agent"
    }
