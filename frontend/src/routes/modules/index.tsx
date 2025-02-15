import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "../../components/SearchBar";
import { ModuleGrid } from "../../components/ModuleGrid";
import { queries } from "../../queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/modules/")({
  component: ModuleList,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queries.getModules());
  },
});

interface ModuleListProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ModuleList({ searchQuery, onSearchChange }: ModuleListProps) {
  const modulesQuery = useSuspenseQuery(queries.getModules());
  const modules = modulesQuery.data;
  const error = modulesQuery.error;
  const loading = modulesQuery.isLoading;
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#F8FAFF]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1B4DF520_1px,transparent_1px),linear-gradient(to_bottom,#1B4DF520_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#1B4DF510,transparent)]" />
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
              {error.message}
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
