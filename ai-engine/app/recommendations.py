from collections import defaultdict


def generate_recommendations(
    expenses
):

    category_totals = (
        defaultdict(float)
    )

    total_spending = 0

    for expense in expenses:

        category_totals[
            expense.category
        ] += expense.amount

        total_spending += (
            expense.amount
        )

    recommendations = []

    for category, amount in (
        category_totals.items()
    ):

        percentage = (
            amount /
            total_spending
        ) * 100

        # Overspending category
        if percentage > 35:

            potential_savings = (
                amount * 0.15
            )

            recommendations.append(

                f"You are spending heavily on {category}. "
                f"Reducing it by 15% could save ₹{round(potential_savings, 2)}."
            )

    if len(
        recommendations
    ) == 0:

        recommendations.append(
            "Your spending distribution looks balanced."
        )

    return recommendations