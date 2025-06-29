export interface User {
  id: string; // Firebase Auth UID
  email?: string;
  role: "Admin" | "Recepção" | "Unknown";
  createdAt: Date;
  lastLogin: Date | null;
}
