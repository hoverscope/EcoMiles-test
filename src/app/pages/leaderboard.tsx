import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Upload, Check, Bike, Train, Trophy, Clock, Calendar, ArrowUp, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Plot from 'react-plotly.js';


export default function Page() {
 
  const [leaderboardData, setLeaderboardData] = useState({
    labels: ['Sarah K.', 'You', 'Michael R.', 'Priya T.', 'Alex J.', 'Tomas L.'],
    values: [1865, 1760, 1620, 1485, 1320, 1210],
    colors: ['#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'],
    rank: 2,
    pointsToNext: 105,
    percentToNext: 75,
    trend: '+15%'
  });

  const timeOptions = [
    { value: 'daily', label: 'DAILY' },
    { value: 'weekly', label: 'MON - SUN' },
    { value: 'monthly', label: 'MONTHLY' },
  ];

  const [selectedTime, setSelectedTime] = useState('daily');

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
        <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-green-800 dark:text-green-200">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/demo" className="text-green-800 dark:text-green-200">Transport</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex-1" />
            <ModeToggle />
          </header>
          
          <div className="container p-6">
            <div className="space-y-6">
              {/* Title section with country name */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-wider uppercase">ECO TRAVELER LEADERBOARD</h1>
              </div>

              <div className="mb-8 h-64">
                        <Plot
                          data={[
                            {
                              type: 'bar',
                              x: leaderboardData.labels,
                              y: leaderboardData.values,
                              marker: {
                                color: leaderboardData.colors
                              },
                              text: leaderboardData.values.map(v => v + ' pts'),
                              textposition: 'auto',
                              hoverinfo: 'none',
                              width: 0.6,
                            }
                          ]}
                          layout={{
                            margin: {t: 0, r: 0, l: 40, b: 40},
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            autosize: true,
                            xaxis: {
                              tickangle: 0,
                              fixedrange: true
                            },
                            yaxis: {
                              title: 'Points',
                              fixedrange: true
                            },
                            font: {
                              family: 'Inter, sans-serif'
                            }
                          }}
                          config={{
                            displayModeBar: false,
                            responsive: true
                          }}
                          style={{width: '100%', height: '100%'}}
                        />
                      </div>

              
              {/* Time period selector */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-full p-1">
                  {timeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedTime === option.value ? "default" : "ghost"}
                      className={`rounded-full px-6 ${selectedTime === option.value ? 'bg-white dark:bg-slate-700 text-green-700 shadow-sm' : 'text-slate-500'}`}
                      onClick={() => setSelectedTime(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Daily/Weekly/Monthly strain */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg text-green-500 font-medium">DAY STRAIN</h2>
                  <p className="text-xl font-bold">{(Math.random() * 5 + 3).toFixed(1)} avg</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">TODAY</p>
                  <p className="text-sm text-slate-500">Last Updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              
              {/* Leaderboard list */}
              <div className="space-y-4">
                {leaderboardData.labels.slice(0, 6).map((name, index) => {
                  const isYou = name === 'You';
                  return (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${isYou ? 'bg-green-50 dark:bg-green-950' : ''}`}>
                      <div className="font-bold text-xl mr-2 w-8 text-center">{index + 1}.</div>
                      
                      <Avatar className={`h-14 w-14 rounded-full border-2 ${isYou ? 'border-green-500' : 'border-slate-200'}`}>
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-bold text-base">{name} {isYou && <span className="text-green-500">(You)</span>}</p>
                          <span className="font-bold text-green-500">{leaderboardData.values[index] / 100} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-slate-500">
                            {index === 0 ? 'Cycling 18.5, Walking 15.2' : 
                             index === 1 ? 'Public Transit 20.6' :
                             index === 2 ? 'Walking 20.3' :
                             `Eco Travel ${(Math.random() * 5 + 15).toFixed(1)}`}
                          </p>
                          <p className="text-sm text-slate-500">{(Math.floor(Math.random() * 3000) + 1500).toLocaleString()} Calories</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Podium visualization for top performers */}
            <Card>
                <CardHeader>
                  <CardTitle>Top Eco Travelers Podium</CardTitle>
                  <CardDescription>Based on sustainable transport points earned this month</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="relative h-60 flex items-end justify-center">
                    {/* Second Place */}
                    <div className="absolute bottom-0 left-0 w-1/3 flex flex-col items-center">
                      <Avatar className="h-16 w-16 rounded-full border-4 border-slate-200 mb-2">
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {leaderboardData.labels[1]?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-200 dark:bg-slate-700 w-full rounded-t-lg h-28 flex flex-col items-center justify-end p-2">
                        <Badge className="mb-2 bg-blue-500">{leaderboardData.values[1]} pts</Badge>
                        <div className="bg-slate-300 dark:bg-slate-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">2</div>
                      </div>
                    </div>
                    
                    {/* First Place */}
                    <div className="absolute bottom-0 left-1/3 w-1/3 flex flex-col items-center z-10">
                      <Avatar className="h-20 w-20 rounded-full border-4 border-yellow-400 mb-2">
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {leaderboardData.labels[0]?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-yellow-100 dark:bg-yellow-900 w-full rounded-t-lg h-40 flex flex-col items-center justify-end p-2">
                        <Badge className="mb-2 bg-yellow-500">{leaderboardData.values[0]} pts</Badge>
                        <div className="bg-yellow-400 dark:bg-yellow-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">1</div>
                      </div>
                    </div>
                    
                    {/* Third Place */}
                    <div className="absolute bottom-0 right-0 w-1/3 flex flex-col items-center">
                      <Avatar className="h-14 w-14 rounded-full border-4 border-amber-700 mb-2">
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {leaderboardData.labels[2]?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-amber-100 dark:bg-amber-900/50 w-full rounded-t-lg h-20 flex flex-col items-center justify-end p-2">
                        <Badge className="mb-2 bg-amber-700">{leaderboardData.values[2]} pts</Badge>
                        <div className="bg-amber-700 dark:bg-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">3</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
              {/* Progress bar to catch first place */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center border-2 border-green-600">
                    👑
                  </div>
                  <div>
                    <p className="font-medium text-base sm:text-lg">You're in 2nd place!</p>
                    <p className="text-sm text-muted-foreground">
                      Just {leaderboardData.pointsToNext} points away from 1st place
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <ArrowRight className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">
                    Keep pushing, you're almost there!
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to 1st place</span>
                  <span className="text-green-600 font-medium">{leaderboardData.percentToNext}%</span>
                </div>
                <Progress value={leaderboardData.percentToNext} className="h-2" />
              </div>
              
              {/* Your Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Distance</p>
                        <p className="text-2xl font-bold">128.5 km</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                        <p className="text-2xl font-bold">45.2 kg</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Quests Completed</p>
                        <p className="text-2xl font-bold">14/20</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Weekly Streak</p>
                        <p className="text-2xl font-bold">8 weeks</p>
                      </div>
                    </div>
                    
                    <Alert className="border-green-200 dark:border-green-800">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <AlertTitle>Weekly Challenge Tip</AlertTitle>
                      <AlertDescription>
                        Try cycling to work twice this week to overtake Sarah and reach 1st place!
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}