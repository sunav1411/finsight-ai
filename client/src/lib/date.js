export function formatExpenseDate(
  dateString
) {

  const date = new Date(
    dateString
  );

  const today = new Date();

  const yesterday = new Date();

  yesterday.setDate(
    today.getDate() - 1
  );

  // TODAY
  if (
    date.toDateString() ===
    today.toDateString()
  ) {
    return "Today";
  }

  // YESTERDAY
  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  // NORMAL DATE
  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}