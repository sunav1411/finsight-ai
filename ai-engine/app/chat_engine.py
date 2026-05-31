"""
chat_engine.py
──────────────
FIA — AI Financial Copilot for FinSight AI.
Handles intent routing, local rule-based responses,
and falls back to Gemini for open-ended financial queries.
"""

from app.category_intelligence import analyze_categories
from app.trend_analysis import analyze_trends
from app.burn_rate import analyze_burn_rate
from app.gemini_engine import ask_gemini


# ─────────────────────────────────────────────────────────────────────────────
# INTENT VOCABULARY
# ─────────────────────────────────────────────────────────────────────────────

GREETINGS = {"hi", "hello", "hey", "hii", "yo", "hola"}

THANKS = {"thanks", "thank you", "thx", "ty"}

FAREWELLS = {"bye", "goodbye", "see you", "take care"}

FINANCE_KEYWORDS = {
    "money", "expense", "budget", "saving", "savings",
    "spending", "finance", "transaction", "cash", "income",
    "overspending", "risk", "burn", "forecast", "shopping",
    "food", "bills", "salary", "monthly", "category",
}

SAVINGS_KEYWORDS = {
    "remaining budget", "budget left", "money left",
    "remaining money", "remaining balance", "how much left",
    "my savings", "savings left", "budget usage",
    "remaining budget amount", "how much saved", "remaining",
}

RISK_KEYWORDS = {
    "risk", "overspending", "burn rate", "exceed budget",
    "budget risk", "spending pace", "am i safe",
}

CATEGORY_KEYWORDS = {"category", "categories", "top spending"}

TOP_CATEGORY_KEYWORDS = {
    "where am i spending", "highest spending", "top category",
}

TREND_KEYWORDS = {
    "trend", "increase", "decrease", "this month", "last month",
}

TOTAL_KEYWORDS = {"total spent", "total expenses", "total spending"}


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def _contains_any(text: str, keywords: set) -> bool:
    """Return True if any keyword from the set appears in text."""
    return any(kw in text for kw in keywords)


def _build_gemini_context(
    message: str,
    total_spent: float,
    budget: float,
    dominant: dict | None,
    categories: list,
    burn_rate: dict,
    trend_data: dict,
) -> str:
    """Assemble the full prompt context sent to Gemini."""
    dominant_category = dominant["category"] if dominant else "Unknown"

    return f"""
You are FIA, the premium AI financial copilot inside FinSight AI.

Personality: intelligent, confident, strategic, conversational,
insightful, emotionally aware, premium fintech assistant.

Rules:
- Never sound robotic or generic
- Never repeat the user's exact wording
- Give actionable, data-driven advice
- Use real financial figures from the summary below
- Keep responses concise with short paragraphs
- Use bullet points only when it aids clarity
- Sound like a premium fintech AI — not a chatbot

Financial Summary:
  Total Spending   : ₹{total_spent:,.2f}
  Budget           : ₹{budget:,.2f}
  Dominant Category: {dominant_category}
  Categories       : {categories}
  Burn Rate        : {burn_rate}
  Trend Analysis   : {trend_data}

User Question: {message}
""".strip()


# ─────────────────────────────────────────────────────────────────────────────
# RULE-BASED RESPONSE HANDLERS
# ─────────────────────────────────────────────────────────────────────────────

def _handle_greeting(has_expenses: bool, total_spent: float, budget: float) -> str:
    if has_expenses:
        return (
            f"Hey, I'm FIA — your AI financial copilot inside FinSight AI.\n\n"
            f"You've spent ₹{total_spent:,.2f} of your ₹{budget:,.2f} budget so far.\n\n"
            "I can help you optimize savings, analyze spending behavior, "
            "detect financial risks, and sharpen your money strategy.\n\n"
            "What would you like to dig into?"
        )
    return (
        "Hey, I'm FIA — your financial intelligence assistant inside FinSight AI.\n\n"
        "Start adding expenses and I'll help you analyze spending patterns, "
        "optimize savings, track financial risks, and improve budgeting."
    )


def _handle_thanks(has_expenses: bool) -> str:
    if has_expenses:
        return (
            "You're welcome. Staying consistent with controlled spending "
            "will make the biggest difference over time — you're on the right track."
        )
    return (
        "You're welcome. Once you start tracking expenses, "
        "I'll generate deeper financial insights and recommendations."
    )


def _handle_farewell() -> str:
    return "Take care. FIA will be here whenever you want to review your finances again."


def _handle_no_expenses() -> str:
    return (
        "I don't have enough financial data yet.\n\n"
        "Add some expenses first so I can generate real spending insights, "
        "savings analysis, budget forecasts, and personalized recommendations."
    )


def _handle_savings(total_spent: float, budget: float) -> str:
    if budget <= 0:
        return "Set a monthly budget first to unlock savings and budget analysis."

    remaining = max(budget - total_spent, 0)
    usage_pct = round((total_spent / budget) * 100, 1)
    savings_pct = round((remaining / budget) * 100, 1)

    return (
        f"Budget used       : {usage_pct}%\n"
        f"Remaining balance : ₹{remaining:,.2f}\n"
        f"Savings margin    : {savings_pct}% of your total budget."
    )


def _handle_risk(burn_rate: dict) -> str:
    if "message" in burn_rate:
        return burn_rate["message"]

    projected = burn_rate.get("projected_spending", 0)
    remaining_projection = burn_rate.get("remaining_projection", 0)

    if burn_rate.get("status") == "risk":
        return (
            f"Warning: your current spending pace may exceed your budget "
            f"by ₹{abs(remaining_projection):,.2f} before month-end.\n\n"
            "Recommended actions:\n"
            "  • Cut non-essential purchases immediately\n"
            "  • Slow discretionary spending for the rest of the month\n"
            "  • Prioritize bills and fixed essentials"
        )

    return (
        f"Your spending pace is currently stable.\n\n"
        f"Projected monthly spend: ₹{projected:,.2f}."
    )


def _handle_top_category(dominant: dict | None) -> str:
    if not dominant:
        return "Not enough expense data to identify a dominant category yet."

    return (
        f"Your highest spending category is {dominant['category']}.\n\n"
        f"  Amount spent  : ₹{dominant['amount']:,.2f}\n"
        f"  Category share: {dominant['percentage']}%\n\n"
        "This category has the strongest impact on your monthly financial behavior."
    )


def _handle_category_breakdown(categories: list) -> str:
    if not categories:
        return "No category analytics available yet."

    lines = [f"  • {item['category']} — {item['percentage']}%" for item in categories[:3]]
    return "Top spending categories:\n\n" + "\n".join(lines)


def _handle_trends(trend_data: dict) -> str:
    if "message" in trend_data:
        return trend_data["message"]

    overall = trend_data.get("overall_change_percent", 0)
    previous_month = trend_data.get("previous_month", "last month")
    direction = "increased" if overall >= 0 else "decreased"

    response = (
        f"Your spending has {direction} by {abs(overall):.1f}% "
        f"compared to {previous_month}."
    )

    category_changes = trend_data.get("category_changes", [])
    if category_changes:
        top = category_changes[0]
        response += (
            f"\n\nLargest movement: {top['category']} "
            f"({top['change_percent']:+.1f}%)."
        )

    return response


def _handle_total(total_spent: float) -> str:
    return f"Your total recorded spending is ₹{total_spent:,.2f}."


def _handle_off_topic() -> str:
    return (
        "I'm designed for financial intelligence inside FinSight AI.\n\n"
        "Ask me about budgeting, spending habits, savings, "
        "financial risks, expense tracking, or money management."
    )


def _handle_gemini_fallback(
    message: str,
    total_spent: float,
    budget: float,
    dominant: dict | None,
    categories: list,
    burn_rate: dict,
    trend_data: dict,
) -> str:
    context = _build_gemini_context(
        message, total_spent, budget, dominant, categories, burn_rate, trend_data
    )
    ai_response = ask_gemini(context)
    if ai_response:
        return ai_response
    return (
        "FIA services are temporarily unavailable.\n\n"
        "Financial analytics and monitoring are still active."
    )


# ─────────────────────────────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def generate_chat_response(
    message: str,
    expenses: list,
    budget: float = 0,
) -> str:
    """
    Route the user message to the appropriate handler.

    Priority order:
      1. Simple social messages (greetings, thanks, farewells)
      2. Empty data guard
      3. Rule-based financial intents (savings, risk, categories, trends, totals)
      4. Off-topic guard
      5. Gemini AI fallback for open-ended financial queries
    """
    msg = message.lower().strip()

    # ── Analytics ────────────────────────────────────────────────────────────
    category_data = analyze_categories(expenses)
    total_spent   = category_data["total_spent"]
    dominant      = category_data["dominant_category"]
    categories    = category_data["categories"]

    trend_data = analyze_trends(expenses)
    burn_rate  = analyze_burn_rate(expenses, budget)
    has_expenses = len(expenses) > 0

    # ── Social intents ───────────────────────────────────────────────────────
    if msg in GREETINGS:
        return _handle_greeting(has_expenses, total_spent, budget)

    if msg in THANKS:
        return _handle_thanks(has_expenses)

    if msg in FAREWELLS:
        return _handle_farewell()

    # ── Empty data guard ─────────────────────────────────────────────────────
    if not has_expenses and _contains_any(msg, FINANCE_KEYWORDS):
        return _handle_no_expenses()

    # ── Financial intents ─────────────────────────────────────────────────────
    if _contains_any(msg, SAVINGS_KEYWORDS):
        return _handle_savings(total_spent, budget)

    if _contains_any(msg, RISK_KEYWORDS):
        return _handle_risk(burn_rate)

    if _contains_any(msg, TOP_CATEGORY_KEYWORDS):
        return _handle_top_category(dominant)

    if _contains_any(msg, CATEGORY_KEYWORDS):
        return _handle_category_breakdown(categories)

    if _contains_any(msg, TREND_KEYWORDS):
        return _handle_trends(trend_data)

    if _contains_any(msg, TOTAL_KEYWORDS):
        return _handle_total(total_spent)

    # ── Off-topic guard ───────────────────────────────────────────────────────
    if not _contains_any(msg, FINANCE_KEYWORDS):
        return _handle_off_topic()

    # ── Gemini AI fallback ────────────────────────────────────────────────────
    return _handle_gemini_fallback(
        message, total_spent, budget, dominant, categories, burn_rate, trend_data
    )
