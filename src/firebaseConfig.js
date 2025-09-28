// src/firebaseConfig.js
// 1) Copie este arquivo para a pasta src/ do seu projeto (ex.: src/firebaseConfig.js).
// 2) Preencha o objeto firebaseConfig com as chaves do seu app Web (Firebase Console > Project settings > "Your apps").
// 3) Opcional: use variáveis de ambiente. Para começar mais rápido, pode colar as chaves diretamente.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ Substitua pelos valores do seu projeto Firebase
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