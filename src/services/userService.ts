import { auth } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";
import type { User } from "@/types/user";

async function getAuthHeaders() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
       // O componente que chama vai lidar com o usuário não autenticado.
       // Lançar um erro aqui pode impedir a renderização inicial.
       return {};
    }
    const idToken = await getIdToken(currentUser);
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
    };
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const headers = await getAuthHeaders();
        // Se não houver headers de autenticação, não faz a chamada.
        if (!headers.Authorization) {
            return [];
        }

        const response = await fetch('/api/users', {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to fetch users.');
        }

        const data = await response.json();
        return data; // Os dados já estão no formato correto, incluindo datas como strings ISO
    } catch (error: any) {
        console.error("Error fetching users: ", error);
        throw new Error(error.message || "Could not load the list of users.");
    }
}
