import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import type { User, UserDocument } from "@/types/user";

const usersCollectionRef = collection(db, "users");

// Função para criar um novo usuário (recepcionista) com email e senha
export async function createUser(email: string, password: string): Promise<User> {
  try {
    // Cria o usuário no Firebase Authentication com a senha fornecida
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
    }
     if (error.code === 'auth/weak-password') {
      throw new Error('A senha é muito fraca. Use pelo menos 6 caracteres.');
    }
    console.error("Erro ao criar usuário: ", error);
    throw new Error("Não foi possível criar o usuário. Verifique os dados fornecidos.");
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

// Função para buscar todos os usuários
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

// Função para chamar a API para alterar a senha de um usuário
export async function updateUserPassword(uid: string, newPassword: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
      throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
  }

  try {
    const idToken = await getIdToken(currentUser);

    const response = await fetch('/api/setUserPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ uid: uid, password: newPassword })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha ao alterar a senha.');
    }
  } catch (error: any) {
    console.error("Erro ao chamar a API para alterar senha:", error);
    throw new Error(error.message || `Não foi possível alterar a senha.`);
  }
}

// Função para chamar a API para excluir uma conta de usuário (Auth + Firestore)
export async function deleteUserAccount(uid: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
    }

    if (currentUser.uid === uid) {
        throw new Error("Você não pode excluir sua própria conta.");
    }

    try {
        const idToken = await getIdToken(currentUser);

        const response = await fetch('/api/deleteUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ uid: uid })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Falha ao excluir o usuário.');
        }
    } catch (error: any) {
        console.error("Erro ao chamar a API para excluir usuário:", error);
        throw new Error(error.message || `Não foi possível excluir o usuário.`);
    }
}
