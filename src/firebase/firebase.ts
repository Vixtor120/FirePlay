import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// Habilitar persistencia offline para Firestore solo en el navegador
if (typeof window !== 'undefined') {
  enableMultiTabIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Múltiples pestañas abiertas, persistencia solo puede activarse en una
        console.warn("No se pudo habilitar persistencia offline porque hay múltiples pestañas abiertas.");
      } else if (err.code === 'unimplemented') {
        // El navegador no soporta persistencia
        console.warn("Tu navegador no soporta persistencia offline para Firestore.");
      } else {
        console.error("Error habilitando persistencia offline:", err);
      }
    });
}

// Analytics solo funciona en el cliente, no en el servidor
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    try {
      return getAnalytics(app);
    } catch (error) {
      console.warn("No se pudo inicializar Analytics:", error);
      return null;
    }
  }
  return null;
};