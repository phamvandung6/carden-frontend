'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useProgressData } from '../hooks/use-progress-data';
import { cn } from '@/lib/utils';

interface ProgressChartProps {
  className?: string;
  height?: number;
  showTitle?: boolean;
}

export function ProgressChart({ 
  className, 
  height = 300, 
  showTitle = true 
}: ProgressChartProps) {
  const { 
    accuracyChartData, 
    studyTimeChartData, 
    cardsStudiedChartData,
    isLoading,
    error,
    hasData
  } = useProgressData();

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          {showTitle && (
            <CardTitle>Progress Chart</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !hasData) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          {showTitle && (
            <CardTitle>Progress Chart</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {error ? 'Failed to load chart data' : 'No data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        {showTitle && (
          <>
            <CardTitle>Progress Over Time</CardTitle>
            <CardDescription>
              Track your learning progress across different metrics
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="accuracy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="studyTime">Study Time</TabsTrigger>
            <TabsTrigger value="cardsStudied">Cards Studied</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accuracy" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your accuracy percentage over time
            </p>
          </TabsContent>
          
          <TabsContent value="studyTime" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studyTimeChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Minutes spent studying per week
            </p>
          </TabsContent>
          
          <TabsContent value="cardsStudied" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cardsStudiedChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--accent-foreground))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent-foreground))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--accent-foreground))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Number of cards studied per week
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
