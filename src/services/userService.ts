import {db} from '@/lib/firebase';
import type {User, CreateUserInput} from '@/types/user';
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

/**
 * Creates a new user by calling the backend API.
 * This function is responsible for creating both the Auth record and the Firestore document.
 * @param userData The user data including email, password, and role.
 * @returns The response from the API.
 * @throws An error if the API call fails.
 */
export async function createUser(userData: CreateUserInput) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    // The API should return a JSON object with an 'error' key.
    throw new Error(data.error || 'Failed to create user.');
  }

  return data;
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
