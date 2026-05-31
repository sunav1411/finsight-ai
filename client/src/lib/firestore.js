import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

// =========================
// ADD EXPENSE
// =========================
export async function addExpense(
  expense
) {

  return await addDoc(
    collection(db, "expenses"),
    expense
  );
}

// =========================
// REALTIME EXPENSE LISTENER
// =========================
export function subscribeToExpenses(
  userId,
  callback
) {

  const q = query(
    collection(db, "expenses"),

    where(
      "userId",
      "==",
      userId
    ),

    orderBy(
      "createdAt",
      "desc"
    )
  );

  return onSnapshot(
    q,
    (querySnapshot) => {

      const expenses = [];

      querySnapshot.forEach(
        (docItem) => {

          expenses.push({
            id: docItem.id,
            ...docItem.data(),
          });
        }
      );

      callback(expenses);
    }
  );
}

// =========================
// DELETE EXPENSE
// =========================
export async function deleteExpense(
  expenseId
) {

  await deleteDoc(
    doc(
      db,
      "expenses",
      expenseId
    )
  );
}

// =========================
// UPDATE EXPENSE
// =========================
export async function updateExpense(
  expenseId,
  updatedData
) {

  const expenseRef = doc(
    db,
    "expenses",
    expenseId
  );

  await updateDoc(
    expenseRef,
    updatedData
  );
}

// =========================
// SAVE USER BUDGET
// =========================
export async function saveUserBudget(
  userId,
  budget
) {

  await setDoc(
    doc(
      db,
      "budgets",
      userId
    ),
    {
      monthlyBudget: budget,
    }
  );
}

// =========================
// GET USER BUDGET
// =========================
export async function getUserBudget(
  userId
) {

  const budgetRef =
    doc(
      db,
      "budgets",
      userId
    );

  const snapshot =
    await getDoc(
      budgetRef
    );

  if (
    snapshot.exists()
  ) {

    return snapshot.data()
      .monthlyBudget;
  }

  return 0;
}

// =========================
// SAVE USER SETTINGS
// =========================
export async function saveUserSettings(
  userId,
  settings
) {

  await setDoc(
    doc(
      db,
      "settings",
      userId
    ),
    settings,
    { merge: true }
  );
}

// =========================
// GET USER SETTINGS
// =========================
export async function getUserSettings(
  userId
) {

  const settingsRef =
    doc(
      db,
      "settings",
      userId
    );

  const snapshot =
    await getDoc(
      settingsRef
    );

  if (
    snapshot.exists()
  ) {

    return snapshot.data();
  }

  return {
    darkMode: false,
    notifications: true,
    currency: "INR",
    budgetAlerts: true,
  };
}

// =========================
// ADD NOTIFICATION
// =========================
export async function addNotification(
  notification
) {

  return await addDoc(
    collection(
      db,
      "notifications"
    ),
    notification
  );
}

// =========================
// REALTIME NOTIFICATIONS
// =========================
export function subscribeToNotifications(
  userId,
  callback
) {

  // PREVENT INVALID QUERY
  if (!userId) {

    console.log(
      "No userId provided"
    );

    return () => {};
  }

  const q = query(
    collection(
      db,
      "notifications"
    ),

    where(
      "userId",
      "==",
      userId
    ),

    orderBy(
      "createdAt",
      "desc"
    )
  );

  return onSnapshot(

    q,

    (querySnapshot) => {

      const notifications = [];

      querySnapshot.forEach(
        (docItem) => {

          notifications.push({
            id: docItem.id,
            ...docItem.data(),
          });
        }
      );

      callback(notifications);
    },

    (error) => {

      console.error(
        "Notification listener error:",
        error
      );
    }
  );
}