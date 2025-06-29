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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Filter, Loader2, Trash2, Info } from "lucide-react";
import { getVisitors, getTodaysVisitors, deleteVisitor } from "@/services/visitorService";
import type { Visitor } from "@/types/visitor";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  
  const formatContact = (contact?: string) => {
    if (!contact) return "-";
    const cleaned = contact.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return contact;
  };

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
        <TooltipProvider>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] min-w-[150px]">Nome</TableHead>
                <TableHead>Data da Visita</TableHead>
                <TableHead>Crente?</TableHead>
                <TableHead>Igreja</TableHead>
                <TableHead>Aceita Visita?</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Observações</TableHead>
                {isAdmin && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Carregando visitantes...
                    </div>
                  </TableCell>
                </TableRow>
              ) : visitors.length > 0 ? (
                visitors.map((visitor) => (
                  <TableRow
                    key={visitor.id}
                    className={cn(
                      (visitor.isBeliever === "nao" || visitor.observations) && "bg-accent/20"
                    )}
                  >
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{format(visitor.visitDate, "dd/MM/yy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>
                      <Badge variant={visitor.isBeliever === "sim" ? "secondary" : "destructive"}>
                        {visitor.isBeliever === "sim" ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell>{visitor.churchName || "-"}</TableCell>
                    <TableCell>
                       <Badge variant={visitor.wantsVisit ? "default" : "outline"}>
                        {visitor.wantsVisit ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatContact(visitor.contact)}</TableCell>
                    <TableCell className="text-center">
                      {visitor.observations ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-default">
                               <Info className="h-4 w-4 text-primary" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[300px] break-words whitespace-pre-wrap">{visitor.observations}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro do visitante <span className="font-bold">{visitor.name}</span>.
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
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                    {showOnlyToday
                      ? "Nenhum visitante registrado hoje."
                      : "Nenhum visitante registrado."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
