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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

import { Home, Bike, Award, MessageSquare, Gift, X, Coffee, History, Music, ShoppingBag, Trophy, Target, Users, ChevronRight, QrCode } from "lucide-react"


export default function Page() {
  return (
    <ThemeProvider>
      <SidebarProvider>
          <AppSidebar/>
          <SidebarInset >
          <header className="flex h-16 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Rewards</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              <div className="flex-1" />

              <div className="ml-auto mr-4">
                <ModeToggle />
              </div>
            </header>
            
            <main className="px-4 py-6 ">
              <div className="flex flex-col gap-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Rewards</h1>
                    <p className="text-muted-foreground mt-1">Earn points and redeem exclusive rewards</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                  
                    

                <Drawer>
                  <DrawerTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                  How To Earn
                        </Button>
                     
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerClose className="absolute right-4 top-4">
                        <X className="h-4 w-4" />
                      </DrawerClose>
                      <DrawerTitle className="text-xl text-center">How to Earn Points?</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-2">
                          <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <h3 className="font-medium text-center">Win a Challenge</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          Finish challenge 1st, 2nd or 3rd and receive points.
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-2">
                          <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <h3 className="font-medium text-center">Participate in Challenges</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          You can receive points by participation on any challenge you like.
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-2">
                          <Target className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <h3 className="font-medium text-center">Reach goals in Challenges</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          Each challenge has their own goals, accept and complete them to earn points.
                        </p>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

                    <Drawer>
                      <DrawerTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                      Redeem Points
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerClose className="absolute right-4 top-4">
                              <X className="h-4 w-4" />
                            </DrawerClose>
                            <DrawerTitle className="text-xl text-center">Redeem Your Points</DrawerTitle>
                            <DrawerDescription className="text-center">
                              Scan this QR code at checkout or show to store associate
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-6 flex flex-col items-center space-y-6">
                            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 w-64 h-64 flex items-center justify-center">
                            <img src="/assets/qr-code.png" alt="QR Code" />
                            </div>
                            
                            <div className="text-center">
                              <p className="text-lg font-medium">3,750 Available Points</p>
                              <p className="text-sm text-muted-foreground mt-1">ID: #38291-REW</p>
                            </div>
                            
                            <Button className="w-full">Download QR Code</Button>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
                
                {/* Points Summary Card */}
                <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-lg font-medium text-muted-foreground">Available Points</p>
                        <h2 className="text-4xl md:text-5xl font-bold">3,750</h2>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Tier Progress</span>
                          <span className="text-sm font-medium">3,750 / 5,000</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-muted-foreground">Silver</span>
                          <span className="text-xs text-muted-foreground">Gold</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <Badge className="bg-gradient-to-r from-zinc-400 to-zinc-500 hover:from-zinc-500 hover:to-zinc-600">
                          Silver Member
                        </Badge>
                        <p className="text-xs text-muted-foreground">1,250 points until Gold</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">

                {/* Tabs Section */}
                <Tabs defaultValue="available" className="w-full ">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="available">Rewards</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="perks">Perks</TabsTrigger>
                  </TabsList>
                  
                  {/* Available Rewards Tab */}
                  <TabsContent value="available" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Reward Card 1 */}
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Card className="cursor-pointer hover:border-blue-500 transition-all duration-200">
                            <CardHeader className="pb-3">
                              <CardTitle>$10 Store Credit</CardTitle>
                              <CardDescription>Valid for 30 days after redemption</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                  >
                                    <path d="M12 2v20" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                  </svg>
                                  <span className="font-medium">1,000 points</span>
                                </div>
                                <ChevronRight size={18} className="text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                              <DrawerClose className="absolute right-4 top-4">
                                <X className="h-4 w-4" />
                              </DrawerClose>
                              <DrawerTitle className="text-xl text-center">$10 Store Credit</DrawerTitle>
                              <DrawerDescription className="text-center">
                                Redeem 1,000 points for store credit
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-6 flex flex-col items-center space-y-6">
                              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 w-64 h-64 flex items-center justify-center">
                              <img src="/assets/qr-code.png" alt="QR Code" />
                              </div>
                              
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Valid for 30 days after redemption</p>
                                <p className="text-lg font-medium mt-2">1,000 points</p>
                              </div>
                              
                              <Button className="w-full">Redeem Reward</Button>
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                      
                      {/* Reward Card 2 */}
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Card className="cursor-pointer hover:border-blue-500 transition-all duration-200">
                            <CardHeader className="pb-3">
                              <CardTitle>Free Coffe</CardTitle>
                              <CardDescription>On your next visit</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                  >
                                    <path d="M12 2v20" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                  </svg>
                                  <span className="font-medium">500 points</span>
                                </div>
                                <ChevronRight size={18} className="text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                              <DrawerClose className="absolute right-4 top-4">
                                <X className="h-4 w-4" />
                              </DrawerClose>
                              <DrawerTitle className="text-xl text-center">Free Shipping</DrawerTitle>
                              <DrawerDescription className="text-center">
                                Redeem 500 points for free shipping on your next order
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-6 flex flex-col items-center space-y-6">
                              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 w-64 h-64 flex items-center justify-center">
                              <img src="/assets/qr-code.png" alt="QR Code" />
                              </div>
                              
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Apply at checkout</p>
                                <p className="text-lg font-medium mt-2">500 points</p>
                              </div>
                              
                              <Button className="w-full">Redeem Reward</Button>
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>

                      {/* Reward Card 3 */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle>Premium Membership</CardTitle>
                            <Badge variant="outline" className="text-yellow-500 border-yellow-500">Gold Only</Badge>
                          </div>
                          <CardDescription>1 month of premium benefits</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-500"
                              >
                                <path d="M12 2v20" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              </svg>
                              <span className="font-medium">2,500 points</span>
                            </div>
                            <Button size="sm" variant="outline" disabled>Unavailable</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {/* Points History Tab */}
                  <TabsContent value="history">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your points activity from the past 30 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Transaction Item */}
                          <div className="flex justify-between items-center pb-4 border-b">
                            <div>
                              <p className="font-medium">Purchase #38291</p>
                              <p className="text-sm text-muted-foreground">Mar 28, 2025</p>
                            </div>
                            <Badge variant="outline" className="text-green-500 border-green-500">+250 points</Badge>
                          </div>
                          
                          {/* Transaction Item */}
                          <div className="flex justify-between items-center pb-4 border-b">
                            <div>
                              <p className="font-medium">Redeemed Store Credit</p>
                              <p className="text-sm text-muted-foreground">Mar 15, 2025</p>
                            </div>
                            <Badge variant="outline" className="text-red-500 border-red-500">-1,000 points</Badge>
                          </div>
                          
                          {/* Transaction Item */}
                          <div className="flex justify-between items-center pb-4 border-b">
                            <div>
                              <p className="font-medium">Purchase #37845</p>
                              <p className="text-sm text-muted-foreground">Mar 10, 2025</p>
                            </div>
                            <Badge variant="outline" className="text-green-500 border-green-500">+500 points</Badge>
                          </div>
                          
                          {/* Transaction Item */}
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Referral Bonus</p>
                              <p className="text-sm text-muted-foreground">Mar 5, 2025</p>
                            </div>
                            <Badge variant="outline" className="text-green-500 border-green-500">+1,000 points</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full">View All History</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  {/* Member Perks Tab */}
                  <TabsContent value="perks">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Current Tier Card */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle>Silver Benefits</CardTitle>
                            <Badge className="bg-gradient-to-r from-zinc-400 to-zinc-500">Current</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Earn 1 point per $1 spent</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Birthday reward</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Exclusive newsletter</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Free shipping on orders over $50</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      {/* Next Tier Card */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle>Gold Benefits</CardTitle>
                            <Badge variant="outline">Next Tier</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>All Silver benefits</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Earn 1.5 points per $1 spent</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Early access to new products</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Free shipping on all orders</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="18" 
                                height="18" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-green-500"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              <span>Exclusive Gold-only rewards</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                </div>

                
                {/* Ways to Earn Section */}
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-4">Ways to Earn More Points</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Refer a Friend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Earn 1,000 points for each friend who signs up and makes a purchase.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="secondary" className="w-full">Share Referral Link</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Complete Your Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Earn 500 points by completing all sections of your profile.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="secondary" className="w-full">Update Profile</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Write a Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Earn 200 points for each product review you submit with photos.</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="secondary" className="w-full">Write a Review</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>

             
            </main>
          </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}