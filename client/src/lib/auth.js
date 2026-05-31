import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

// REGISTER
export async function registerUser(
  email,
  password
) {

  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// LOGIN
export async function loginUser(
  email,
  password
) {

  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// LOGOUT
export async function logoutUser() {

  return await signOut(auth);
}