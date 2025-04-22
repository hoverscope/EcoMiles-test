import * as React from "react"
import {
  Car,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Simplified data with only one menu item "Demo"
const data = {
 
  navMain: [
    {
      title: "Demo",
      url: "/demo",
      icon: Car,
      isActive: true,
      items: [
        {
          title: "Rides",
          url: "/demo",
          
        },
          {
            title: "Rewards",
            url: "/rewards",
          },
          {
            title: "Onboarding",
            url: "/on-board",
          },
          {
            title: "Challenges",
            url: "/challenges",
          },
          {
            title: "Rides",
            url: "/rides",
          },


      ],
    },
    
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    
      <SidebarRail />
    </Sidebar>
  )
}