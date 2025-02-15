import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { ModuleList } from "./pages/ModuleList";
import { ModuleDetail } from "./pages/ModuleDetail";
import { SolutionList } from "./pages/SolutionList";
import { SolutionDetail } from "./pages/SolutionDetail";
import { SearchState } from "./types";

import { ModuleResponse, ModuleService } from "../bindings/changeme";

export function App() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    filters: [],
  });
  const [modules, setModules] = useState<ModuleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        if (searchState.query) {
          const results = await ModuleService.SearchModules(searchState.query);
          setModules(results);
        } else {
          const allModules = await ModuleService.GetModules();
          setModules(allModules);
        }
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch modules"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [searchState.query]);

  return (
    <Router>
      <div className="flex h-full bg-background-default">
        <Sidebar />
        <Routes>
          <Route
            path="/"
            element={
              <ModuleList
                modules={modules}
                searchQuery={searchState.query}
                onSearchChange={(value) => {
                  setSearchState((prev) => ({ ...prev, query: value }));
                }}
                loading={loading}
                error={error}
              />
            }
          />
          <Route
            path="/modules/:id"
            element={<ModuleDetail modules={modules} />}
          />
          <Route path="/solutions" element={<SolutionList />} />
          <Route path="/solutions/:id" element={<SolutionDetail />} />
        </Routes>
      </div>
    </Router>
  );
}
