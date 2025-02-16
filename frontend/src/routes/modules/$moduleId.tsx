import { createFileRoute } from "@tanstack/react-router";
import { ComponentType } from "../../../bindings/changeme";
import { useState } from "react";
import { Terminal } from "../../components/Terminal";
import { Button } from "@stacc/prism-ui";
import { DependencyGraph } from "../../components/DependencyGraph";
import { InstallToEnvironmentModal } from "../../components/InstallToEnvironmentModal";
import { queries } from "../../queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/modules/$moduleId")({
  component: ModuleDetail,
  params: {
    parse: ({ moduleId }) => ({
      moduleId,
    }),
  },
  loader({ context: { queryClient }, params: { moduleId } }) {
    queryClient.ensureQueryData(queries.getModuleById(moduleId));
    queryClient.ensureQueryData(queries.getModuleReadme(moduleId));
  },
});

function AttributeLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-[13px] text-blue-600 hover:text-blue-800 group"
    >
      <span className="text-gray-400 group-hover:text-blue-800">{icon}</span>
      {label}
    </a>
  );
}

const componentTypeIcons: Record<ComponentType, string> = {
  Backend: "⚙️",
  Frontend: "🖥️",
  ApiGateway: "🔌",
  Setup: "🔧",
};

export function ModuleDetail() {
  const { moduleId } = Route.useParams();
  const moduleQuery = useSuspenseQuery(queries.getModuleById(moduleId));
  const module = moduleQuery.data;
  const readmeQuery = useSuspenseQuery(queries.getModuleReadme(moduleId));
  const readme = readmeQuery.data;
  const readmeLoading = readmeQuery.isLoading;
  const [showInstallModal, setShowInstallModal] = useState(false);

  if (!module) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-xl text-gray-600">Module not found</div>
      </div>
    );
  }

  // Group components by type
  const componentsByType = module.components.reduce(
    (acc, component) => {
      const type = component.type as ComponentType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(component);
      return acc;
    },
    {} as Record<ComponentType, typeof module.components>
  );

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-8 pr-2">
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {module.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{module.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {module.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Solutions</div>
              <div className="text-2xl font-semibold text-gray-900">12</div>
              <div className="text-xs text-gray-500 mt-1">
                Using this module
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Environments</div>
              <div className="text-2xl font-semibold text-gray-900">28</div>
              <div className="text-xs text-gray-500 mt-1">
                Active installations
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Downloads</div>
              <div className="text-2xl font-semibold text-gray-900">1.2k</div>
              <div className="text-xs text-gray-500 mt-1">
                Total installations
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">
                Most Used Version
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {module.version}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                In 85% of installations
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Installation</h2>
          <div className="flex gap-4 items-center">
            <Terminal>
              <code>
                blocc install {module.id}@{module.version}
              </code>
            </Terminal>
            <Button label="Install" onClick={() => setShowInstallModal(true)} />
          </div>
        </div>

        {/* README Section */}
        {module.attributes.githubRepo && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">README</h2>
            {readmeLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            ) : readme ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: readme }} />
              </div>
            ) : (
              <p className="text-gray-600">No README available</p>
            )}
          </div>
        )}

        {/* Components Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-6">Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(componentsByType) as ComponentType[]).map((type) => (
              <div key={type} className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <span>{componentTypeIcons[type]}</span>
                  {type}
                </h3>
                <div className="space-y-2">
                  {componentsByType[type].map((component) => (
                    <div
                      key={component.id}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {component.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {component.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dependencies Graph */}
        {module.dependencies.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Dependencies</h2>
            <p className="text-sm text-gray-600 mb-6">
              Click on a module to view its details
            </p>
            <div className="h-[400px]">
              <DependencyGraph
                moduleName={module.name}
                dependencies={module.dependencies}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar with Metadata */}
      <div className="w-60 p-2 border-l border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-[11px] text-gray-500">Version</h3>
            <p className="text-[13px] text-gray-900">{module.version}</p>
          </div>

          <div>
            <h3 className="text-[11px] text-gray-500">Updated</h3>
            <p className="text-[13px] text-gray-900 bg-blue-50 inline-block px-1">
              {new Date(module.lastUpdated)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "/")}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] text-gray-500">By</h3>
            <p className="text-[13px] text-gray-900">{module.maintainer}</p>
          </div>

          <div>
            <h3 className="text-[11px] text-gray-500">Organization</h3>
            <p className="text-[13px] text-gray-900">{module.organization}</p>
          </div>

          <div>
            <h3 className="text-[11px] text-gray-500">Links</h3>
            <div className="space-y-1">
              {module.attributes.githubRepo && (
                <AttributeLink
                  href={module.attributes.githubRepo}
                  icon="🔗"
                  label={module.attributes.githubRepo.split("/").pop() || ""}
                />
              )}
              {module.attributes.documentation && (
                <AttributeLink
                  href={module.attributes.documentation}
                  icon="📚"
                  label="Documentation"
                />
              )}
              {module.attributes.website && (
                <AttributeLink
                  href={module.attributes.website}
                  icon="🌐"
                  label="Website"
                />
              )}
              {module.attributes.license && (
                <div className="text-[13px] text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">📜</span>
                  {module.attributes.license}
                </div>
              )}
            </div>
          </div>

          {module.attributes.packages &&
            Object.keys(module.attributes.packages).length > 0 && (
              <div>
                <h3 className="text-[11px] text-gray-500">Packages</h3>
                <div className="space-y-1">
                  {Object.entries(module.attributes.packages).map(
                    ([registry, url]) => (
                      <AttributeLink
                        key={registry}
                        href={url}
                        icon={"📦"}
                        label={registry}
                      />
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {showInstallModal && (
        <InstallToEnvironmentModal
          moduleId={module.id}
          version={module.version}
          onClose={() => setShowInstallModal(false)}
        />
      )}
    </div>
  );
}
