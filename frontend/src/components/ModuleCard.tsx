import { Module } from "../types";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link
      to={`/modules/${module.id}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
      <p className="text-gray-600 mb-4">{module.description}</p>
      <div className="flex flex-wrap gap-2">
        {module.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Last updated: {module.lastUpdated}
      </div>
    </Link>
  );
}
