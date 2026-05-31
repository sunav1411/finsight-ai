export function getCurrentUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem(
    "finsight-user"
  );

  return user ? JSON.parse(user) : null;
}

export function saveCurrentUser(user) {
  localStorage.setItem(
    "finsight-user",
    JSON.stringify(user)
  );
}

export function logoutUser() {
  localStorage.removeItem(
    "finsight-user"
  );
}