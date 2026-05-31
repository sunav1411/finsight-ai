from collections import defaultdict
from datetime import datetime


def analyze_trends(expenses):

    # =====================================
    # MONTH GROUPING
    # =====================================

    monthly_totals = defaultdict(float)

    category_monthly = defaultdict(
        lambda: defaultdict(float)
    )

    for expense in expenses:

        try:

            date_obj = datetime.strptime(
                expense.date,
                "%Y-%m-%d"
            )

        except:

            continue

        month_key = (
            f"{date_obj.year}-"
            f"{date_obj.month:02}"
        )

        amount = float(
            expense.amount
        )

        category = (
            expense.category
        )

        monthly_totals[
            month_key
        ] += amount

        category_monthly[
            category
        ][month_key] += amount

    # =====================================
    # SORT MONTHS
    # =====================================

    sorted_months = sorted(
        monthly_totals.keys()
    )

    if len(sorted_months) < 2:

      return {
    "message":
    "I need expenses from at least two different months to analyze spending trends."
}

    current_month = (
        sorted_months[-1]
    )

    previous_month = (
        sorted_months[-2]
    )

    current_total = (
        monthly_totals[
            current_month
        ]
    )

    previous_total = (
        monthly_totals[
            previous_month
        ]
    )

    # =====================================
    # OVERALL TREND
    # =====================================

    change_percent = 0

    if previous_total > 0:

        change_percent = round(

            (
                (
                    current_total -
                    previous_total
                ) /
                previous_total
            ) * 100,

            1
        )

    # =====================================
    # CATEGORY TRENDS
    # =====================================

    category_changes = []

    for category, data in (
        category_monthly.items()
    ):

        current_value = (
            data[current_month]
        )

        previous_value = (
            data[previous_month]
        )

        if previous_value <= 0:
            continue

        category_percent = round(

            (
                (
                    current_value -
                    previous_value
                ) /
                previous_value
            ) * 100,

            1
        )

        category_changes.append({

            "category":
                category,

            "change_percent":
                category_percent,

            "current":
                round(current_value, 2),

            "previous":
                round(previous_value, 2)
        })

    # =====================================
    # SORT CATEGORY CHANGES
    # =====================================

    category_changes = sorted(

        category_changes,

        key=lambda x:
            abs(
                x["change_percent"]
            ),

        reverse=True
    )

    return {

        "current_month":
            current_month,

        "previous_month":
            previous_month,

        "current_total":
            round(current_total, 2),

        "previous_total":
            round(previous_total, 2),

        "overall_change_percent":
            change_percent,

        "category_changes":
            category_changes
    }