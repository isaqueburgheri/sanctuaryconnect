export interface User {
  id: string; // Firebase Auth UID
  email?: string;
  role: 'Admin' | 'Recepção' | 'Unknown';
  createdAt: Date; // This is a placeholder
  lastLogin: Date | null; // This is a placeholder
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: 'Admin' | 'Recepção';
}
