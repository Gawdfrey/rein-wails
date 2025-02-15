import { useState } from "react";
import { SolutionService } from "../../bindings/changeme";

interface AddEnvironmentModalProps {
  solutionId: string;
  onClose: () => void;
  onEnvironmentAdded: () => void;
}

export function AddEnvironmentModal({
  solutionId,
  onClose,
  onEnvironmentAdded,
}: AddEnvironmentModalProps) {
  const [name, setName] = useState("");
  const [namespace, setNamespace] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await SolutionService.AddEnvironment(solutionId, {
        name,
        namespace,
      });
      onEnvironmentAdded();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add environment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Environment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Environment Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Development, Staging, Production"
              required
            />
          </div>

          <div>
            <label
              htmlFor="namespace"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kubernetes Namespace
            </label>
            <input
              type="text"
              id="namespace"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., customer-dev, customer-prod"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Environment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
