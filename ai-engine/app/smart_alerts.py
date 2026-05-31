from collections import defaultdict

from app.burn_rate import (
    analyze_burn_rate
)

from app.trend_analysis import (
    analyze_trends
)

from app.category_intelligence import (
    analyze_categories
)


def generate_smart_alerts(
    expenses,
    budget=0
):

    alerts = []

    # =====================================
    # CATEGORY ANALYSIS
    # =====================================

    category_data = (
        analyze_categories(
            expenses
        )
    )

    total_spent = (
        category_data[
            "total_spent"
        ]
    )

    dominant = (
        category_data[
            "dominant_category"
        ]
    )

    # =====================================
    # BUDGET USAGE ALERT
    # =====================================

    if budget > 0:

        usage_percent = round(

            (
                total_spent /
                budget
            ) * 100,

            1
        )

        if usage_percent >= 90:

            alerts.append({

                "type":
                    "critical",

                "title":
                    "Budget Limit Critical",

                "message":
                    f"You've already used "
                    f"{usage_percent}% "
                    f"of your monthly budget."
            })

        elif usage_percent >= 75:

            alerts.append({

                "type":
                    "warning",

                "title":
                    "Budget Usage High",

                "message":
                    f"Budget usage reached "
                    f"{usage_percent}%."
            })

    # =====================================
    # DOMINANT CATEGORY ALERT
    # =====================================

    if dominant:

        if dominant[
            "percentage"
        ] >= 40:

            alerts.append({

                "type":
                    "insight",

                "title":
                    "High Category Concentration",

                "message":
                    f"{dominant['category']} "
                    f"accounts for "
                    f"{dominant['percentage']}% "
                    f"of total spending."
            })

    # =====================================
    # TREND ANALYSIS
    # =====================================

    trend_data = (
        analyze_trends(
            expenses
        )
    )

    if (
        "message"
        not in trend_data
    ):

        overall_change = (
            trend_data[
                "overall_change_percent"
            ]
        )

        if overall_change >= 20:

            alerts.append({

                "type":
                    "warning",

                "title":
                    "Spending Increasing",

                "message":
                    f"Monthly spending "
                    f"increased by "
                    f"{overall_change}%."
            })

        elif overall_change <= -15:

            alerts.append({

                "type":
                    "positive",

                "title":
                    "Spending Reduced",

                "message":
                    f"Monthly spending "
                    f"decreased by "
                    f"{abs(overall_change)}%."
            })

        # CATEGORY CHANGE ALERTS

        category_changes = (
            trend_data[
                "category_changes"
            ]
        )

        if category_changes:

            top_change = (
                category_changes[0]
            )

            if abs(
                top_change[
                    "change_percent"
                ]
            ) >= 25:

                direction = (
                    "increased"
                    if top_change[
                        "change_percent"
                    ] >= 0
                    else "decreased"
                )

                alerts.append({

                    "type":
                        "insight",

                    "title":
                        "Category Trend Shift",

                    "message":
                        f"{top_change['category']} "
                        f"spending "
                        f"{direction} by "
                        f"{abs(top_change['change_percent'])}%."
                })

    # =====================================
    # BURN RATE ALERT
    # =====================================

    burn_rate = (
        analyze_burn_rate(
            expenses,
            budget
        )
    )

    if (
        "message"
        not in burn_rate
    ):

        if (
            burn_rate["status"]
            == "risk"
        ):

            exceed_amount = abs(

                burn_rate[
                    "remaining_projection"
                ]
            )

            alerts.append({

                "type":
                    "critical",

                "title":
                    "Overspending Risk",

                "message":
                    f"Current spending pace "
                    f"may exceed budget by "
                    f"₹{exceed_amount:,.2f}."
            })

    # =====================================
    # FALLBACK
    # =====================================

    if len(alerts) == 0:

        alerts.append({

            "type":
                "positive",

            "title":
                "Financial Activity Stable",

            "message":
                "No major financial risks "
                "detected currently."
        })

    return alerts