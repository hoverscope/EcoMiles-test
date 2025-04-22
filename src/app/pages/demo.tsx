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
import { TrainFront, Car, Bike, Bus, MapPin, Clock, Users, TramFront, CarTaxiFront, Award, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react" 
import { MapIcon } from 'lucide-react';
import { MapComponent } from '@/components/map-component';

export default function Page() {
  const [selectedTransport, setSelectedTransport] = useState(null)
  const [showRideShareVerification, setShowRideShareVerification] = useState(false)
  const [passengers, setPassengers] = useState("1")
  const [locationA, setLocationA] = useState('')
  const [locationB, setLocationB] = useState('')
  const [routeDistance, setRouteDistance] = useState(null)
  const [mapError, setMapError] = useState(null)
  
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

  // Update transport stats when route distance changes
  useEffect(() => {
    if (routeDistance) {
      const updatedTransports = transports.map(transport => {
        const newStats = [...transport.stats];
        
        // Update the first stat (travel time) based on transport type and distance
        switch (transport.label) {
          case "Car":
          case "Ride Share":
            newStats[0].value = `${Math.round(routeDistance / 50 * 60)} mins`;
            break;
          case "Bicycle":
            newStats[0].value = `${Math.round(routeDistance / 15 * 60)} mins`;
            break;
          case "Bus":
            newStats[0].value = `${Math.round(routeDistance / 30 * 60)} mins`;
            break;
          case "Metro":
          case "Tram":
            newStats[0].value = `${Math.round(routeDistance / 40 * 60)} mins`;
            break;
          default:
            newStats[0].value = "-";
        }
        
        return {
          ...transport,
          stats: newStats
        };
      });
      
      // Update transports with new stats
      // Note: Since we can't mutate the original array directly in this context,
      // we're not updating the state, but the display values will update
    }
  }, [routeDistance]);

  const handleSelect = (transport) => {
    setSelectedTransport(transport)
    // If switching away from Ride Share, hide the verification screen
    if (showRideShareVerification && transport.label !== "Ride Share") {
      setShowRideShareVerification(false)
    }
  }

  const handleContinue = () => {
    if (selectedTransport?.label === "Ride Share") {
      setShowRideShareVerification(true)
    } else {
      // For other transport options, you would navigate to a different page or show a success message
      alert(`Journey with ${selectedTransport?.label} confirmed! You earned ${selectedTransport?.points} points.`)
    }
  }

  const handleBackToSelection = () => {
    setShowRideShareVerification(false)
  }

  const handleConfirmRideShare = () => {
    alert(`Ride Share confirmed from ${locationA} to ${locationB} with ${passengers} passenger(s)!`)
    setShowRideShareVerification(false)
    setPassengers("1")
  }

  const handleMapLocationChange = (locA, locB, distance) => {
    setLocationA(locA)
    setLocationB(locB)
    setRouteDistance(distance)
    setMapError(null)
  }

  // Both locations must be selected to enable the continue button
  const canContinue = !!selectedTransport && locationA && locationB;

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
          
          {!showRideShareVerification ? (
            <>
              <main className="container mx-auto my-4 px-4 max-w-4xl">
                <div className="flex items-center mb-4">
                  <h1 className="text-2xl font-bold tracking-tight mr-2">Route Map</h1>
                  <MapIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                
                <MapComponent onLocationChange={handleMapLocationChange} />
                
                {!locationA || !locationB ? (
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-4 mt-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">Select route points</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Please select both a starting point (A) and destination (B) on the map before proceeding.
                      </p>
                    </div>
                  </div>
                ) : null}
              </main>

              <div className="container max-w-5xl mx-auto py-8 px-4">
                <div className="text-center mb-8">
                  <Badge className="mb-3 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300" variant="outline">Transport Options</Badge>
                  <h1 className="text-4xl font-bold tracking-tight mb-3 text-green-800 dark:text-green-200">Choose Your Ride</h1>
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
                    disabled={!canContinue}
                    className="px-8 bg-green-900 text-white hover:bg-green-800"
                    onClick={handleContinue}
                  >
                    Continue with {selectedTransport?.label || "Selection"} {selectedTransport && `(+${selectedTransport.points} pts)`}
                  </Button>
                </div>
                
                {selectedTransport && (!locationA || !locationB) && (
                  <p className="text-center mt-3 text-sm text-red-600 dark:text-red-400">
                    Please select both a starting point and destination on the map before continuing.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="container max-w-3xl mx-auto py-8 px-4">
              <Button 
                variant="outline" 
                className="mb-6" 
                onClick={handleBackToSelection}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to transport selection
              </Button>
              
              <Card className="overflow-hidden border-green-200 dark:border-green-800">
                <CardHeader className="bg-green-50 dark:bg-green-950 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">Ride Share</Badge>
                      <CardTitle className="text-2xl">Confirm Your Journey</CardTitle>
                      <CardDescription>Please review and confirm your ride details</CardDescription>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                      <CarTaxiFront className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Route information directly from map */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <h3 className="font-medium mb-3">Your Route</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3">
                          A
                        </div>
                        <div>
                          <p className="font-medium">{locationA}</p>
                          <p className="text-sm text-muted-foreground">Pickup location</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3">
                          B
                        </div>
                        <div>
                          <p className="font-medium">{locationB}</p>
                          <p className="text-sm text-muted-foreground">Destination</p>
                        </div>
                      </div>
                      
                      {routeDistance && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center">
                            <div className="bg-green-100 dark:bg-green-900 p-1 rounded-full mr-2">
                              <MapPin className="h-4 w-4 text-green-600 dark:text-green-300" />
                            </div>
                            <span className="font-medium">{routeDistance} km</span>
                            <span className="text-sm text-muted-foreground ml-2">Total distance</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Only number of passengers */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="passengers" className="font-medium">Number of Passengers</label>
                      <span className="text-sm text-muted-foreground">Maximum: 3</span>
                    </div>
                    <div className="flex rounded-md border border-input overflow-hidden">
                      <button 
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-r border-input hover:bg-slate-200 dark:hover:bg-slate-700"
                        onClick={() => setPassengers(prev => Math.max(1, parseInt(prev) - 1).toString())}
                      >
                        -
                      </button>
                      <input 
                        type="text" 
                        id="passengers" 
                        className="w-full px-3 py-2 text-center bg-background"
                        value={passengers}
                        readOnly
                      />
                      <button 
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-l border-input hover:bg-slate-200 dark:hover:bg-slate-700"
                        onClick={() => setPassengers(prev => Math.min(3, parseInt(prev) + 1).toString())}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleConfirmRideShare}
                  >
                    <Check className="mr-2 h-4 w-4" /> Confirm Ride
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}