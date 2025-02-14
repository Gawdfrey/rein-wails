import { useParams } from "react-router-dom";
import { Module } from "../types";
import { DependencyGraph } from "../components/DependencyGraph";

interface ModuleDetailProps {
  modules: Module[];
}

export function ModuleDetail({ modules }: ModuleDetailProps) {
  const { id } = useParams();
  const module = modules.find((m) => m.id === id);

  if (!module) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-xl text-gray-600">Module not found</div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      {/* Main Content */}
      <div className="flex-1 p-8 pr-4 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {module.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{module.description}</p>

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
        </div>

        {/* Installation Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Installation</h2>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-white">
            <code>{module.installCommand}</code>
          </div>
        </div>

        {/* Dependencies Section with Graph */}
        {module.dependencies.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Dependency Graph</h2>
              <DependencyGraph
                moduleName={module.name}
                dependencies={module.dependencies}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar with Metadata */}
      <div className="w-64 p-8 pl-4 border-l border-gray-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Version</h3>
            <p className="text-gray-900">{module.version}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Last Updated
            </h3>
            <p className="text-gray-900">
              {new Date(module.lastUpdated).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Maintainer
            </h3>
            <p className="text-gray-900">{module.maintainer}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              GitHub Repository
            </h3>
            <a
              href={module.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {module.githubRepo.replace("https://github.com/", "")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
