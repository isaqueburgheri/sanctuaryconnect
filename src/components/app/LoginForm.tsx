"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulating authentication
    setTimeout(() => {
      if (
        values.email.toLowerCase() === "recepcao@adbelem.com" &&
        values.password === "123456"
      ) {
        toast({
          title: "Login bem-sucedido!",
          description: "Bem-vindo(a), recepcionista.",
        });
        router.push("/dashboard");
      } else if (
        values.email.toLowerCase() === "admin@adbelem.com" &&
        values.password === "123456"
      ) {
        toast({
          title: "Login bem-sucedido!",
          description: "Bem-vindo(a), administrador.",
        });
        router.push("/admin");
      } else {
        toast({
          variant: "destructive",
          title: "Erro de Login",
          description: "Email ou senha inválidos. Tente novamente.",
        });
        setIsLoading(false);
      }
    }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_Belem.png/500px-Logo_Belem.png"
          alt="Logo AD Belém"
          width={50}
          height={50}
          className="h-12 w-12"
        />
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
          AD Belém - Setor 63
        </h1>
      </Link>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">
            Acesso Restrito
          </CardTitle>
          <CardDescription className="text-center">
            Por favor, faça login para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Teste com: recepcao@adbelem.com ou admin@adbelem.com (senha: 123456)
      </p>
    </div>
  );
}
