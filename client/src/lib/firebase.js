import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",

  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",

  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",

  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",

  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",

  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:demoapp",
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(
        firebaseConfig
      );

const isBrowser =
  typeof window !== "undefined";

export const auth =
  isBrowser
    ? getAuth(app)
    : null;

export const db =
  isBrowser
    ? initializeFirestore(
        app,
        {
          localCache:
            persistentLocalCache({
              tabManager:
                persistentMultipleTabManager(),
            }),
        }
      )
    : null;

export const storage =
  isBrowser
    ? getStorage(app)
    : null;

export default app;
