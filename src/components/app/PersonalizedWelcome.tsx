"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Wand2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function PersonalizedWelcome() {
  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsLoading(true);
    setWelcomeMessage("");
    // Simulate AI call
    setTimeout(() => {
      let message = `Bem-vindo(a), ${name}! Somos muito abençoados por ter você conosco hoje. `;
      if (
        interests.toLowerCase().includes("jovens") ||
        interests.toLowerCase().includes("crianças")
      ) {
        message +=
          "Vimos que você tem interesse em atividades para jovens. Nosso grupo de jovens é uma comunidade vibrante, e adoraríamos que você se juntasse a nós! Eles se encontram toda sexta-feira às 19h.";
      } else if (
        interests.toLowerCase().includes("música") ||
        interests.toLowerCase().includes("louvor")
      ) {
        message +=
          "É maravilhoso que você tenha um coração para a música! Nossa equipe de louvor está sempre procurando por pessoas apaixonadas. Acreditamos que você se sentirá em casa em nossos cultos.";
      } else {
        message +=
          "Oramos para que você sinta o calor da nossa comunidade e a presença de Deus durante sua visita. Não hesite em falar com um de nossos pastores.";
      }
      setWelcomeMessage(message);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wand2 className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Boas-Vindas Personalizadas
          </CardTitle>
        </div>
        <CardDescription>
          Deixe-nos criar uma mensagem de boas-vindas especial para você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateMessage} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu Nome"
            aria-label="Seu Nome"
          />
          <Textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Algum interesse específico? (ex: música, grupo de jovens)"
            aria-label="Seus interesses"
          />
          <Button type="submit" className="w-full" disabled={isLoading || !name}>
            {isLoading ? "Gerando..." : "Criar Minhas Boas-Vindas"}
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </form>
        {isLoading && (
            <div className="mt-6 p-4 bg-secondary rounded-lg border border-border space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        )}
        {welcomeMessage && (
          <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
            <p className="text-secondary-foreground">{welcomeMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
