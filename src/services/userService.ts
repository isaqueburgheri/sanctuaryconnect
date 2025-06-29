import { auth, db } from "@/lib/firebase";
import type { User } from "@/types/user";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

/**
 * Fetches all user documents from the 'users' collection in Firestore.
 * This is a client-side operation and does not require the Admin SDK.
 * It will only return users that have a corresponding document in Firestore.
 */
export async function getAllUsers(): Promise<User[]> {
    try {
        const usersCollectionRef = collection(db, "users");
        // We can't order by role easily without a composite index, so we'll sort client-side if needed.
        const q = query(usersCollectionRef); 
        const querySnapshot = await getDocs(q);

        const users: User[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                role: data.role || "Unknown",
                // The client-side SDK cannot access Auth-specific details like email,
                // createdAt, or lastLogin for other users. We return placeholders.
                email: `Usuário (${doc.id.substring(0, 5)}...)`,
                createdAt: new Date(), // Placeholder
                lastLogin: null, // Placeholder
            };
        });

        return users;
    } catch (error: any) {
        console.error("Error fetching users from Firestore: ", error);
        throw new Error(error.message || "Could not load the list of users from Firestore.");
    }
}


export async function getUserRole(uid: string): Promise<'Admin' | 'Recepção' | null> {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === 'Admin' || role === 'Recepção') {
                return role;
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        throw new Error("Failed to fetch user role from the database.");
    }
}
