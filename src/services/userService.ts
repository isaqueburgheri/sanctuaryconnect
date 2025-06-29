import {db, firebaseConfig} from '@/lib/firebase';
import type {User, CreateUserInput} from '@/types/user';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import {initializeApp, deleteApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';

/**
 * Creates a new user directly from the client-side.
 * This approach bypasses the server-side API to avoid environment credential issues.
 * @param userData The user data including email, password, and role.
 * @returns The new user's UID.
 * @throws An error if the creation fails.
 */
export async function createUser(userData: CreateUserInput) {
  // A temporary, secondary Firebase app is used to create a new user.
  // This prevents the currently signed-in admin from being signed out.
  const tempAppName = `temp-app-for-${Date.now()}`;
  const tempApp = initializeApp(firebaseConfig, tempAppName);
  const tempAuth = getAuth(tempApp);

  try {
    // 1. Create the user in Firebase Authentication using the temporary app
    const userCredential = await createUserWithEmailAndPassword(
      tempAuth,
      userData.email,
      userData.password
    );
    const newUser = userCredential.user;

    // 2. Create the user document in Firestore with their role.
    // This uses the primary `db` instance, which is authenticated as the admin.
    const userDocRef = doc(db, 'users', newUser.uid);
    await setDoc(userDocRef, {
      email: userData.email,
      role: userData.role,
    });

    return {uid: newUser.uid};
  } catch (error: any) {
    let errorMessage = 'Ocorreu um erro desconhecido ao criar o usuário.';
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso por outro usuário.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'O formato do email fornecido é inválido.';
          break;
        case 'auth/weak-password':
          errorMessage =
            'A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.';
          break;
        default:
          errorMessage = `Ocorreu um erro no servidor (${error.code}).`;
          break;
      }
    }
    throw new Error(errorMessage);
  } finally {
    // 3. Clean up and delete the temporary app instance
    await deleteApp(tempApp);
  }
}

/**
 * Sets up a real-time listener for the 'users' collection in Firestore.
 * @param onUsersUpdate A callback function to be called with the updated user list.
 * @param onError A callback function for handling errors.
 * @returns A function to unsubscribe from the listener.
 */
export function listenToUsers(
  onUsersUpdate: (users: User[]) => void,
  onError: (error: Error) => void
): () => void {
  try {
    const usersCollectionRef = collection(db, 'users');
    // Order users by email for consistent display
    const q = query(usersCollectionRef, orderBy('email'));

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const users: User[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            role: data.role,
          };
        });
        onUsersUpdate(users);
      },
      error => {
        console.error('Error listening to users collection: ', error);
        onError(new Error('Could not listen for user updates.'));
      }
    );

    return unsubscribe;
  } catch (error: any) {
    console.error('Error setting up user listener: ', error);
    onError(new Error('Failed to set up user listener.'));
    // Return an empty unsubscribe function in case of initial error
    return () => {};
  }
}

/**
 * Fetches the role for a given user ID from Firestore.
 * @param uid The user's unique ID.
 * @returns The user's role ('Admin', 'Recepção') or null if not found.
 * @throws An error if the database query fails.
 */
export async function getUserRole(
  uid: string
): Promise<'Admin' | 'Recepção' | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const role = userDoc.data().role;
      if (role === 'Admin' || role === 'Recepção') {
        return role;
      }
    }
    // User document doesn't exist or has no valid role
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw new Error('Failed to fetch user role from the database.');
  }
}
