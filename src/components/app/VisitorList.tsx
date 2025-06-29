"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, Filter, Loader2, Trash2, Church, HandHeart, Phone, FileText } from "lucide-react";
import { getVisitors, getTodaysVisitors, deleteVisitor } from "@/services/visitorService";
import type { Visitor } from "@/types/visitor";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface VisitorListProps {
  isAdmin?: boolean;
}

export default function VisitorList({ isAdmin = false }: VisitorListProps) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyToday, setShowOnlyToday] = useState(true);
  const { toast } = useToast();

  const fetchVisitors = useCallback(async () => {
    setIsLoading(true);
    try {
      const visitorData = showOnlyToday
        ? await getTodaysVisitors()
        : await getVisitors();
      setVisitors(visitorData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Carregar Visitantes",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
      setVisitors([]);
    } finally {
      setIsLoading(false);
    }
  }, [showOnlyToday, toast]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);
  
  const handleDeleteVisitor = async (id: string) => {
    try {
      await deleteVisitor(id);
      setVisitors(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Sucesso!",
        description: "Visitante excluído com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Excluir",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    }
  };

  const toggleFilter = () => {
    setShowOnlyToday(prev => !prev);
  }

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
             <div className="flex gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-2/4" />
            </div>
             <div className="flex gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-3/5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">
                Lista de Visitantes
              </CardTitle>
              <CardDescription>
                {isAdmin ? "Gerencie os registros de visitantes." : "Use esta lista para as boas-vindas."}
              </CardDescription>
            </div>
          </div>
          <Button onClick={toggleFilter} disabled={isLoading}>
            <Filter className="mr-2 h-4 w-4" />
            {showOnlyToday ? "Mostrar Todos" : "Mostrar Somente Hoje"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderSkeleton()
        ) : visitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visitors.map((visitor) => (
              <Card 
                key={visitor.id} 
                className={cn(
                  "flex flex-col transition-all duration-300", 
                  visitor.isBeliever === 'nao' && 'border-accent shadow-lg shadow-accent/20'
                )}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <CardTitle className="text-xl font-headline">{visitor.name}</CardTitle>
                  {isAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <Trash2 className="h-4 w-4 text-destructive" />
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro do visitante.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteVisitor(visitor.id)} className="bg-destructive hover:bg-destructive/90">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardHeader>
                <CardContent className="flex-grow space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data da Visita</p>
                      <p className="font-medium">{format(visitor.visitDate, "dd/MM/yyyy", { locale: ptBR })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                     <Users className="h-4 w-4 text-primary mt-1" />
                     <div>
                       <p className="text-xs text-muted-foreground">Crente?</p>
                       <Badge variant={visitor.isBeliever === "sim" ? "secondary" : "destructive"}>
                         {visitor.isBeliever === "sim" ? "Sim" : "Não"}
                       </Badge>
                     </div>
                  </div>

                  {visitor.churchName && (
                    <div className="flex items-start gap-3">
                      <Church className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Igreja</p>
                        <p className="font-medium">{visitor.churchName}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <HandHeart className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Aceita Visita?</p>
                       <Badge variant={visitor.wantsVisit ? "default" : "outline"}>
                        {visitor.wantsVisit ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                  
                  {visitor.contact && (
                     <div className="flex items-start gap-3">
                       <Phone className="h-4 w-4 text-primary mt-1" />
                       <div>
                         <p className="text-xs text-muted-foreground">Contato</p>
                         <p className="font-medium">{visitor.contact}</p>
                       </div>
                     </div>
                  )}

                  {visitor.observations && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Observações</p>
                        <p className="font-medium break-words">{visitor.observations}</p>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-border">
            <p className="text-muted-foreground">
              {showOnlyToday
                ? "Nenhum visitante registrado hoje."
                : "Nenhum visitante registrado."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
