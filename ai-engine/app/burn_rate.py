from datetime import datetime


def analyze_burn_rate(
    expenses,
    budget=0
):

    if budget <= 0:

        return {
            "message":
            "Budget not configured."
        }

    # =====================================
    # CURRENT DATE
    # =====================================

    today = datetime.today()

    current_month = (
        today.month
    )

    current_year = (
        today.year
    )

    # =====================================
    # FILTER CURRENT MONTH EXPENSES
    # =====================================

    current_expenses = []

    for expense in expenses:

        try:

            expense_date = (
                datetime.strptime(
                    expense.date,
                    "%Y-%m-%d"
                )
            )

        except:

            continue

        if (
            expense_date.month ==
            current_month
            and
            expense_date.year ==
            current_year
        ):

            current_expenses.append(
                float(expense.amount)
            )

    # =====================================
    # TOTAL SPENT
    # =====================================

    total_spent = sum(
        current_expenses
    )

    # =====================================
    # DAYS PASSED
    # =====================================

    days_passed = max(
        today.day,
        1
    )

    # =====================================
    # DAILY AVERAGE
    # =====================================

    daily_average = (
        total_spent /
        days_passed
    )

    # =====================================
    # PROJECTED MONTH SPENDING
    # =====================================

    projected_spending = (
        daily_average * 30
    )

    # =====================================
    # REMAINING BUDGET
    # =====================================

    remaining = (
        budget -
        projected_spending
    )

    status = (
        "safe"
        if remaining >= 0
        else "risk"
    )

    return {

        "status":
            status,

        "total_spent":
            round(
                total_spent,
                2
            ),

        "daily_average":
            round(
                daily_average,
                2
            ),

        "projected_spending":
            round(
                projected_spending,
                2
            ),

        "remaining_projection":
            round(
                remaining,
                2
            )
    }