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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HandHeart, Loader2 } from "lucide-react";
import { useState } from "react";
import { addPrayerRequest } from "@/services/prayerRequestService";
import type { PrayerRequestInput } from "@/types/prayerRequest";

const formSchema = z.object({
  name: z.string().optional(),
  request: z.string().min(10, "O pedido de oração deve ter pelo menos 10 caracteres."),
});

export default function PrayerRequestForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      request: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await addPrayerRequest(values as PrayerRequestInput);
      toast({
        title: "Pedido Recebido",
        description: "Nossa equipe de intercessão estará orando por você. A paz do Senhor!",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Enviar",
        description: "Não foi possível enviar o pedido. Por favor, verifique sua conexão e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <HandHeart className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Deixe seu Pedido de Oração
          </CardTitle>
        </div>
        <CardDescription className="italic">
          "Não andeis ansiosos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças." - Fp 4:6
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pedido de Oração</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Como podemos orar por você hoje?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Pedido de Oração"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
