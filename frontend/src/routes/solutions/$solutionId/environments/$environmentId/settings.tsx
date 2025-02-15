import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "../../../../../queries";
import { EnvironmentConfig } from "../../../../../components/EnvironmentConfig";
import { Solution } from "../../../../../../bindings/changeme";

export const Route = createFileRoute(
  "/solutions/$solutionId/environments/$environmentId/settings"
)({
  component: EnvironmentSettingsPage,
});

function EnvironmentSettingsPage() {
  const { solutionId, environmentId } = Route.useParams();
  const { data: solution } = useSuspenseQuery(
    queries.getSolutionById(solutionId)
  ) as { data: Solution };

  const environment = solution.environments.find(
    (env) => env.id === environmentId
  );

  if (!environment) {
    return <div>Environment not found</div>;
  }

  const handleSaveConfig = async (config: string) => {
    // TODO: Implement save configuration
    console.log("Saving config:", config);
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {environment.name} Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure environment settings and module configurations
          </p>
        </div>

        <EnvironmentConfig
          environment={environment}
          solutionId={solutionId}
          onSave={handleSaveConfig}
        />
      </div>
    </div>
  );
}
