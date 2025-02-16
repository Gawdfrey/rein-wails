import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@stacc/prism-ui";
import { queries } from "../../queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/solutions/")({
  component: SolutionList,
  loader({ context: { queryClient } }) {
    queryClient.ensureQueryData(queries.getSolutions());
  },
});

export function SolutionList() {
  const solutionsQuery = useSuspenseQuery(queries.getSolutions());
  const solutions = solutionsQuery.data;

  if (!solutions) {
    return <div>No solutions found</div>;
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
            to="/solutions/$solutionId"
            params={{
              solutionId: solution.id,
            }}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {solution.name}
                </h2>
                <p className="text-sm text-gray-500">{solution.organization}</p>
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
