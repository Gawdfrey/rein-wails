import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  useRegisterActions,
  Action,
} from "kbar";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "../queries";

interface CommandItem extends Action {
  icon?: string;
  shortcut?: string[];
  subtitle?: string;
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">
            {item}
          </div>
        ) : (
          <div
            className={`px-4 py-2 flex items-center gap-2 cursor-pointer ${
              active ? "bg-blue-50" : "bg-white"
            }`}
          >
            {item.icon && <span className="text-gray-500">{item.icon}</span>}
            <div>
              <div className="text-gray-900">{item.name}</div>
              {item.subtitle && (
                <div className="text-xs text-gray-500">{item.subtitle}</div>
              )}
            </div>
            {item.shortcut && item.shortcut.length > 0 && (
              <div className="ml-auto flex items-center gap-1">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className="px-2 py-1 bg-gray-100 rounded text-sm"
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            )}
          </div>
        )
      }
    />
  );
}

function Palette({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const modulesQuery = useSuspenseQuery(queries.getModules());
  const solutionsQuery = useSuspenseQuery(queries.getSolutions());

  // Base navigation actions that don't require data
  const navigationActions: CommandItem[] = [
    {
      id: "home",
      name: "Home",
      shortcut: ["h"],
      keywords: "home landing",
      perform: () => navigate({ to: "/" }),
      section: "Navigation",
    },
    {
      id: "modules",
      name: "Modules",
      shortcut: ["m"],
      keywords: "modules browse search",
      perform: () => navigate({ to: "/modules" }),
      section: "Navigation",
    },
    {
      id: "solutions",
      name: "Solutions",
      shortcut: ["s"],
      keywords: "solutions customers environments",
      perform: () => navigate({ to: "/solutions" }),
      section: "Navigation",
    },
    {
      id: "settings",
      name: "Settings",
      shortcut: ["g"],
      keywords: "settings preferences configuration",
      perform: () => navigate({ to: "/settings" }),
      section: "Navigation",
    },
  ];

  // Configuration actions
  const configurationActions: CommandItem[] = [
    {
      id: "env-config",
      name: "Environment Configurations",
      shortcut: ["c"],
      keywords: "environment config yaml settings variables secrets",
      section: "Configuration",
      icon: "⚙️",
      perform: () => navigate({ to: "/settings" }),
    },
    ...solutionsQuery.data.flatMap((solution) =>
      solution.environments.map((env) => ({
        id: `config-${solution.id}-${env.id}`,
        name: `Configure ${env.name}`,
        keywords: `configure ${env.name} ${solution.name} environment yaml settings variables secrets`,
        subtitle: `Edit configuration for ${env.name} in ${solution.name}`,
        perform: () =>
          navigate({
            to: "/solutions/$solutionId/environments/$environmentId",
            params: { solutionId: solution.id, environmentId: env.id },
          }),
        section: "Configuration",
        icon: "🔧",
      }))
    ),
  ];

  // Quick actions that don't require data
  const quickActions: CommandItem[] = [
    {
      id: "add-environment",
      name: "Add Environment",
      shortcut: ["e"],
      keywords: "create new environment add",
      section: "Quick Actions",
      icon: "🌍",
      perform: () => {
        // This will be implemented when we add the modal functionality
        console.log("Add environment action triggered");
      },
    },
    {
      id: "install-module",
      name: "Install Module",
      shortcut: ["i"],
      keywords: "install module package add",
      section: "Quick Actions",
      icon: "📦",
      perform: () => {
        // This will be implemented when we add the modal functionality
        console.log("Install module action triggered");
      },
    },
    {
      id: "sync-environment",
      name: "Sync Environment",
      shortcut: ["y"],
      keywords: "sync refresh update environment",
      section: "Quick Actions",
      icon: "🔄",
      perform: () => {
        // This will be implemented when we add the sync functionality
        console.log("Sync environment action triggered");
      },
    },
    {
      id: "edit-config",
      name: "Edit Configuration",
      shortcut: ["k"],
      keywords: "edit configuration yaml settings variables secrets",
      section: "Quick Actions",
      icon: "📝",
      perform: () => {
        // This will be implemented when we add the configuration editor
        console.log("Edit configuration action triggered");
      },
    },
  ];

  // Dynamic module actions based on fetched data
  const moduleActions: CommandItem[] = modulesQuery.data.map((module) => ({
    id: `module-${module.id}`,
    name: module.name,
    keywords: `${module.name} ${module.description} ${module.tags.join(" ")}`,
    subtitle: module.description,
    perform: () =>
      navigate({
        to: "/modules/$moduleId",
        params: { moduleId: module.id },
      }),
    section: "Modules",
    icon: "💾",
  }));

  // Dynamic solution actions based on fetched data
  const solutionActions: CommandItem[] = solutionsQuery.data.map(
    (solution) => ({
      id: `solution-${solution.id}`,
      name: solution.name,
      keywords: `${solution.name} ${solution.description} ${solution.customer}`,
      subtitle: solution.description,
      perform: () =>
        navigate({
          to: "/solutions/$solutionId",
          params: { solutionId: solution.id },
        }),
      section: "Solutions",
      icon: "🏢",
    })
  );

  // Dynamic environment actions based on solutions data
  const environmentActions: CommandItem[] = solutionsQuery.data.flatMap(
    (solution) =>
      solution.environments.map((env) => ({
        id: `env-${solution.id}-${env.id}`,
        name: `${env.name} (${solution.name})`,
        keywords: `${env.name} ${env.namespace} ${solution.name} environment`,
        subtitle: `${env.namespace} - ${env.status}`,
        perform: () =>
          navigate({
            to: "/solutions/$solutionId/environments/$environmentId",
            params: { solutionId: solution.id, environmentId: env.id },
          }),
        section: "Environments",
        icon:
          env.status === "running"
            ? "🟢"
            : env.status === "stopped"
              ? "⭕"
              : "🔴",
      }))
  );

  // Register all actions
  useRegisterActions([
    ...navigationActions,
    ...quickActions,
    ...configurationActions,
    ...moduleActions,
    ...solutionActions,
    ...environmentActions,
  ]);

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="z-50 bg-gray-900/50 fixed inset-0">
          <KBarAnimator className="w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <KBarSearch className="px-4 py-3 text-base w-full border-b border-gray-200 outline-none" />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
}

export function CommandPalette({ children }: { children: React.ReactNode }) {
  return (
    <KBarProvider>
      <Palette>{children}</Palette>
    </KBarProvider>
  );
}
