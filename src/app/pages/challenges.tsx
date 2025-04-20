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

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Upload, Check, Bike, Train, Trophy, Clock, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function Page() {
  const [questProgress, setQuestProgress] = useState({
    cyclingDaily: 25,
    metroDaily: 40,
    walkingWeekly: 60,
    carpoolWeekly: 15
  });

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-green-800 dark:text-green-200">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/demo" className="text-green-800 dark:text-green-200">Challenges</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex-1" />
            <div className="ml-auto mr-4">
              <ModeToggle />
            </div>
          </header>
          
          <div className="container p-6">
            <h1 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-200">Eco Travel Challenge</h1>
            
            <Tabs defaultValue="quests" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="quests">Quests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="competitions">
                {/* Competition content to be added later */}
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Competition content coming soon...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="leaderboard">
                {/* Leaderboard content to be added later */}
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Leaderboard content coming soon...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="quests">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Sustainable Transport Quests</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        <Trophy className="h-4 w-4 mr-1" />
                        1240 Points
                      </Badge>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="daily">
                    <TabsList>
                      <TabsTrigger value="daily" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Daily
                      </TabsTrigger>
                      <TabsTrigger value="weekly" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Weekly
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="daily" className="mt-4 space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <Bike className="h-5 w-5 mr-2 text-green-600" />
                              <CardTitle>Cycle to Work/School</CardTitle>
                            </div>
                            <Badge>50 points</Badge>
                          </div>
                          <CardDescription>Travel 5km by bicycle today</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress: {questProgress.cyclingDaily}%</span>
                              <span>1.25km / 5km</span>
                            </div>
                            <Progress value={questProgress.cyclingDaily} className="h-2" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-green-600 hover:bg-green-700">Log Cycling Activity</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <Train className="h-5 w-5 mr-2 text-green-600" />
                              <CardTitle>Take Public Transport</CardTitle>
                            </div>
                            <Badge>30 points</Badge>
                          </div>
                          <CardDescription>Travel 10km by metro, bus or train today</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress: {questProgress.metroDaily}%</span>
                              <span>4km / 10km</span>
                            </div>
                            <Progress value={questProgress.metroDaily} className="h-2" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-green-600 hover:bg-green-700">Log Transport Activity</Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="weekly" className="mt-4 space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <svg className="h-5 w-5 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                              </svg>
                              <CardTitle>Walking Challenge</CardTitle>
                            </div>
                            <Badge>100 points</Badge>
                          </div>
                          <CardDescription>Walk 30km total this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress: {questProgress.walkingWeekly}%</span>
                              <span>18km / 30km</span>
                            </div>
                            <Progress value={questProgress.walkingWeekly} className="h-2" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-green-600 hover:bg-green-700">Log Walking Activity</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <svg className="h-5 w-5 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                              </svg>
                              <CardTitle>Carpool Champion</CardTitle>
                            </div>
                            <Badge>150 points</Badge>
                          </div>
                          <CardDescription>Carpool with others for at least 50km this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress: {questProgress.carpoolWeekly}%</span>
                              <span>7.5km / 50km</span>
                            </div>
                            <Progress value={questProgress.carpoolWeekly} className="h-2" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-green-600 hover:bg-green-700">Log Carpooling Activity</Button>
                        </CardFooter>
                      </Card>
                      
                      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-800 dark:text-green-200">Weekly Bonus</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-300">
                          Complete all weekly quests to earn an extra 200 points and a special badge!
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}