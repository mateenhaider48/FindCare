from langgraph.graph import START,END,StateGraph
from agents.app.schemas.state import MedicalState
from agents.app.specialists.cardiology import cardiology_agent
from agents.app.specialists.neurology import neurology_agent
from agents.app.specialists.pulmonology import pulmonology_agent
from agents.app.specialists.gastroenterology import gastroenterology_agent
from agents.app.specialists.nephrology import nephrology_agent
from agents.app.specialists.urology import urology_agent
from agents.app.specialists.endocrinology import endocrinology_agent
from agents.app.specialists.rheumatology import rheumatology_agent
from agents.app.specialists.dermatology import dermatology_agent
from agents.app.specialists.orthopedics import orthopedics_agent
from agents.app.specialists.ophthalmology import ophthalmology_agent
from agents.app.specialists.ent import ent_agent
from agents.app.specialists.gynecology import gynecology_agent
from agents.app.specialists.hematology import hematology_agent
from agents.app.specialists.hepatology import hepatology_agent
from agents.app.specialists.oncology import oncology_agent
from agents.app.specialists.pediatrics import pediatrics_agent
from agents.app.specialists.psychiatry import psychiatry_agent
from agents.app.specialists.allergy_immunology import allergy_immunology_agent
from agents.app.specialists.neurosurgery import neurosurgery_agent
from agents.app.specialists.vascular_surgery import vascular_surgery_agent
from agents.app.nodes.general_node import general_agent
from agents.app.nodes.response import response_node
from agents.app.nodes.symptom_analysis import symptoms_extract_node
from agents.app.graph.routers import specialty_router
from agents.app.specialists.rehabilitation import rehabilitation_agent
from agents.app.specialists.dentist import dental_agent
from agents.app.specialists.nutrition import nutrition_agent
from agents.app.specialists.obstetrics import obstetrics_agent
from agents.app.specialists.addiction_medicine import addiction_medicine_agent
from agents.app.specialists.clinical_pharmacy import clinical_pharmacy_agent
from agents.app.specialists.sleep_medicine import sleep_medicine_agent
from agents.app.specialists.pain_medicine import pain_medicine_agent
# from agents.app.specialists.toxicology import toxicology_agent
from agents.app.specialists.clinical_psychology import clinical_psychology_agent
from agents.app.specialists.neonatology import neonatology_agent
# from agents.app.specialists.geriatrics import geriatrics_agent
# from agents.app.specialists.andrology import andrology_agent
from agents.app.specialists.emergency_medicine import emergency_medicine_agent
# from agents.app.specialists.general_surgery import general_surgery_agent
from agents.app.llm import llm


builder = StateGraph(MedicalState)
import time

def timed_node(node_name, node_function):
    def wrapper(state):
        start = time.perf_counter()

        result = node_function(state)

        elapsed = time.perf_counter() - start
        print(f"[TIMING] {node_name}: {elapsed:.2f}s")

        return result

    return wrapper

builder.add_node(
    "symptom_extraction",
    timed_node("symptom_extraction", symptoms_extract_node)
)
builder.add_node("cardiology_agent", cardiology_agent)
builder.add_node("neurology_agent", neurology_agent)
builder.add_node("pulmonology_agent", pulmonology_agent)
builder.add_node("gastroenterology_agent", gastroenterology_agent)
builder.add_node("nephrology_agent", nephrology_agent)
builder.add_node("urology_agent", urology_agent)
builder.add_node("endocrinology_agent", endocrinology_agent)
builder.add_node("dermatology_agent", dermatology_agent)
builder.add_node("orthopedics_agent", orthopedics_agent)
builder.add_node("rheumatology_agent", rheumatology_agent)
builder.add_node("ophthalmology_agent", ophthalmology_agent)
builder.add_node("ent_agent", ent_agent)
builder.add_node("gynecology_agent", gynecology_agent)
builder.add_node("pediatrics_agent", pediatrics_agent)
builder.add_node("psychiatry_agent", psychiatry_agent)
builder.add_node("hematology_agent", hematology_agent)
builder.add_node("oncology_agent", oncology_agent)
builder.add_node("allergy_immunology_agent", allergy_immunology_agent)
builder.add_node("hepatology_agent", hepatology_agent)
builder.add_node("vascular_surgery_agent", vascular_surgery_agent)
builder.add_node("neurosurgery_agent", neurosurgery_agent)
builder.add_node("nutrition_agent", nutrition_agent)
builder.add_node("rehabilitation_agent", rehabilitation_agent)
builder.add_node("dentist_agent", dental_agent)
builder.add_node("general_agent",general_agent)
builder.add_node("obstetrics_agent", obstetrics_agent)
builder.add_node("emergency_medicine_agent", emergency_medicine_agent)
# builder.add_node("general_surgery_agent", general_surgery_agent)
builder.add_node("clinical_psychology_agent", clinical_psychology_agent)
builder.add_node("neonatology_agent", neonatology_agent)
# builder.add_node("geriatrics_agent", geriatrics_agent)
# builder.add_node("andrology_agent", andrology_agent)
builder.add_node("addiction_medicine_agent", addiction_medicine_agent)
builder.add_node("clinical_pharmacy_agent", clinical_pharmacy_agent)
builder.add_node("sleep_medicine_agent", sleep_medicine_agent)
builder.add_node("pain_medicine_agent", pain_medicine_agent)
# builder.add_node("toxicology_agent", toxicology_agent)
builder.add_node("response_node",response_node)



#  edges


builder.add_edge(START, "symptom_extraction")
builder.add_conditional_edges("symptom_extraction", specialty_router)


builder.add_edge("cardiology_agent", "response_node")
builder.add_edge("neurology_agent", "response_node")
builder.add_edge("pulmonology_agent","response_node")
builder.add_edge("gastroenterology_agent", "response_node")
builder.add_edge("nephrology_agent", "response_node")
builder.add_edge("urology_agent", "response_node")
builder.add_edge("endocrinology_agent", "response_node")
builder.add_edge("dermatology_agent", "response_node")
builder.add_edge("orthopedics_agent", "response_node")
builder.add_edge("rheumatology_agent", "response_node")
builder.add_edge("ophthalmology_agent", "response_node")
builder.add_edge("ent_agent", "response_node")
builder.add_edge("gynecology_agent", "response_node")
builder.add_edge("pediatrics_agent", "response_node")
builder.add_edge("psychiatry_agent", "response_node")
builder.add_edge("hematology_agent", "response_node")
builder.add_edge("oncology_agent", "response_node")
builder.add_edge("allergy_immunology_agent", "response_node")
builder.add_edge("hepatology_agent", "response_node")
builder.add_edge("vascular_surgery_agent", "response_node")
builder.add_edge("neurosurgery_agent", "response_node")
builder.add_edge("nutrition_agent", "response_node")
builder.add_edge("dentist_agent", "response_node")
builder.add_edge("rehabilitation_agent", "response_node")
builder.add_edge("general_agent","response_node")
builder.add_edge("obstetrics_agent", "response_node")
builder.add_edge("emergency_medicine_agent", "response_node")
# builder.add_edge("general_surgery_agent", "response_node")
builder.add_edge("clinical_psychology_agent", "response_node")
builder.add_edge("neonatology_agent", "response_node")
# builder.add_edge("geriatrics_agent", "response_node")
# builder.add_edge("andrology_agent", "response_node")
builder.add_edge("addiction_medicine_agent", "response_node")
builder.add_edge("clinical_pharmacy_agent", "response_node")
builder.add_edge("sleep_medicine_agent", "response_node")
builder.add_edge("pain_medicine_agent", "response_node")
# builder.add_edge("toxicology_agent", "response_node")
builder.add_edge("response_node",END)


app = builder.compile()