import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Environment,
  SolutionService,
  ModuleService,
  LogService,
  LogEntry,
} from "../../bindings/changeme";
import { ComponentType } from "../types";
import { Button } from "@stacc/prism-ui";

interface ComponentWithDetails {
  id: string;
  name: string;
  type: ComponentType;
  description: string;
  moduleId: string;
  moduleName: string;
  version: string;
  status: "running" | "stopped" | "error";
}

interface ModuleComponents {
  moduleId: string;
  moduleName: string;
  version: string;
  components: ComponentWithDetails[];
}

export function EnvironmentDetail() {
  const { solutionId, environmentId } = useParams();
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [moduleComponents, setModuleComponents] = useState<ModuleComponents[]>(
    []
  );
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnvironment = async () => {
      if (!solutionId || !environmentId) return;

      try {
        const solution = await SolutionService.GetSolution(solutionId);
        if (!solution) {
          setError("Solution not found");
          return;
        }

        const env = solution.environments.find((e) => e.id === environmentId);
        if (!env) {
          setError("Environment not found");
          return;
        }

        setEnvironment(env);

        // Get component details for each module
        const moduleComponentsMap: ModuleComponents[] = [];
        for (const module of env.modules) {
          const moduleDetails = await ModuleService.GetModule(module.moduleId);
          if (moduleDetails) {
            const components = moduleDetails.components
              .filter((comp) => comp.type !== "Frontend")
              .map((comp) => ({
                ...comp,
                type: comp.type as ComponentType,
                moduleId: module.moduleId,
                moduleName: moduleDetails.name,
                version: module.version,
                status: module.status as "running" | "stopped" | "error",
              }));

            if (components.length > 0) {
              moduleComponentsMap.push({
                moduleId: module.moduleId,
                moduleName: moduleDetails.name,
                version: module.version,
                components,
              });
            }
          }
        }

        setModuleComponents(moduleComponentsMap);
        if (
          moduleComponentsMap.length > 0 &&
          moduleComponentsMap[0].components.length > 0
        ) {
          setSelectedComponent(moduleComponentsMap[0].components[0]);
          fetchLogs(moduleComponentsMap[0].components[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch environment"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironment();
  }, [solutionId, environmentId]);

  const fetchLogs = async (component: ComponentWithDetails) => {
    if (!solutionId || !environmentId) return;

    setLogsLoading(true);
    setLogsError(null);

    try {
      const logEntries = await LogService.GetComponentLogs(
        solutionId,
        environmentId,
        component.id
      );
      setLogs(logEntries);
    } catch (err) {
      setLogsError(err instanceof Error ? err.message : "Failed to fetch logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const handleComponentSelect = async (component: ComponentWithDetails) => {
    setSelectedComponent(component);
    fetchLogs(component);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !environment) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || "Environment not found"}
        </div>
      </div>
    );
  }

  const statusColors = {
    running: "bg-green-50 text-green-700",
    stopped: "bg-gray-50 text-gray-700",
    error: "bg-red-50 text-red-700",
  };

  const logLevelColors = {
    INFO: "text-blue-600",
    WARN: "text-yellow-600",
    ERROR: "text-red-600",
    DEBUG: "text-gray-600",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {environment.name}
            </h1>
            <p className="text-gray-600">{environment.namespace}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              statusColors[environment.status as keyof typeof statusColors]
            }`}
          >
            {environment.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Component List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Components
          </h2>
          <div className="space-y-6">
            {moduleComponents.map((moduleComponent) => (
              <div key={moduleComponent.moduleId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {moduleComponent.moduleName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    v{moduleComponent.version}
                  </span>
                </div>
                <div className="space-y-1 pl-4 border-l-2 border-gray-200">
                  {moduleComponent.components.map((component) => (
                    <Button
                      key={component.id}
                      onClick={() => handleComponentSelect(component)}
                      label={component.name}
                      variant={
                        selectedComponent?.id === component.id
                          ? "primary"
                          : "outline"
                      }
                      className="w-full justify-start text-sm"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs Panel */}
        <div className="col-span-3">
          {selectedComponent ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedComponent.name} Logs
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedComponent.moduleName} v{selectedComponent.version}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      statusColors[selectedComponent.status]
                    }`}
                  >
                    {selectedComponent.status}
                  </span>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gray-900 rounded-lg flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <div className="font-mono text-sm text-white p-4">
                      {logsLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                        </div>
                      ) : logsError ? (
                        <div className="text-red-500">{logsError}</div>
                      ) : logs.length === 0 ? (
                        <div className="text-gray-500">No logs available</div>
                      ) : (
                        <div className="space-y-1">
                          {logs.map((log, index) => (
                            <div
                              key={index}
                              className="flex hover:bg-gray-800 rounded px-2 py-1"
                            >
                              <span className="text-gray-500 mr-4 select-none">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span
                                className={`mr-4 w-14 text-center select-none ${
                                  logLevelColors[
                                    log.level as keyof typeof logLevelColors
                                  ]
                                }`}
                              >
                                {log.level}
                              </span>
                              <span className="whitespace-pre-wrap break-all flex-1">
                                {log.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              Select a component to view logs
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
