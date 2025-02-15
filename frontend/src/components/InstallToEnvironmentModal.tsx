import { useState, useEffect } from "react";
import { SolutionService, Solution } from "../../bindings/changeme";
import { Button, UNSTABLE_Select } from "@stacc/prism-ui";

interface InstallToEnvironmentModalProps {
  moduleId: string;
  version: string;
  onClose: () => void;
}

interface EnvironmentOption {
  solutionId: string;
  environmentId: string;
  solutionName: string;
  environmentName: string;
}

export function InstallToEnvironmentModal({
  moduleId,
  version,
  onClose,
}: InstallToEnvironmentModalProps) {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<EnvironmentOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const results = await SolutionService.GetSolutions();
        setSolutions(results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch solutions"
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchSolutions();
  }, []);

  // Get all development environments from all solutions
  const developmentEnvironments = solutions.flatMap((solution) =>
    solution.environments
      .filter(
        (env) =>
          env.name.toLowerCase().includes("dev") ||
          env.namespace.toLowerCase().includes("dev")
      )
      .map((env) => ({
        solutionId: solution.id,
        environmentId: env.id,
        solutionName: solution.name,
        environmentName: env.name,
      }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnvironment) return;

    setError(null);
    setIsLoading(true);

    try {
      await SolutionService.InstallModule(
        selectedEnvironment.solutionId,
        selectedEnvironment.environmentId,
        moduleId,
        version
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to install module");
    } finally {
      setIsLoading(false);
    }
  };

  const selectOptions = developmentEnvironments.map((env) => ({
    label: `${env.solutionName} - ${env.environmentName}`,
    value: `${env.solutionId}:${env.environmentId}`,
  }));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [solutionId, environmentId] = value.split(":");
    const env = developmentEnvironments.find(
      (env) =>
        env.solutionId === solutionId && env.environmentId === environmentId
    );
    setSelectedEnvironment(env || null);
  };

  if (isFetching) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Install Module</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {developmentEnvironments.length === 0 ? (
          <div className="text-gray-600">
            No development environments available. Create a development
            environment first.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <UNSTABLE_Select
                label="Select Development Environment"
                value={
                  selectedEnvironment
                    ? `${selectedEnvironment.solutionId}:${selectedEnvironment.environmentId}`
                    : ""
                }
                onChange={handleSelectChange}
                options={selectOptions}
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <Button
                type="submit"
                label={isLoading ? "Installing..." : "Install"}
                disabled={isLoading || !selectedEnvironment}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
