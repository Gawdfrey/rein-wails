import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  SolutionService,
  Solution,
  Environment,
} from "../../bindings/changeme";
import { DependencyGraph } from "../components/DependencyGraph";
import { AddEnvironmentModal } from "../components/AddEnvironmentModal";
import { InstallModuleModal } from "../components/InstallModuleModal";
import { Button } from "@stacc/prism-ui";

function EnvironmentCard({
  environment,
  solutionId,
  onModuleInstalled,
}: {
  environment: Environment;
  solutionId: string;
  onModuleInstalled: () => void;
}) {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const statusColors = {
    running: "bg-green-50 text-green-700",
    stopped: "bg-gray-50 text-gray-700",
    error: "bg-red-50 text-red-700",
  };

  const isDevelopment =
    environment.name.toLowerCase().includes("dev") ||
    environment.namespace.toLowerCase().includes("dev");

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link
            to={`/solutions/${solutionId}/environments/${environment.id}`}
            className="hover:text-blue-600"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {environment.name}
            </h3>
            <p className="text-sm text-gray-500">{environment.namespace}</p>
          </Link>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${
            statusColors[environment.status as keyof typeof statusColors]
          }`}
        >
          {environment.status}
        </span>
      </div>

      <div className="space-y-3">
        {environment.modules.map((module) => (
          <div
            key={module.moduleId}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div className="font-medium text-gray-900">{module.moduleId}</div>
              <div className="text-sm text-gray-600">v{module.version}</div>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs ${
                statusColors[module.status as keyof typeof statusColors]
              }`}
            >
              {module.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500 mb-4">
        Last deployed: {new Date(environment.lastDeployed).toLocaleString()}
      </div>

      {isDevelopment && (
        <Button
          label="Install Module"
          onClick={() => setShowInstallModal(true)}
        />
      )}

      {showInstallModal && (
        <InstallModuleModal
          solutionId={solutionId}
          environmentId={environment.id}
          onClose={() => setShowInstallModal(false)}
          onModuleInstalled={onModuleInstalled}
        />
      )}
    </div>
  );
}

export function SolutionDetail() {
  const { id } = useParams();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchSolution = async () => {
    if (!id) return;

    try {
      const result = await SolutionService.GetSolution(id);
      setSolution(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch solution");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolution();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || "Solution not found"}
        </div>
      </div>
    );
  }

  // Convert solution modules to the format expected by DependencyGraph
  const dependencies = solution.modules.map((module) => ({
    id: module.moduleId,
    name: module.moduleId,
    version: module.version,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {solution.name}
            </h1>
            <p className="text-xl text-gray-600">{solution.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Customer: {solution.customer}
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            label="Add Environment"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Environments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solution.environments.map((env) => (
            <EnvironmentCard
              key={env.id}
              environment={env}
              solutionId={solution.id}
              onModuleInstalled={fetchSolution}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modules</h2>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-[400px]">
            <DependencyGraph
              moduleName={solution.name}
              dependencies={dependencies}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEnvironmentModal
          solutionId={solution.id}
          onClose={() => setShowAddModal(false)}
          onEnvironmentAdded={fetchSolution}
        />
      )}
    </div>
  );
}
