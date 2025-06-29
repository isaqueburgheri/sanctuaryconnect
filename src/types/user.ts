export interface User {
  id: string;
  email: string;
  role: "Admin" | "Recepção";
  createdAt: Date;
}
