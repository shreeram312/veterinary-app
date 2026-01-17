"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconCode,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Appointments",
    url: "/dashboard/appointments",
    icon: IconCalendar,
  },
];

const developerItems = [
  {
    title: "Integration / Embed",
    url: "/dashboard/integration",
    icon: IconCode,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-white" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-transparent">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-foreground">
                  VetChat Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup className="gap-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-emerald-50 text-emerald-600 border-l-[3px] border-emerald-600 rounded-r-md rounded-l-none font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground rounded-md"
                      }
                    >
                      <Link href={item.url as any}>
                        <item.icon className="size-5!" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="gap-1 mt-4">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-2">
            Developer
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {developerItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-emerald-50 text-emerald-600 border-l-[3px] border-emerald-600 rounded-r-md rounded-l-none font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground rounded-md"
                      }
                    >
                      <Link href={item.url as any}>
                        <item.icon className="size-5!" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
