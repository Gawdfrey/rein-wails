import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Sidebar } from "../components/Sidebar";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <div className="flex h-full bg-background-default">
      <Sidebar />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
