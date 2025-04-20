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
import { AlertCircle, Upload, Check, Bike, Train, Trophy, Clock, Calendar, ArrowUp, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Plot from 'react-plotly.js';

export default function Page() {
  const [questProgress, setQuestProgress] = useState({
    cyclingDaily: 25,
    metroDaily: 40,
    walkingWeekly: 60,
    carpoolWeekly: 15
  });

  const [leaderboardData, setLeaderboardData] = useState({
    labels: ['Sarah K.', 'You', 'Michael R.', 'Priya T.'],
    values: [1865, 1760, 1620, 1485],
    colors: ['#84cc16', '#22c55e', '#10b981', '#14b8a6'],
    rank: 2,
    pointsToNext: 105,
    percentToNext: 75,
    trend: '+15%'
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
            
            <Tabs defaultValue="leaderboard" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="quests">Quests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="competitions">
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Active Competitions</h2>
      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
        <Trophy className="h-4 w-4 mr-1" />
        3 Active
      </Badge>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Spring Cycling Challenge</CardTitle>
              <CardDescription>April 15 - May 15</CardDescription>
            </div>
            <Badge className="bg-amber-500">Featured</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Cycle 200km in one month and earn exclusive rewards.</p>
          <div className="flex justify-between text-sm mb-2">
            <span>Your progress:</span>
            <span>68km / 200km</span>
          </div>
          <Progress value={34} className="h-2 mb-4" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">432 participants</p>
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">View Details</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>City Transit Warriors</CardTitle>
              <CardDescription>April 1 - April 30</CardDescription>
            </div>
            <Badge className="bg-green-600">Team</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Join a team and compete to reduce carbon emissions in your city.</p>
          <div className="flex justify-between text-sm mb-2">
            <span>Team rank:</span>
            <span>5th of 12</span>
          </div>
          <Progress value={60} className="h-2 mb-4" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">18 teams competing</p>
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">View Details</Button>
        </CardFooter>
      </Card>
    </div>
    
    <Card>
  <CardHeader>
    <CardTitle>Upcoming Competition</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg w-fit">
        <Calendar className="h-8 w-8 text-green-700" />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-lg">Summer Sustainable Travel Festival</h3>
        <p className="text-muted-foreground">Starts May 20, 2025</p>
        <p className="mt-2">Grand prize: Electric scooter and sustainability kit</p>
      </div>

      <div className="sm:ml-auto">
        <Button className="w-full sm:w-auto bg-green-900 text-white hover:bg-green-800">Pre-register</Button>
      </div>
    </div>
  </CardContent>
</Card>

  </div>
</TabsContent>
              
              <TabsContent value="leaderboard">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">April Leaderboard</h2>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                      {leaderboardData.trend} this week
                    </Badge>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Eco Travelers</CardTitle>
                      <CardDescription>Based on sustainable transport points earned this month</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-lg">Top Performers</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {leaderboardData.labels.slice(0, 3).map((name, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-bold">
            {index + 1}
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">
            {name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              {index === 0 ? 'Cycling Champion' : index === 1 ? 'Transport Master' : 'Walking Pro'}
            </p>
          </div>
          <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} className={index === 0 ? "bg-green-600" : ""}>
            {leaderboardData.values[index]} pts
          </Badge>
        </div>
      ))}
    </div>
  </CardContent>
</Card>


                    
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