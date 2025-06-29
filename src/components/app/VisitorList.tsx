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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, Filter, Loader2 } from "lucide-react";
import { getVisitors, getTodaysVisitors } from "@/services/visitorService";
import type { Visitor } from "@/types/visitor";
import { useToast } from "@/hooks/use-toast";

export default function VisitorList() {
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

  const toggleFilter = () => {
    setShowOnlyToday(prev => !prev);
  }

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
                Use esta lista para as boas-vindas.
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Data da Visita
                </div>
              </TableHead>
              <TableHead>Membro?</TableHead>
              <TableHead>Igreja</TableHead>
              <TableHead>Aceita Visita?</TableHead>
              <TableHead>Contato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Carregando visitantes...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : visitors.length > 0 ? (
              visitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>
                    {format(visitor.visitDate, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        visitor.isBeliever === "sim" ? "secondary" : "outline"
                      }
                    >
                      {visitor.isBeliever === "sim" ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>{visitor.churchName || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={visitor.wantsVisit ? "default" : "outline"}>
                      {visitor.wantsVisit ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>{visitor.contact || "Não informado"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  {showOnlyToday
                    ? "Nenhum visitante registrado hoje."
                    : "Nenhum visitante registrado."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
