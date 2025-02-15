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

export interface Environment {
  id: string;
  name: string;
  namespace: string;
  status: "running" | "stopped" | "error";
  lastDeployed: string; // ISO date string
  modules: {
    moduleId: string;
    version: string;
    status: "running" | "stopped" | "error";
  }[];
}

export interface Solution {
  id: string;
  name: string;
  description: string;
  customer: string;
  environments: Environment[];
  modules: {
    moduleId: string;
    version: string;
  }[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Wails service interface
export interface ModuleService {
  GetModules(): Promise<Module[]>;
  GetModule(id: string): Promise<Module | null>;
  SearchModules(query: string): Promise<Module[]>;
  GetModuleReadme(id: string): Promise<string>;
  GetSolutions(): Promise<Solution[]>;
  GetSolution(id: string): Promise<Solution | null>;
  GetEnvironments(solutionId: string): Promise<Environment[]>;
}
