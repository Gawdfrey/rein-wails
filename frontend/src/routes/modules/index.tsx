import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "../../components/SearchBar";
import { ModuleGrid } from "../../components/ModuleGrid";
import { queries } from "../../queries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/modules/")({
  component: ModuleList,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queries.getModules());
  },
});

export function ModuleList() {
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const modulesQuery = useQuery(queries.getModules(searchText));
  const modules = modulesQuery.data ?? [];
  const error = modulesQuery.error;
  const loading = modulesQuery.isLoading;

  // Get unique tags from all modules
  const allTags = Array.from(
    new Set(modules.flatMap((module) => module.tags))
  ).sort();

  function onSearchChange(value: string) {
    setSearchText(value);
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  }

  // Filter modules based on selected tags
  const filteredModules = modules.filter((module) =>
    selectedTags.size === 0
      ? true
      : module.tags.some((tag) => selectedTags.has(tag))
  );

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

          <SearchBar value={searchText} onChange={onSearchChange} />

          {/* Tag filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full cursor-pointer text-sm transition-colors ${
                  selectedTags.has(tag)
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

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
            <ModuleGrid modules={filteredModules} />
          )}
        </div>
      </div>
    </div>
  );
}
