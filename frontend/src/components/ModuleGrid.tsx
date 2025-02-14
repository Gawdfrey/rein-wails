import { ModuleCard } from "./ModuleCard";
import { Module } from "../types";

interface ModuleGridProps {
  modules: Module[];
}

export function ModuleGrid({ modules }: ModuleGridProps) {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
