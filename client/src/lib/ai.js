import {
  AI_BASE_URL,
} from "@/lib/config";

export async function getPrediction(
  expenses,
  budget = 0
) {

  try {

    const response = await fetch(
      `${AI_BASE_URL}/predict`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          expenses,
          budget: Number(budget),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Prediction request failed"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Prediction API Error:",
      error
    );

    return null;
  }
}

export async function chatWithAI(
  message,
  expenses = [],
  budget = 0
) {

  try {

    const response = await fetch(
      `${AI_BASE_URL}/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message,
          expenses,
          budget: Number(budget),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Chat request failed"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Chat API Error:",
      error
    );

    return null;
  }
}
