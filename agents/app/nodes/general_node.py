from agents.app.llm import llm
from agents.app.schemas.state import MedicalState

def general_agent(state: MedicalState):

    last_message = state["messages"][-1].content

    prompt = f"""
You are the general-purpose assistant of FindCare.

Your job is to answer the user's questions naturally and helpfully.

The user can ask about ANY topic, including:
- Programming
- AI / Machine Learning
- Science
- Mathematics
- Technology
- History
- Education
- Writing
- General knowledge
- Casual conversation
- Productivity
- Explanations
- Any other topic

Do not restrict yourself to a predefined list of topics.

Rules:
- Understand the user's actual question.
- Answer directly and naturally.
- Keep the explanation appropriate to the user's level.
- If the user asks for code, provide practical code.
- If the user asks for an explanation, explain it clearly.
- If the user asks a follow-up question, use the previous conversation context.
- Do not mention that you are a "general agent".
- Do not unnecessarily redirect the user.
- Do not turn a general question into a medical question.

User message:
{last_message}

Provide the best possible answer.
"""

    response = llm.invoke(prompt)

    return {
        "final_response": response.content
    }