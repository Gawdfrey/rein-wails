export interface ModuleAttributes {
  githubRepo?: string;
  documentation?: string;
  website?: string;
  license?: string;
}

export type ComponentType = "Backend" | "Frontend" | "ApiGateway" | "Setup";

export interface ModuleComponent {
  id: string;
  name: string;
  type: ComponentType;
  description: string;
  version: string;
}

export interface ModuleDependency {
  id: string;
  name: string;
  version: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  lastUpdated: string; // ISO date string
  tags: string[];
  version: string;
  installCommand: string;
  maintainer: string;
  dependencies: ModuleDependency[];
  attributes: ModuleAttributes;
  components: ModuleComponent[];
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
  GetModuleReadme(id: string): Promise<string>;
}
