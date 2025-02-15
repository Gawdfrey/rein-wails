import { ModuleCard } from "./ModuleCard";

import { ModuleResponse } from "../../bindings/changeme";

interface ModuleGridProps {
  modules: ModuleResponse[];
}

export function ModuleGrid({ modules }: ModuleGridProps) {
  if (!modules || modules.length === 0) {
    return <div className="mt-12">No modules found</div>;
  }
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
