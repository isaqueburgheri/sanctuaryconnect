"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";
import { getAllUsers } from "@/services/userService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUsers = async () => {
          setIsLoading(true);
          try {
            const userList = await getAllUsers();
            setUsers(userList);
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Não foi possível carregar os usuários.";
            toast({
              variant: "destructive",
              title: "Erro ao carregar usuários",
              description: errorMessage,
            });
          } finally {
            setIsLoading(false);
          }
        };
        fetchUsers();
      } else {
        setIsLoading(false);
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários do Sistema</CardTitle>
        <CardDescription>
          Lista de todos os usuários registrados no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Criado Em</TableHead>
              <TableHead>Último Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Carregando usuários...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
               <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum usuário encontrado. Faça login para ver a lista.
                  </TableCell>
                </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email || 'Sem email'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "Admin" ? "default" : user.role === "Recepção" ? "secondary" : "outline"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    {formatDate(user.lastLogin)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
