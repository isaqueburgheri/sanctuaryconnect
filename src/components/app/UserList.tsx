'use client';

import {useState, useEffect} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Loader2, PlusCircle} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import type {User, CreateUserInput} from '@/types/user';
import {listenToUsers, createUser} from '@/services/userService';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';

const createUserFormSchema = z.object({
  email: z.string().email({message: 'Por favor, insira um email válido.'}),
  password: z
    .string()
    .min(6, {message: 'A senha deve ter no mínimo 6 caracteres.'}),
  role: z.enum(['Admin', 'Recepção'], {
    required_error: 'Por favor, selecione um cargo.',
  }),
});

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {toast} = useToast();

  const form = useForm<z.infer<typeof createUserFormSchema>>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'Recepção',
    },
  });

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsLoading(true);
        const usersUnsubscribe = listenToUsers(
          userList => {
            setUsers(userList);
            setIsLoading(false);
          },
          error => {
            toast({
              variant: 'destructive',
              title: 'Erro ao carregar usuários',
              description: error.message,
            });
            setIsLoading(false);
          }
        );
        return () => usersUnsubscribe();
      } else {
        setIsLoading(false);
        setUsers([]);
      }
    });

    return () => authUnsubscribe();
  }, [toast]);

  async function handleAddUser(values: CreateUserInput) {
    setIsSubmitting(true);
    try {
      await createUser(values);
      toast({
        title: 'Usuário Criado!',
        description: `O usuário ${values.email} foi criado com sucesso.`,
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Criar Usuário',
        description:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Lista de usuários registrados no sistema.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os detalhes abaixo para criar um novo usuário.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddUser)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="usuario@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Recepção">Recepção</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? 'Criando...' : 'Criar Usuário'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Carregando usuários...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Nenhum usuário encontrado. Faça login para ver a lista.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === 'Admin'
                          ? 'default'
                          : user.role === 'Recepção'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {user.role}
                    </Badge>
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
