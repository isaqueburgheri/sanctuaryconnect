import { auth, db } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import type { User, UserDocument } from "@/types/user";

const usersCollectionRef = collection(db, "users");

async function getAuthHeaders() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("User not authenticated. Please log in again.");
    }
    const idToken = await getIdToken(currentUser);
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
    };
}

export async function createUser(email: string, password: string): Promise<User> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/users', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to create user.');
    }
    return {
        ...data.user,
        createdAt: new Date(data.user.createdAt)
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error.message || `Could not create user.`);
  }
}

export async function getUserRole(uid: string): Promise<User['role'] | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return (userDoc.data() as UserDocument).role;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role: ", error);
    throw new Error("Could not verify user permissions.");
  }
}

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
        console.error("Error fetching users: ", error);
        throw new Error("Could not load the list of users.");
    }
}

export async function updateUserPassword(uid: string, newPassword: string): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`/api/users/${uid}/password`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ password: newPassword })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update password.');
    }
  } catch (error: any) {
    console.error("Error updating password:", error);
    throw new Error(error.message || `Could not update password.`);
  }
}

export async function deleteUserAccount(uid: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (currentUser?.uid === uid) {
        throw new Error("You cannot delete your own account.");
    }
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`/api/users/${uid}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok && response.status !== 204) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete user.');
        }
    } catch (error: any) {
        console.error("Error deleting user:", error);
        throw new Error(error.message || `Could not delete user.`);
    }
}
