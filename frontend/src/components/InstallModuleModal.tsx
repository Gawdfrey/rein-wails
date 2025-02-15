import { useState } from "react";
import { SolutionService } from "../../bindings/changeme";

interface InstallModuleModalProps {
  solutionId: string;
  environmentId: string;
  onClose: () => void;
  onModuleInstalled: () => void;
}

export function InstallModuleModal({
  solutionId,
  environmentId,
  onClose,
  onModuleInstalled,
}: InstallModuleModalProps) {
  const [moduleId, setModuleId] = useState("");
  const [version, setVersion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await SolutionService.InstallModule(
        solutionId,
        environmentId,
        moduleId,
        version
      );
      onModuleInstalled();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to install module");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Install New Module</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="moduleId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Module ID
            </label>
            <input
              type="text"
              id="moduleId"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="version"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Version
            </label>
            <input
              type="text"
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Installing..." : "Install"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
