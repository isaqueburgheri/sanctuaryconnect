import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import type {
  PrayerRequest,
  PrayerRequestDocument,
  PrayerRequestInput,
} from "@/types/prayerRequest";

const prayerRequestsCollectionRef = collection(db, "prayer-requests");

export async function addPrayerRequest(requestData: PrayerRequestInput) {
  try {
    await addDoc(prayerRequestsCollectionRef, {
      ...requestData,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erro ao enviar pedido de oração: ", error);
    throw new Error("Não foi possível enviar o seu pedido de oração.");
  }
}

export function listenToPrayerRequests(
  onRequestsUpdate: (requests: PrayerRequest[]) => void,
  onError: (error: Error) => void
): () => void {
  try {
    const q = query(prayerRequestsCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const requests = querySnapshot.docs.map((doc) => {
          const data = doc.data() as PrayerRequestDocument;
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
          };
        });
        onRequestsUpdate(requests);
      },
      (error) => {
        console.error("Erro ao escutar pedidos de oração: ", error);
        onError(new Error("Não foi possível carregar os pedidos de oração."));
      }
    );
    return unsubscribe;
  } catch (error: any) {
    console.error(
      "Erro ao configurar o listener de pedidos de oração: ",
      error
    );
    onError(new Error("Falha ao configurar o listener de pedidos de oração."));
    return () => {};
  }
}

export async function deletePrayerRequest(id: string): Promise<void> {
  try {
    const requestDoc = doc(db, "prayer-requests", id);
    await deleteDoc(requestDoc);
  } catch (error) {
    console.error("Erro ao excluir pedido de oração: ", error);
    throw new Error("Não foi possível excluir o pedido de oração.");
  }
}
