import statistics


def detect_anomalies(expenses):

    if len(expenses) < 3:
        return []

    amounts = [
        expense.amount
        for expense in expenses
    ]

    mean = statistics.mean(amounts)

    std_dev = statistics.stdev(amounts)

    threshold = mean + (2 * std_dev)

    anomalies = []

    for expense in expenses:

        if expense.amount > threshold:

            anomalies.append({

                "amount":
                    expense.amount,

                "category":
                    expense.category,

                "message":
                    "Unusual spending detected."
            })

    return anomalies