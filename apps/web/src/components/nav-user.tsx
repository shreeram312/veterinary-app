"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function NavUser() {
  const { data } = authClient.useSession();

  const initials = data?.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage
            src={data?.user.image ?? undefined}
            alt={data?.user.name ?? undefined}
          />
          <AvatarFallback className="rounded-full bg-emerald-600 text-white text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left min-w-0">
          <span className="text-sm font-medium text-foreground truncate block">
            {data?.user.name || "User"}
          </span>
        </div>
        <IconDotsVertical className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side="top"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-9 w-9 rounded-full">
                <AvatarImage
                  src={data?.user.image ?? undefined}
                  alt={data?.user.name ?? undefined}
                />
                <AvatarFallback className="rounded-full bg-emerald-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm block truncate">
                  {data?.user.name}
                </span>
                <span className="text-muted-foreground text-xs block truncate">
                  {data?.user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer rounded-md">
            <IconUserCircle className="size-4" />
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => await authClient.signOut()}
          className="cursor-pointer text-destructive focus:text-destructive rounded-md"
        >
          <IconLogout className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
