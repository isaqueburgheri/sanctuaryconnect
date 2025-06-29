"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { HandHeart } from "lucide-react";

const formSchema = z.object({
  name: z.string().optional(),
  request: z.string().min(10, "Por favor, descreva seu pedido para que possamos orar especificamente por você."),
});

export default function PrayerRequestForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      request: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Pedido Recebido",
      description: "Nossa equipe de intercessão estará orando por você. A paz do Senhor!",
    });
    form.reset();
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
            <Button type="submit" className="w-full">
              Enviar Pedido de Oração
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
