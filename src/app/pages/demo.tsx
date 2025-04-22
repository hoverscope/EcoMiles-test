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
import { 
  TrainFront, Car, Bike, Bus, MapPin, Clock, Users, 
  TramFront, CarTaxiFront, Award, ArrowLeft, Check, 
  AlertCircle, Leaf, ArrowRight
} from "lucide-react"
import { useState, useEffect } from "react" 
import { MapIcon } from 'lucide-react';
import { MapComponent } from '@/components/map-component';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// CO2 emission factors per km (in kg)
const CO2_FACTORS = {
  "Car": 0.12,       // Average car
  "Bicycle": 0,      // Zero emissions
  "Bus": 0.03,       // Per passenger
  "Metro": 0.02,     // Per passenger
  "Tram": 0.02,      // Per passenger
  "Ride Share": 0.07 // Average ride share per passenger
};

export default function Page() {
  const [selectedTransport, setSelectedTransport] = useState(null)
  const [showRideShareVerification, setShowRideShareVerification] = useState(false)
  const [passengers, setPassengers] = useState("1")
  const [locationA, setLocationA] = useState('')
  const [locationB, setLocationB] = useState('')
  const [routeDistance, setRouteDistance] = useState(null)
  const [mapError, setMapError] = useState(null)
  const [co2Emissions, setCo2Emissions] = useState(null)
  const [llmResponse, setLlmResponse] = useState(null)
  const [showTravelSimulation, setShowTravelSimulation] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [showReward, setShowReward] = useState(false)
  
  
  const transports = [
    { 
      icon: Car, 
      label: "Car", 
      description: "Door-to-door convenience with full control over your route and schedule",
      points: 0,
      stats: [
        { icon: Clock, label: "Average travel time", value: "-" },
        { icon: Users, label: "Capacity", value: "1-5 people" },
        { icon: Leaf, label: "CO2 emissions", value: "-" },
        { icon: Award, label: "Points", value: "0 pts" }
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
        { icon: Leaf, label: "CO2 emissions", value: "0 kg" },
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
        { icon: Leaf, label: "CO2 emissions", value: "-" },
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
        { icon: Leaf, label: "CO2 emissions", value: "-" },
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
        { icon: Leaf, label: "CO2 emissions", value: "-" },
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
        { icon: Leaf, label: "CO2 emissions", value: "-" },
        { icon: Award, label: "Points", value: "10 pts" }
      ]
    }
  ]

  // Update transport stats when route distance changes
  useEffect(() => {
    if (routeDistance) {
      const updatedTransports = transports.map(transport => {
        const newStats = [...transport.stats];
        
        // Update travel time based on transport type and distance
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
        
        // Update CO2 emissions
        if (transport.label !== "Bicycle") {
          const emissions = (CO2_FACTORS[transport.label] * routeDistance).toFixed(2);
          newStats[2].value = `${emissions} kg`;
        }
        
        return {
          ...transport,
          stats: newStats
        };
      });
    }
  }, [routeDistance]);

  const simulateGeminiCall = async (transportType, distance, numPassengers = 1) => {
    // This simulates a call to Gemini LLM
    // In a real implementation, you would make an API call to your Gemini instance

    // Calculate CO2 and time based on transport type
    let co2 = 0;
    let time = 0;
    let points = 0;
    
    switch(transportType) {
      case "Car":
        co2 = distance * CO2_FACTORS.Car;
        time = Math.round(distance / 50 * 60);
        points = Math.round(0 * distance / 10);
        break;
      case "Bicycle":
        co2 = 0;
        time = Math.round(distance / 15 * 60);
        points = Math.round(30 * distance / 10);
        break;
      case "Bus":
        co2 = distance * CO2_FACTORS.Bus;
        time = Math.round(distance / 30 * 60);
        points = Math.round(20 * distance / 10);
        break;
      case "Metro":
      case "Tram":
        co2 = distance * CO2_FACTORS.Metro;
        time = Math.round(distance / 40 * 60);
        points = Math.round(25 * distance / 10);
        break;
      case "Ride Share":
        co2 = (distance * CO2_FACTORS["Ride Share"]) / Math.max(1, parseInt(numPassengers));
        time = Math.round(distance / 50 * 60);
        points = Math.round(10 * distance / 10);
        break;
    }

    setCo2Emissions(co2.toFixed(2));
    setEarnedPoints(points);

    // Generate response based on transport type
    let response = "";
    if (transportType === "Car") {
      response = `Your ${distance} km journey by car will emit approximately ${co2.toFixed(2)} kg of CO2 and take about ${time} minutes. 
      
Did you know? Switching to public transport like the Metro or Bus could reduce your carbon footprint by up to 75% for this journey. Consider more sustainable options to earn more eco-points on your next trip!`;
    } else if (transportType === "Bicycle") {
      response = `Excellent choice! Your ${distance} km bicycle journey produces zero emissions and will take approximately ${time} minutes. 
      
You're making a positive impact on the environment and your health. Keep up the great work!`;
    } else if (transportType === "Bus" || transportType === "Metro" || transportType === "Tram") {
      response = `Great sustainability choice! Your ${distance} km journey by ${transportType} will emit only ${co2.toFixed(2)} kg of CO2 and take about ${time} minutes.
      
Public transportation significantly reduces carbon emissions compared to private vehicles. You're contributing to a cleaner environment!`;
    } else if (transportType === "Ride Share") {
      response = `Your ${distance} km journey by Ride Share with ${numPassengers} passenger(s) will emit approximately ${co2.toFixed(2)} kg of CO2 and take about ${time} minutes.
      
Sharing rides is more sustainable than traveling alone by car. For even greater impact, consider public transportation options like Metro or Bus when possible!`;
    }

    return response;
  }

  const handleSelect = (transport) => {
    setSelectedTransport(transport)
    // If switching away from Ride Share, hide the verification screen
    if (showRideShareVerification && transport.label !== "Ride Share") {
      setShowRideShareVerification(false)
    }
  }

  const handleContinue = async () => {
    if (selectedTransport?.label === "Ride Share") {
      setShowRideShareVerification(true)
    } else {
      // Simulate LLM call
      const response = await simulateGeminiCall(selectedTransport?.label, routeDistance);
      setLlmResponse(response);
      
      // Start travel simulation
      setShowTravelSimulation(true);
      simulateTravel();
    }
  }

  const handleBackToSelection = () => {
    setShowRideShareVerification(false)
  }

  const handleConfirmRideShare = async () => {
    // Simulate LLM call with passenger count
    const response = await simulateGeminiCall(selectedTransport?.label, routeDistance, passengers);
    setLlmResponse(response);
    
    // Start travel simulation
    setShowTravelSimulation(true);
    simulateTravel();
  }

  const simulateTravel = () => {
    // Reset progress
    setSimulationProgress(0);
    setSimulationComplete(false);
    
    // Animate progress over time
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setSimulationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setSimulationComplete(true);
        setTimeout(() => {
          setShowReward(true);
        }, 1000);
      }
    }, 50); // Progress speed
  }

  const handleMapLocationChange = (locA, locB, distance) => {
    setLocationA(locA)
    setLocationB(locB)
    setRouteDistance(distance)
    setMapError(null)
  }

  const resetJourney = () => {
    setShowTravelSimulation(false);
    setShowReward(false);
    setSimulationComplete(false);
    setShowRideShareVerification(false);
    setSelectedTransport(null);
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
          
          {!showTravelSimulation ? (
            !showRideShareVerification ? (
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
                      Select the perfect transportation method for your journey from our range of options and earn eco-reward points.
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
                                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{transport.points} points/10km</span>
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
                      Continue with {selectedTransport?.label || "Selection"} {selectedTransport && `(+${selectedTransport.points} pts/10km)`}
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
                  <CardHeader className="border-b">
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
            )
          ) : (
            <div className="container max-w-4xl mx-auto py-8 px-4">
              {!simulationComplete ? (
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 overflow-hidden">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                      Your {selectedTransport?.label} Journey is in Progress
                    </CardTitle>
                    <CardDescription>
                      Traveling from {locationA} to {locationB}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <div className="relative pt-10">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">A</div>
                          <div className="ml-2 font-medium">{locationA}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">B</div>
                          <div className="ml-2 font-medium">{locationB}</div>
                        </div>
                      </div>
                      
                      <Progress value={simulationProgress} className="h-2 bg-slate-200 dark:bg-slate-700" />
                      
                      <div 
                        className="absolute transition-all duration-300" 
                        style={{ 
                          left: `${simulationProgress}%`, 
                          top: '0',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full animate-bounce">
                          <selectedTransport.icon className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                      <div className="text-muted-foreground font-medium">
                        Estimated arrival in {selectedTransport?.stats[0].value}
                      </div>
                      
                      <div className="mt-6 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                        <h3 className="font-semibold text-xl mb-3 flex items-center justify-center">
                          <Leaf className="text-green-500 mr-2 h-5 w-5" />
                          Eco Analysis
                        </h3>
                        <div className="text-left whitespace-pre-line">
                          {llmResponse}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden border-green-200 dark:border-green-800">
                  <CardHeader className=" border-b text-center">
                    <div className="mx-auto bg-slate-800 dark:bg-slate-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-3">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                      Journey Complete!
                    </CardTitle>
                    <CardDescription>
                      You've arrived at your destination
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full inline-flex mb-2">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-medium text-lg">{routeDistance} km</h3>
                        <p className="text-sm text-muted-foreground">Distance Traveled</p>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                        <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full inline-flex mb-2">
                          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-medium text-lg">{selectedTransport?.stats[0].value}</h3>
                        <p className="text-sm text-muted-foreground">Journey Time</p>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full inline-flex mb-2">
                          <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-medium text-lg">{co2Emissions} kg</h3>
                        <p className="text-sm text-muted-foreground">CO2 Emissions</p>
                      </div>
                    </div>
                    
                    {selectedTransport?.label !== "Car" && (
  <div className="mt-6 bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
    <h3 className="font-semibold text-xl mb-3 flex items-center justify-center">
      <Award className="text-yellow-500 mr-2 h-5 w-5" />
      Points Earned
    </h3>
    <div className="flex justify-center items-center text-4xl font-bold text-green-700 dark:text-green-300">
      +{earnedPoints}
    </div>
    <p className="text-center text-sm text-muted-foreground mt-2">
      For choosing {selectedTransport?.label} for this journey
    </p>
  </div>
)}
                  </CardContent>
                  <CardFooter className="flex flex-col md:flex-row gap-3">
                    <Button 
                      className="w-full md:w-auto" 
                      variant="outline"
                      onClick={resetJourney}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Plan Another Journey
                    </Button>
                    
                    {selectedTransport?.label !== "Car" ? (
  <Button 
    className="w-full md:w-auto bg-green-700 hover:bg-green-600 text-white"
    onClick={() => setShowReward(true)}
  >
    View Summary
  </Button>
) : (
  <Button 
    className="w-full md:w-auto bg-green-700 hover:bg-green-600 text-white"
    onClick={resetJourney}
  >
    Complete Journey
  </Button>
)}

                  </CardFooter>
                </Card>
              )}
            </div>
          )}
          
          {/* Reward Dialog */}
          <Dialog open={showReward && selectedTransport?.label !== "Car"} onOpenChange={setShowReward}>
<DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-center text-2xl">
                  <Award className="h-6 w-6 text-yellow-500 mr-2" />
                  Eco Rewards Earned!
                </DialogTitle>
                <DialogDescription className="text-center">
                  Your sustainable travel choices are making a difference!
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 text-center border border-green-200 dark:border-green-800">
                  <div className="font-bold text-5xl text-green-700 dark:text-green-300 mb-2">
                    +{earnedPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Points added to your account
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-center">Redeem your points for rewards!</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-slate-50 dark:bg-slate-950">
                      <CardContent className="p-3 text-center">
                        <div className="flex justify-center mb-2">
                        </div>
                        <div className="font-medium text-sm">50% off next bus ticket</div>
                        <div className="text-xs text-muted-foreground mt-1">200 points</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-50 dark:bg-slate-950">
                      <CardContent className="p-3 text-center">
                        <div className="flex justify-center mb-2">
                        </div>
                        <div className="font-medium text-sm">Free coffee at EcoCafe</div>
                        <div className="text-xs text-muted-foreground mt-1">150 points</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowReward(false)}>
                  Close
                </Button>
                <Button 
                  className="bg-green-700 hover:bg-green-600 text-white"
                  onClick={() => {
                    setShowReward(false);
                    resetJourney();
                  }}
                >
                  <ArrowRight className="mr-2 h-4 w-4" /> Continue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}