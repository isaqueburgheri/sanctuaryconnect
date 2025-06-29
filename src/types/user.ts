import type { Timestamp } from "firebase/firestore";

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  role: "Admin" | "Recepção";
  createdAt: Date;
}

export interface UserDocument {
  email: string;
  role: "Admin" | "Recepção";
  createdAt: Timestamp;
}
