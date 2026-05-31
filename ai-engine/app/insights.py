from collections import defaultdict


def generate_insights(expenses):

    insights = []

    category_totals = defaultdict(
        float
    )

    total_spending = 0

    for expense in expenses:

        category_totals[
            expense.category
        ] += expense.amount

        total_spending += (
            expense.amount
        )

    highest_category = max(
        category_totals,
        key=category_totals.get
    )

    insights.append(

        f"Highest spending category is {highest_category}."

    )

    average = (
        total_spending /
        len(expenses)
    )

    latest = expenses[-1].amount

    if latest > average:

        insights.append(

            "Latest spending is above average."

        )

    if latest > average * 1.5:

        insights.append(

            "Warning: spending spike detected."

        )

    return insights