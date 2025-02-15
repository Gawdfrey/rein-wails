import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SolutionService, Solution } from "../../bindings/changeme";
import { Button } from "@stacc/prism-ui";

export function SolutionList() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const results = await SolutionService.GetSolutions();
        setSolutions(results);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch solutions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Solutions</h1>
        <Button label="New Solution" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <Link
            key={solution.id}
            to={`/solutions/${solution.id}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {solution.name}
                </h2>
                <p className="text-sm text-gray-500">{solution.customer}</p>
              </div>
              <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                {solution.environments.length} environments
              </div>
            </div>
            <p className="text-gray-600 mb-4">{solution.description}</p>
            <div className="flex flex-wrap gap-2">
              {solution.modules.map((module) => (
                <span
                  key={module.moduleId}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                >
                  {module.moduleId} v{module.version}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Updated {new Date(solution.updatedAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
