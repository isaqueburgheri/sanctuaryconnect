"use client";

import { useState, useEffect, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { getVisitors } from '@/services/visitorService';
import type { Visitor } from '@/types/visitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Users, HandHeart } from 'lucide-react';

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getVisitors();
        setVisitors(data);
      } catch (error) {
        console.error("Failed to fetch visitors", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const dashboardData = useMemo(() => {
    if (visitors.length === 0) {
      return {
        totalVisitors: 0,
        wantsVisitCount: 0,
        monthlyChartData: [],
      };
    }

    const currentYear = getYear(new Date());

    const visitorsThisYear = visitors.filter(v => getYear(v.visitDate) === currentYear);

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: ptBR.localize?.month(i, { width: 'abbreviated' }).replace('.', '') || '',
      total: 0,
    }));

    visitorsThisYear.forEach(visitor => {
      const month = getMonth(visitor.visitDate);
      if (monthlyData[month]) {
        monthlyData[month].total += 1;
      }
    });

    const wantsVisitCount = visitors.filter(v => v.wantsVisit).length;

    return {
      totalVisitors: visitors.length,
      wantsVisitCount,
      monthlyChartData: monthlyData,
    };
  }, [visitors]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Visitantes</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalVisitors}</div>
          <p className="text-xs text-muted-foreground">Desde o início dos registros</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aceitaram Visita</CardTitle>
          <HandHeart className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.wantsVisitCount}</div>
          <p className="text-xs text-muted-foreground">Pessoas que gostariam de receber uma visita</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Visitantes por Mês (Ano Corrente)</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
           <ChartContainer config={{
              total: {
                label: "Visitantes",
                color: "hsl(var(--chart-1))",
              },
            }} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.monthlyChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                 <Tooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
