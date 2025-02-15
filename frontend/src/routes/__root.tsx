import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Sidebar } from "../components/Sidebar";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient } from "@tanstack/react-query";
import { CommandPalette } from "../components/CommandPalette";
import { CommandButton } from "../components/CommandButton";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <CommandPalette>
      <div className="flex h-full bg-background-default">
        <Sidebar />
        <Outlet />
        <CommandButton />
        <TanStackRouterDevtools />
      </div>
    </CommandPalette>
  ),
});
