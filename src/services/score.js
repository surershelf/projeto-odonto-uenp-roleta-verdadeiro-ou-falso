import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Adiciona pontuação no Firestore
export async function addScore({ name, score }) {
  const colRef = collection(db, "scores");
  const docRef = await addDoc(colRef, {
    name,
    score,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id };
}

// Escuta ranking em tempo real
export function subscribeToScores(callback) {
  const q = query(
    collection(db, "scores"),
    orderBy("score", "desc"),
    orderBy("createdAt", "desc"),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        score: data.score,
        // sempre retorna algo em completedAt
        completedAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      };
    });
    console.log("🔥 Players do Firestore:", players); // debug
    callback(players);
  });
}
