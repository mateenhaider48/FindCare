from dotenv import load_dotenv
from langchain_core.messages import HumanMessage,AIMessage
load_dotenv()
from agents.app.graph.builder import app
print("Enter exit to exit.")

state = {
    "messages": [],
    "symptoms": [],
    "new_symptoms":[],
    "duration": None,
    "severity": None,
    "associated_symptoms": [],
    "red_flags": [],
    "is_emergency": False,
    "specialty": None,
    "active_agent": None,
    "final_response": None,
}

while True:

    query = input("User: ")

    if query.lower() == "exit":
        break

    state["messages"].append(
        HumanMessage(content=query)
    )

    result = app.invoke(state)

    state = result

    print("Agent:", result.get("final_response"))

    if result.get("final_response"):
        state["messages"].append(
            AIMessage(content=result["final_response"])
        )

