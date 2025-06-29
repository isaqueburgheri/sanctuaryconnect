export interface User {
  id: string; // Firebase Auth UID, which is also the Firestore document ID
  email: string;
  role: 'Admin' | 'Recepção';
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: 'Admin' | 'Recepção';
}
