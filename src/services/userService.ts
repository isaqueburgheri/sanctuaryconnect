import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  // Para excluir um usuário, você precisaria de um backend (Firebase Functions)
  // por razões de segurança. Não implementaremos a exclusão de auth aqui.
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import type { User, UserDocument } from "@/types/user";

const usersCollectionRef = collection(db, "users");

// Função para criar um novo usuário (recepcionista)
export async function createUser(email: string, password: string): Promise<User> {
  try {
    // Cria o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const authUser = userCredential.user;

    // Cria o documento do usuário no Firestore para armazenar a role
    const newUserDoc: UserDocument = {
      email: authUser.email!,
      role: 'Recepção', // Por padrão, usuários criados pelo painel são da recepção
      createdAt: Timestamp.now(),
    };
    
    await setDoc(doc(db, "users", authUser.uid), newUserDoc);

    return {
      id: authUser.uid,
      email: newUserDoc.email,
      role: newUserDoc.role,
      createdAt: newUserDoc.createdAt.toDate(),
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este e-mail já está em uso.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('A senha é muito fraca.');
    }
    console.error("Erro ao criar usuário: ", error);
    throw new Error("Não foi possível criar o usuário.");
  }
}

// Função para obter a role de um usuário
export async function getUserRole(uid: string): Promise<User['role'] | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return (userDoc.data() as UserDocument).role;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar role do usuário: ", error);
    throw new Error("Não foi possível verificar a permissão do usuário.");
  }
}

// Função para buscar todos os usuários (exceto o próprio admin, se desejado)
export async function getAllUsers(): Promise<User[]> {
    try {
        const querySnapshot = await getDocs(usersCollectionRef);
        return querySnapshot.docs.map(doc => {
            const data = doc.data() as UserDocument;
            return {
                id: doc.id,
                email: data.email,
                role: data.role,
                createdAt: data.createdAt.toDate(),
            };
        });
    } catch (error) {
        console.error("Erro ao buscar usuários: ", error);
        throw new Error("Não foi possível carregar a lista de usuários.");
    }
}

// Função para enviar e-mail de redefinição de senha
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Erro ao enviar e-mail de redefinição: ", error);
    throw new Error("Não foi possível enviar o e-mail de redefinição.");
  }
}

// Função para excluir uma conta de usuário
// ATENÇÃO: Isso exclui o registro no Firestore. A exclusão no Firebase Auth
// requereria uma função de backend por segurança. O usuário não poderá mais logar
// pois sua role será removida.
export async function deleteUserAccount(uid: string): Promise<void> {
    try {
        const userDocRef = doc(db, "users", uid);
        await deleteDoc(userDocRef);
        // NOTA: A exclusão real da autenticação (auth.deleteUser(uid)) deve ser feita
        // a partir de um ambiente de servidor confiável (ex: Firebase Functions).
    } catch (error) {
        console.error("Erro ao excluir usuário: ", error);
        throw new Error("Não foi possível excluir o usuário.");
    }
}
