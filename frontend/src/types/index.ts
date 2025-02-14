export interface Module {
  id: string;
  name: string;
  description: string;
  lastUpdated: string; // ISO date string
  tags: string[];
}

export interface SearchState {
  query: string;
  filters: string[];
}

// Wails service interface
export interface ModuleService {
  GetModules(): Promise<Module[]>;
  GetModule(id: string): Promise<Module | null>;
  SearchModules(query: string): Promise<Module[]>;
}
