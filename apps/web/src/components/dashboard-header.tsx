"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="text-lg font-semibold text-foreground">Overview</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative rounded-md">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button
          variant="ghost"
          className="rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          onClick={async () => await authClient.signOut()}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
