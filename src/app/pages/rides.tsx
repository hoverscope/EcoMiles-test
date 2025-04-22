import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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

import React from 'react';
import { MapIcon } from 'lucide-react';
import { MapComponent } from '@/components/map-component'; // Import the MapComponent

export function Demo() {
  return <span>Route Planner</span>;
}

export default function Page() {
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
                    <BreadcrumbLink href="/demo" className="text-green-800 dark:text-green-200"><Demo /></BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex-1" />
            
            <div className="ml-auto mr-4">
              <ModeToggle />
            </div>
          </header>
          
          <main className="container mx-auto my-4 px-4 max-w-4xl">
            <div className="flex items-center mb-4">
              <h1 className="text-2xl font-bold tracking-tight mr-2">Route Planner</h1>
              <MapIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            
            <MapComponent />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}