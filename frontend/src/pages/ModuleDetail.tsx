import { useParams } from "react-router-dom";
import { Module } from "../types";

interface ModuleDetailProps {
  modules: Module[];
}

export function ModuleDetail({ modules }: ModuleDetailProps) {
  const { id } = useParams();
  const module = modules.find((m) => m.id === id);

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{module.name}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600 mb-4">{module.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {module.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {module.lastUpdated}
        </div>
        {/* Add more module details here */}
      </div>
    </div>
  );
}
