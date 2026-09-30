
from agents.app.llm import llm
from agents.app.schemas.state import MedicalState
from langchain_core.messages import HumanMessage,AIMessage

def response_node(state: MedicalState) -> dict:

    specialist_response = state["final_response"]

    # Latest patient message
    last_user_message = ""

    for message in reversed(state["messages"]):
        if isinstance(message, HumanMessage):
            last_user_message = message.content
            break

    prompt = f"""
        You are a medical response formatting assistant.

        The specialist medical agent has already analyzed the patient's
        information and generated the response below.

        SPECIALIST RESPONSE:
        {specialist_response}

        PATIENT'S LATEST MESSAGE:
        {last_user_message}

        Your ONLY job is to convert the specialist response into a SHORT,
        natural, patient-friendly response suitable for a voice assistant.

        IMPORTANT MEDICAL RULES:

        - Preserve the medical meaning of the specialist response.
        - Do not perform your own medical analysis.
        - Do not add new medical information.
        - Do not remove important medical safety information.
        - Do not change the level of certainty expressed by the specialist.
        - If the specialist says something is possible or suspected,
        keep it uncertain.
        - Do not turn a possible condition into a confirmed diagnosis.
        - Do not invent symptoms, diagnoses, medicines, test results,
        medical history, or recommendations.
        - Do not prescribe medication or dosage.
        - Do not tell the patient to start, stop, or change medication.
        - If urgent or emergency advice is present in the specialist response,
        keep that advice clearly visible.

        LANGUAGE RULES:

        - Respond in the SAME language as the patient's latest message.
        - The patient's latest message has higher priority than older messages.
        - If the latest message is clearly in English, respond ONLY in English.
        - If the latest message is clearly in Roman Urdu, respond ONLY in natural
        Roman Urdu.
        - If the latest message is clearly in Urdu script, respond ONLY in Urdu script.
        - If the latest message is in another language, respond in that language
        when possible.
        - If the patient mixes languages, naturally match the same mixed-language style.
        - Do not switch languages unless the patient switches languages.
        - Do not translate the response into another language.
        - Do not use Hindi vocabulary or Hindi-style sentence patterns when
        responding in Pakistani Roman Urdu.
        - Do not force Roman Urdu when the patient is speaking English or Urdu script.
        - Preserve the patient's natural communication style.

        SHORT RESPONSE RULES:

        - Keep the response SHORT and voice-friendly.
        - Normally respond in 20-45 words.
        - Do NOT exceed 50 words unless important medical safety information
        must be included.
        - Use 1-3 short sentences.
        - Ask no more than 2 important questions.
        - If only one question is needed, ask only one question.
        - Do not repeat information the patient has already provided.
        - Do not summarize the entire conversation.
        - Do not give long medical explanations.
        - Do not add unnecessary medical background.
        - Get directly to the point.

        FORMAT RULES:

        - Return ONLY ONE SINGLE PARAGRAPH.
        - Do NOT use bullet points.
        - Do NOT use numbered lists.
        - Do NOT use headings.
        - Do NOT use markdown.
        - Keep the response natural and conversational.
        - Medical terms such as ECG, blood pressure, heart rate, MRI,
        CT scan, etc. may remain in English when appropriate.

        IMPORTANT:

        The specialist response is the source of truth for medical content.

        Your job is ONLY to:
        1. Preserve the specialist's medical meaning.
        2. Make the response shorter and more conversational.
        3. Match the patient's latest language.
        4. Keep important safety information.

        Do NOT introduce your own medical interpretation.

        Return ONLY the final patient-facing response.
        """

    response = llm.invoke(prompt)

    return {
        "final_response": response.content.strip()
    }
