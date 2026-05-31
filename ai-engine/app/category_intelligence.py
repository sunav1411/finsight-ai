from collections import defaultdict


def analyze_categories(expenses):

    # =========================================
    # CATEGORY TOTALS
    # =========================================

    category_totals = defaultdict(float)

    total_spent = 0

    for expense in expenses:

        amount = float(
            expense.amount
        )

        category = (
            expense.category
        )

        category_totals[
            category
        ] += amount

        total_spent += amount

    # =========================================
    # SORTED CATEGORIES
    # =========================================

    sorted_categories = sorted(

        category_totals.items(),

        key=lambda x: x[1],

        reverse=True
    )

    # =========================================
    # ANALYTICS
    # =========================================

    analytics = []

    for category, amount in (
        sorted_categories
    ):

        percentage = 0

        if total_spent > 0:

            percentage = round(
                (
                    amount /
                    total_spent
                ) * 100,
                1
            )

        analytics.append({

            "category":
                category,

            "amount":
                round(amount, 2),

            "percentage":
                percentage
        })

    # =========================================
    # DOMINANT CATEGORY
    # =========================================

    dominant_category = None

    if analytics:

        dominant_category = (
            analytics[0]
        )

    return {

        "total_spent":
            round(
                total_spent,
                2
            ),

        "categories":
            analytics,

        "dominant_category":
            dominant_category
    }