import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import type { Visitor, VisitorDocument, VisitorInput } from "@/types/visitor";

const visitorsCollectionRef = collection(db, "visitors");

export async function addVisitor(visitorData: VisitorInput) {
  try {
    await addDoc(visitorsCollectionRef, {
      ...visitorData,
      visitDate: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erro ao registrar visitante: ", error);
    throw new Error("Não foi possível registrar o visitante.");
  }
}

export async function getVisitors(): Promise<Visitor[]> {
  try {
    const q = query(visitorsCollectionRef, orderBy("visitDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as VisitorDocument;
      return {
        id: doc.id,
        ...data,
        visitDate: data.visitDate.toDate(),
      };
    });
  } catch (error) {
    console.error("Erro ao buscar os visitantes: ", error);
    throw new Error("Não foi possível buscar os visitantes.");
  }
}

export async function getTodaysVisitors(): Promise<Visitor[]> {
   try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const q = query(
      visitorsCollectionRef,
      where("visitDate", ">=", Timestamp.fromDate(startOfDay)),
      where("visitDate", "<=", Timestamp.fromDate(endOfDay)),
      orderBy("visitDate", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as VisitorDocument;
      return {
        id: doc.id,
        ...data,
        visitDate: data.visitDate.toDate(),
      };
    });
  } catch (error) {
    console.error("Erro ao buscar os visitantes de hoje: ", error);
    // Firestore pode sugerir um índice aqui. O erro no console do navegador guiará o usuário.
    if (error instanceof Error && error.message.includes("indexes")) {
         console.error("É necessário criar um índice no Firestore. Verifique o link no erro do console para criá-lo automaticamente.");
         throw new Error("Índice do Firestore ausente. Verifique o console para mais detalhes.");
    }
    throw new Error("Não foi possível buscar os visitantes de hoje.");
  }
}
