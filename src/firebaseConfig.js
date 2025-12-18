import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjGk4i6u0c_wpww-KU5nidrcPJZbPazAA",
  authDomain: "quiz-odonto-d0927.firebaseapp.com",
  projectId: "quiz-odonto-d0927",
  storageBucket: "quiz-odonto-d0927.firebasestorage.app",
  messagingSenderId: "271637125045",
  appId: "1:271637125045:web:41e8b709b903d9d4ad6bfc",
  measurementId: "G-536HB2028X"
};

// Inicializa o app e exporta o Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
