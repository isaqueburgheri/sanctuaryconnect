"use client";

import { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MoreHorizontal, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";

// Mock data - In a real app, this would come from a database (e.g., Firebase Auth)
const mockUsers: User[] = [
  {
    id: "1",
    email: "recepcao@adbelem.com",
    role: "Recepção",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    email: "joao.silva@adbelem.com",
    role: "Recepção",
    createdAt: new Date("2023-03-22"),
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    
    // Basic validation
    if (!email || !email.includes('@')) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, insira um e-mail válido.' });
        return;
    }

    // In a real app, you would call a service to create the user in Firebase Auth.
    // For now, we just show a toast and add to the local mock state.
    const newUser: User = {
      id: (users.length + 2).toString(),
      email,
      role: 'Recepção',
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);

    toast({
      title: "Usuário Criado (Simulação)",
      description: `Um convite de criação de senha seria enviado para ${email}.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <Alert variant="default" className="mb-8 bg-accent/20 border-accent">
        <AlertTriangle className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent font-bold">Atenção, Administrador!</AlertTitle>
        <AlertDescription>
          Esta é uma interface de demonstração. As ações de adicionar, resetar senha e excluir usuários são simuladas. Para uma funcionalidade completa, é necessário integrar com um serviço de autenticação como o Firebase Authentication.
        </AlertDescription>
      </Alert>
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
                        O novo usuário receberá um e-mail para definir sua senha.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                        Email
                        </Label>
                        <Input id="email" name="email" type="email" className="col-span-3" placeholder="nome.sobrenome@adbelem.com" required />
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.createdAt.toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => toast({ title: "Simulado", description: `Link de reset de senha enviado para ${user.email}`})}>
                          Resetar Senha
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => toast({ title: "Simulado", description: `Usuário ${user.email} foi excluído.`})}>
                          Excluir
                        </DropdownMenuItem>
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
