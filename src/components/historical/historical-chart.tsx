"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { historicalTurnout, historicalVoteShare } from '@/lib/mock-data';
import { candidates } from '@/lib/mock-data';

export function HistoricalChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Election Data</CardTitle>
        <CardDescription>Compare results from previous elections.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vote-share">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vote-share">Vote Share (%)</TabsTrigger>
            <TabsTrigger value="turnout">Turnout by Candidate (%)</TabsTrigger>
          </TabsList>
          <TabsContent value="vote-share" className="mt-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={historicalVoteShare}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                  cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Legend />
                {candidates.map((c, i) => (
                    <Bar key={c.name} dataKey={c.name} fill={c.color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="turnout" className="mt-6">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={historicalTurnout}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                   cursor={{fill: 'hsl(var(--muted))'}}
                />
                <Legend />
                {candidates.map((c, i) => (
                    <Bar key={c.name} dataKey={c.name} stackId="a" fill={c.color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
