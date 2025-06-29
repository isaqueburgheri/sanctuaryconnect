import {db} from '@/lib/firebase';
import type {User, CreateUserInput} from '@/types/user';
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore';

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
    throw new Error(data.error || 'Failed to create user.');
  }

  return data;
}

export function listenToUsers(
  onUsersUpdate: (users: User[]) => void,
  onError: (error: Error) => void
): () => void {
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const users: User[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || `Email não encontrado (ID: ${doc.id})`,
            role: data.role || 'Unknown',
            createdAt: new Date(), // Placeholder
            lastLogin: null, // Placeholder
          };
        });
        users.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
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
    return () => {};
  }
}

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
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw new Error('Failed to fetch user role from the database.');
  }
}
