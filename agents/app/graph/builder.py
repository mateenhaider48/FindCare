from langgraph.graph import START,END,StateGraph
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
from agents.app.specialists.infectious_disease import infectious_disease_agent
from agents.app.specialists.neurosurgery import neurosurgery_agent
from agents.app.specialists.vascular_surgery import vascular_surgery_agent
from agents.app.nodes.response import response_node
from agents.app.nodes.specialty_classification import specialty_classifier_node
from agents.app.nodes.symptom_analysis import symptoms_extract_node
from agents.app.graph.routers import specialty_router
from agents.app.schemas.state import MedicalState
from agents.app.nodes.general_node import general_agent
from agents.app.llm import llm


builder = StateGraph(MedicalState)


builder.add_node("symptom_extraction", symptoms_extract_node)
builder.add_node("specialty_classifier", specialty_classifier_node)
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
builder.add_node("infectious_disease_agent", infectious_disease_agent)
builder.add_node("allergy_immunology_agent", allergy_immunology_agent)
builder.add_node("hepatology_agent", hepatology_agent)
builder.add_node("vascular_surgery_agent", vascular_surgery_agent)
builder.add_node("neurosurgery_agent", neurosurgery_agent)
builder.add_node("general_agent",general_agent)
builder.add_node("response_node",response_node)


#  edges


builder.add_edge(START, "symptom_extraction")
builder.add_edge("symptom_extraction", "specialty_classifier")
# builder.add_edge("conversation_router", "specialty_classifier")
builder.add_conditional_edges("specialty_classifier", specialty_router)


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
builder.add_edge("infectious_disease_agent", "response_node")
builder.add_edge("allergy_immunology_agent", "response_node")
builder.add_edge("hepatology_agent", "response_node")
builder.add_edge("vascular_surgery_agent", "response_node")
builder.add_edge("neurosurgery_agent", "response_node")
builder.add_edge("general_agent","response_node")
builder.add_edge("response_node",END)


app = builder.compile()