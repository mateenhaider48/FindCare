from typing import TypedDict,Annotated
from langgraph.graph.message import add_messages



class MedicalState(TypedDict):
   
    messages : Annotated[list,add_messages]
    symptoms: list[str]
    new_symptoms: list[str]
    duration: str | None
    severity: str | None
    associated_symptoms: list[str]
    red_flags: list[str]
    is_emergency: bool
    specialty: str | None
    active_agent: str | None
    final_response: str | None
