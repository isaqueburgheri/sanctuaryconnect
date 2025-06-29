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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MoreHorizontal, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";
import { createUser, getAllUsers, sendPasswordReset, deleteUserAccount } from "@/services/userService";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar os usuários.' });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [toast]);

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, preencha todos os campos.' });
        return;
    }
    if (password.length < 6) {
        toast({ variant: 'destructive', title: 'Erro', description: 'A senha deve ter pelo menos 6 caracteres.' });
        return;
    }

    try {
      const newUser = await createUser(email, password);
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "Usuário Criado!",
        description: `O usuário ${email} foi criado com sucesso.`,
      });
      setIsDialogOpen(false);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
        toast({ variant: 'destructive', title: 'Erro ao Criar Usuário', description: errorMessage });
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      await sendPasswordReset(email);
      toast({ title: 'Sucesso', description: `Link de redefinição de senha enviado para ${email}.` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast({ variant: 'destructive', title: 'Erro ao Enviar E-mail', description: errorMessage });
    }
  };
  
  const handleDeleteUser = async (id: string, email: string) => {
     try {
      await deleteUserAccount(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast({ title: 'Sucesso', description: `Usuário ${email} foi excluído com sucesso.` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast({ variant: 'destructive', title: 'Erro ao Excluir', description: errorMessage });
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Usuários da Recepção</CardTitle>
              <CardDescription>
                Lista de usuários com acesso ao painel da recepção.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                 <form onSubmit={handleAddUser}>
                    <DialogHeader>
                    <DialogTitle>Adicionar Novo Recepcionista</DialogTitle>
                    <DialogDescription>
                        Crie uma conta para um novo membro da equipe.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                        Email
                        </Label>
                        <Input id="email" name="email" type="email" className="col-span-3" placeholder="nome@adbelem.com" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                        Senha
                        </Label>
                        <Input id="password" name="password" type="password" className="col-span-3" placeholder="Senha inicial" required />
                    </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Criar Usuário</Button>
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Criado Em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
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
              ) : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.createdAt.toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={user.role === 'Admin'}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handlePasswordReset(user.email)}>
                          Resetar Senha
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">Excluir</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir {user.email}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta do usuário.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDeleteUser(user.id, user.email)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
