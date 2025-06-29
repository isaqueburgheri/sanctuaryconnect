"use client";

import { useState } from "react";
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
import { Users, CalendarDays, Filter } from "lucide-react";

// Dados de exemplo com datas
const today = new Date();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const allVisitors = [
  {
    id: 1,
    name: "Carlos Pereira",
    isBeliever: "sim",
    churchName: "Igreja Batista da Esperança",
    contact: "(11) 98765-4321",
    wantsVisit: true,
    visitDate: today,
  },
  {
    id: 2,
    name: "Ana Julia",
    isBeliever: "nao",
    churchName: "",
    contact: "(21) 99999-8888",
    wantsVisit: false,
    visitDate: today,
  },
  {
    id: 3,
    name: "Família Oliveira",
    isBeliever: "sim",
    churchName: "AD Madureira",
    contact: "",
    wantsVisit: false,
    visitDate: yesterday,
  },
  {
    id: 4,
    name: "Ricardo Mendes",
    isBeliever: "nao",
    churchName: "",
    contact: "(11) 91234-5678",
    wantsVisit: true,
    visitDate: twoDaysAgo,
  },
  {
    id: 5,
    name: "Mariana Costa",
    isBeliever: "sim",
    churchName: "AD Belém - Setor 25",
    contact: "(11) 98888-7777",
    wantsVisit: true,
    visitDate: today,
  },
];

export default function VisitorList() {
  const [showOnlyToday, setShowOnlyToday] = useState(true);

  const filteredVisitors = showOnlyToday
    ? allVisitors.filter((visitor) => {
        const visitorDate = new Date(visitor.visitDate);
        return (
          visitorDate.getDate() === today.getDate() &&
          visitorDate.getMonth() === today.getMonth() &&
          visitorDate.getFullYear() === today.getFullYear()
        );
      })
    : allVisitors;

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
          <Button onClick={() => setShowOnlyToday(!showOnlyToday)}>
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
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor) => (
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
