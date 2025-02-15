import { SearchBar } from "../components/SearchBar";
import { ModuleGrid } from "../components/ModuleGrid";

import { ModuleResponse } from "../../bindings/changeme";

interface ModuleListProps {
  modules: ModuleResponse[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  error: string | null;
}

export function ModuleList({
  modules,
  searchQuery,
  onSearchChange,
  loading,
  error,
}: ModuleListProps) {
  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-3xl mx-auto mt-16">
          <div className="h-32 mb-8 flex items-center justify-center">
            <div className="text-4xl font-bold text-content-default">
              Blocc Catalog
            </div>
          </div>

          <SearchBar value={searchQuery} onChange={onSearchChange} />

          {error && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <ModuleGrid modules={modules} />
          )}
        </div>
      </div>
    </div>
  );
}
