"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, User, Calendar } from "lucide-react";
import {
  listenToPrayerRequests,
  deletePrayerRequest,
} from "@/services/prayerRequestService";
import type { PrayerRequest } from "@/types/prayerRequest";
import { useToast } from "@/hooks/use-toast";

export default function PrayerRequestList() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = listenToPrayerRequests(
      (updatedRequests) => {
        setRequests(updatedRequests);
        setIsLoading(false);
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Erro ao Carregar Pedidos",
          description: error.message,
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleDeleteRequest = async (id: string) => {
    try {
      await deletePrayerRequest(id);
      toast({
        title: "Sucesso!",
        description: "Pedido de oração removido.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Excluir",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro desconhecido.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando pedidos de oração...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-2xl font-headline font-semibold">
          Nenhum Pedido de Oração
        </h3>
        <p className="text-muted-foreground mt-2">
          Ainda não há pedidos de oração registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <Card key={request.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{request.name || "Anônimo"}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-foreground whitespace-pre-wrap">
              {request.request}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(request.createdAt, "dd/MM/yy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você tem certeza que deseja remover este pedido de oração?
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteRequest(request.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
