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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Handshake, UserPlus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { addVisitor } from "@/services/visitorService";
import type { VisitorInput } from "@/types/visitor";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  isBeliever: z.enum(["sim", "nao"], {
    required_error: "Por favor, selecione uma opção.",
  }),
  churchName: z.string().optional(),
  contact: z.string().optional(),
  wantsVisit: z.boolean().default(false).optional(),
  observations: z.string().optional(),
});

const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  const phoneNumber = value.replace(/\D/g, "").slice(0, 11);
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength === 0) return "";
  if (phoneNumberLength < 3) return `(${phoneNumber}`;
  if (phoneNumberLength < 8) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
    2,
    7
  )}-${phoneNumber.slice(7, 11)}`;
};

export default function VisitorCheckinForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      churchName: "",
      contact: "",
      wantsVisit: false,
      observations: "",
    },
  });

  const isBeliever = form.watch("isBeliever");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const submissionValues: VisitorInput = {
        ...values,
        contact: values.contact?.replace(/\D/g, ""),
      };
      await addVisitor(submissionValues);
      toast({
        title: "Visitante Registrado!",
        description: `${values.name} foi adicionado(a) com sucesso.`,
      });
      form.reset();
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro ao Registrar",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Cadastro de Visitantes
          </CardTitle>
        </div>
        <CardDescription>
          Use este formulário para registrar um novo visitante.
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
                  <FormLabel>Nome Completo do Visitante</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Maria da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBeliever"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>É crente?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sim" />
                        </FormControl>
                        <FormLabel className="font-normal">Sim</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="nao" />
                        </FormControl>
                        <FormLabel className="font-normal">Não</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isBeliever === "sim" && (
              <FormField
                control={form.control}
                name="churchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual igreja?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da igreja do visitante"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp do Visitante (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      type="tel"
                      {...field}
                      onChange={(e) => {
                        const formattedPhoneNumber = formatPhoneNumber(
                          e.target.value
                        );
                        field.onChange(formattedPhoneNumber);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Para manter contato e enviar convites.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wantsVisit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5 leading-none">
                    <FormLabel>
                      Aceita receber uma visita em sua casa
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alguma informação adicional? Ex: pedido de oração, necessidade específica, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              <Handshake className="mr-2 h-4 w-4" />
              {isLoading ? "Registrando..." : "Registrar Visita"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
