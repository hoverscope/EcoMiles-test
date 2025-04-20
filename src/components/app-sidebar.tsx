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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Car,
      plan: "Enterprise",
    },
  ],
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
            title: "Oboarding",
            url: "/on-board",
          },
          {
            title: "Challenges",
            url: "/challenges",
          },

      ],
    },
    
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}