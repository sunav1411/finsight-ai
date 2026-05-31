from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from pydantic import BaseModel

from app.forecast import (
    predict_expense
)

from app.insights import (
    generate_insights
)

from app.anomaly import (
    detect_anomalies
)

from app.recommendations import (
    generate_recommendations
)

from app.chat_engine import (
    generate_chat_response
)

from app.category_intelligence import (
    analyze_categories
)

from app.trend_analysis import (
    analyze_trends
)

from app.burn_rate import (
    analyze_burn_rate
)

from app.smart_alerts import (
    generate_smart_alerts
)

app = FastAPI()


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==================================================
# REQUEST MODELS
# ==================================================

class ExpenseItem(
    BaseModel
):

    amount: float

    category: str

    date: str


class ExpenseRequest(
    BaseModel
):

    expenses: list[
        ExpenseItem
    ]

    budget: float = 0


# ==================================================
# CHAT REQUEST MODEL
# ==================================================

class ChatRequest(
    BaseModel
):

    message: str

    expenses: list[
        ExpenseItem
    ]

    budget: float = 0


# ==================================================
# HOME ROUTE
# ==================================================

@app.get("/")
def home():

    return {
        "message":
        "FinSight AI Engine Running"
    }


# ==================================================
# AI PREDICTION ROUTE
# ==================================================

@app.post("/predict")
def predict(
    request: ExpenseRequest
):

    prediction = (
        predict_expense(
            request.expenses
        )
    )

    insights = (
        generate_insights(
            request.expenses
        )
    )

    anomalies = (
        detect_anomalies(
            request.expenses
        )
    )

    recommendations = (
        generate_recommendations(
            request.expenses
        )
    )

    category_analysis = (
        analyze_categories(
            request.expenses
        )
    )

    trend_analysis = (
        analyze_trends(
            request.expenses
        )
    )

    burn_rate = (
        analyze_burn_rate(

            request.expenses,

            request.budget
        )
    )

    smart_alerts = (
        generate_smart_alerts(

            request.expenses,

            request.budget
        )
    )

    return {

        "prediction":
            prediction,

        "insights":
            insights,

        "recommendations":
            recommendations,

        "anomalies":
            anomalies,

        "category_analysis":
            category_analysis,

        "trend_analysis":
            trend_analysis,

        "burn_rate":
            burn_rate,

        "smart_alerts":
            smart_alerts
    }


# ==================================================
# AI CHAT ROUTE
# ==================================================

@app.post("/chat")
def chat(
    request: ChatRequest
):

    response = (
        generate_chat_response(

            request.message,

            request.expenses,

            request.budget
        )
    )

    return {

        "response":
            response
    }
