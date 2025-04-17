import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrainFront, Car, Bike, Bus, MapPin, Clock, Users, TramFront, CarTaxiFront, Award } from "lucide-react"
import { useState } from "react" 

export default function Page() {
  const [selectedTransport, setSelectedTransport] = useState(null)
  
  const transports = [
    { 
      icon: Car, 
      label: "Car", 
      description: "Door-to-door convenience with full control over your route and schedule",
      points: 5,
      stats: [
        { icon: Clock, label: "Average travel time", value: "-" },
        { icon: Users, label: "Capacity", value: "1-5 people" },
        { icon: MapPin, label: "Custom", value: "-" },
        { icon: Award, label: "Points", value: "5 pts" }
      ]
    },
    { 
      icon: Bike, 
      label: "Bicycle", 
      description: "Zero-emission travel for short distances, avoiding traffic jams",
      points: 30,
      stats: [
        { icon: Clock, label: "Average travel time", value: "-" },
        { icon: Users, label: "Capacity", value: "1 person" },
        { icon: MapPin, label: "Pick-up", value: "Self-service" },
        { icon: Award, label: "Points", value: "30 pts" }
      ]
    },
    { 
      icon: Bus, 
      label: "Bus", 
      description: "Budget-friendly shared transit with dedicated lanes in some areas",
      points: 20,
      stats: [
        { icon: Clock, label: "Average travel time", value: "-" },
        { icon: Users, label: "Capacity", value: "30+ people" },
        { icon: MapPin, label: "Pick-up", value: "Designated stops" },
        { icon: Award, label: "Points", value: "20 pts" }
      ]
    },
    { 
      icon: TrainFront, 
      label: "Metro", 
      description: "High-speed underground rail for predictable inner-city travel",
      points: 25,
      stats: [
        { icon: Clock, label: "Average travel time", value: "-" },
        { icon: Users, label: "Capacity", value: "100+ people" },
        { icon: MapPin, label: "Pick-up", value: "Scheduled" },
        { icon: Award, label: "Points", value: "25 pts" }
      ]
    },
    { 
      icon: TramFront, 
      label: "Tram", 
      description: "Eco-friendly light rail with frequent stops in urban centers",
      points: 25,
      stats: [
        { icon: Clock, label: "Average travel time", value: "-" },
        { icon: Users, label: "Capacity", value: "100+ people" },
        { icon: MapPin, label: "Pick-up", value: "Scheduled" },
        { icon: Award, label: "Points", value: "25 pts" }
      ]
    },
    { 
      icon: CarTaxiFront, 
      label: "Ride Share", 
      description: "On-demand private rides with flexible pickup/drop-off points",
      points: 10,
      stats: [
        { icon: Clock, label: "Average travel time", value: "-" },
        { icon: Users, label: "Capacity", value: "2-3 people" },
        { icon: MapPin, label: "Pick-up", value: "On-demand" },
        { icon: Award, label: "Points", value: "10 pts" }
      ]
    }
  ]

  const handleSelect = (transport) => {
    setSelectedTransport(transport)
  }

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
          
          <div className="container max-w-5xl mx-auto py-8 px-4">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300" variant="outline">Transport Options</Badge>
              <h1 className="text-4xl font-bold tracking-tight mb-3 text-green-800 dark:text-green-00">Choose Your Ride</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Select the perfect transportation method for your journey from our range of options and earn reward points.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {transports.map((transport) => (
                <Card 
                  key={transport.label} 
                  className={`overflow-hidden transition-all duration-300 hover:border-primary ${selectedTransport?.label === transport.label ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{transport.label}</CardTitle>
                        <div className="mt-1 flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{transport.points} points</span>
                        </div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                        <transport.icon className="h-6 w-6 text-green-600 dark:text-green-300" />
                      </div>
                    </div>
                    <CardDescription>{transport.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-4 gap-2">
                      {transport.stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center justify-center text-center p-2">
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mb-2">
                            <stat.icon className="h-4 w-4 text-green-600 dark:text-green-300" />
                          </div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                          <div className="font-medium text-sm">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={selectedTransport?.label === transport.label ? "default" : "outline"}
                      onClick={() => handleSelect(transport)}
                    >
                      {selectedTransport?.label === transport.label ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                disabled={!selectedTransport}
                className="px-8"
              >
                Continue with {selectedTransport?.label || "Selection"} {selectedTransport && `(+${selectedTransport.points} pts)`}
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}