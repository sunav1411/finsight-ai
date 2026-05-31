def calculate_health_score(
    expenses,
    anomalies
):

    score = 100

    total_spending = sum(
        expense.amount
        for expense in expenses
    )

    # High spending penalty
    if total_spending > 20000:
        score -= 15

    # Too many anomalies
    score -= (
        len(anomalies) * 10
    )

    # Prevent negative values
    if score < 0:
        score = 0

    return score