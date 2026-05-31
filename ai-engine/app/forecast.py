import pandas as pd

from prophet import Prophet


def predict_expense(expenses):

    try:

        # =====================================
        # MINIMUM RAW DATA
        # =====================================

        if len(expenses) < 5:
            return 0

        # =====================================
        # CLEAN DATA
        # =====================================

        rows = []

        for expense in expenses:

            try:

                if (
                    not expense.date
                    or expense.amount is None
                ):
                    continue

                rows.append({

                    "date":
                        str(expense.date),

                    "amount":
                        float(expense.amount)
                })

            except:
                continue

        # =====================================
        # VALID ROW CHECK
        # =====================================

        if len(rows) < 5:
            return 0

        df = pd.DataFrame(rows)

        # =====================================
        # DATE PARSING
        # =====================================

        df["date"] = pd.to_datetime(

            df["date"],

            errors="coerce"
        )

        # REMOVE INVALID DATES

        df = df.dropna(
            subset=["date"]
        )

        if len(df) < 5:
            return 0

        # =====================================
        # MONTHLY AGGREGATION
        # =====================================

        monthly = (
            df
            .groupby(
                pd.Grouper(
                    key="date",
                    freq="MS"
                )
            )["amount"]
            .sum()
            .reset_index()
        )

        # =====================================
        # REMOVE BAD VALUES
        # =====================================

        monthly = monthly.dropna()

        # =====================================
        # MUST HAVE 2+ MONTHS
        # =====================================

        if len(monthly) < 2:

            avg_spending = (
                monthly["amount"]
                .mean()
            )

            return round(

                float(avg_spending),

                2
            )

        # =====================================
        # PROPHET FORMAT
        # =====================================

        monthly.columns = [
            "ds",
            "y"
        ]

        # =====================================
        # FINAL CLEANING
        # =====================================

        monthly = monthly.dropna()

        if len(monthly) < 2:
            return 0

        # =====================================
        # MODEL
        # =====================================

        model = Prophet(

            daily_seasonality=False,

            weekly_seasonality=False,

            yearly_seasonality=False
        )

        model.fit(monthly)

        # =====================================
        # FUTURE
        # =====================================

        future = (
            model.make_future_dataframe(

                periods=1,

                freq="MS"
            )
        )

        forecast = model.predict(
            future
        )

        prediction = forecast.iloc[-1][
            "yhat"
        ]

        return round(

            max(
                float(prediction),
                0
            ),

            2
        )

    except Exception as e:

        print(
            "Forecast Error:",
            e
        )

        return 0