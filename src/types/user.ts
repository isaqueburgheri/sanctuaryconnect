export interface User {
  id: string; // Firebase Auth UID
  email?: string; // This might be a placeholder now
  role: "Admin" | "Recepção" | "Unknown";
  createdAt: Date; // This is a placeholder
  lastLogin: Date | null; // This is a placeholder
}
