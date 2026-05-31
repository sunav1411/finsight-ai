import os

from groq import Groq

from dotenv import load_dotenv


load_dotenv()


client = Groq(

    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)


def ask_gemini(prompt):

    try:

        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[

                {
                    "role": "system",

                    "content":

 "You are FIA, the AI financial copilot of FinSight AI. "
"Your job is to provide concise, high-impact financial "
"insights using the user's real expense analytics. "
"Speak like a premium fintech product, not a generic chatbot. "
"Keep responses under 120 words unless detailed analysis is requested. "
"Avoid unnecessary greetings, filler, motivational fluff, "
"or excessive questions. "
"Prioritize actionable insights, spending risks, burn rate analysis, "
"budget optimization, and financial behavior patterns. "
"Sound confident, analytical, and intelligent."
                },

                {
                    "role": "user",

                    "content": prompt
                }
            ]
        )

        return (

            completion
            .choices[0]
            .message.content
        )

    except Exception as e:

        return (
            f"AI engine error: {str(e)}"
        )