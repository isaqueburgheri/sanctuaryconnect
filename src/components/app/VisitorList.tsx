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
import { Users } from "lucide-react";

const visitors = [
  {
    id: 1,
    name: "Carlos Pereira",
    isBeliever: "sim",
    churchName: "Igreja Batista da Esperança",
    contact: "(11) 98765-4321",
    wantsVisit: true,
  },
  {
    id: 2,
    name: "Ana Julia",
    isBeliever: "nao",
    churchName: "",
    contact: "(21) 99999-8888",
    wantsVisit: false,
  },
  {
    id: 3,
    name: "Família Oliveira",
    isBeliever: "sim",
    churchName: "AD Madureira",
    contact: "",
    wantsVisit: false,
  },
  {
    id: 4,
    name: "Ricardo Mendes",
    isBeliever: "nao",
    churchName: "",
    contact: "(11) 91234-5678",
    wantsVisit: true,
  },
];

export default function VisitorList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-3xl">
            Lista de Visitantes
          </CardTitle>
        </div>
        <CardDescription>
          Visitantes registrados hoje. Use esta lista para as boas-vindas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Membro de Igreja?</TableHead>
              <TableHead>Igreja</TableHead>
              <TableHead>Aceita Visita?</TableHead>
              <TableHead>Contato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell className="font-medium">{visitor.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={visitor.isBeliever === "sim" ? "secondary" : "outline"}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
