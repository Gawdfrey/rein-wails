import { queryOptions } from "@tanstack/react-query";
import {
  ModuleService,
  SolutionService,
  SystemService,
} from "../bindings/changeme";

export const queryKeys = {
  all: ["all"] as const,
  getModules: () => [queryKeys.all, "modules"] as const,
  getModuleById: (id: string) => [queryKeys.getModules, id] as const,
  getModuleReadme: (id: string) =>
    [queryKeys.getModuleById(id), "readme"] as const,
  getSystemInfo: () => [queryKeys.all, "systemInfo"] as const,
  getSolutions: () => [queryKeys.all, "solutions"] as const,
  getSolutionById: (id: string) => [queryKeys.getSolutions, id] as const,
};

export const queries = {
  getModules: () =>
    queryOptions({
      queryKey: queryKeys.getModules(),
      queryFn: () => ModuleService.GetModules(),
    }),
  getModuleById: (id: string) =>
    queryOptions({
      queryKey: queryKeys.getModuleById(id),
      queryFn: () => ModuleService.GetModule(id),
    }),
  getModuleReadme: (id: string) =>
    queryOptions({
      queryKey: queryKeys.getModuleReadme(id),
      queryFn: () => ModuleService.GetModuleReadme(id),
    }),
  getSystemInfo: () =>
    queryOptions({
      queryKey: queryKeys.getSystemInfo(),
      queryFn: () => SystemService.GetSystemInfo(),
    }),
  getSolutions: () =>
    queryOptions({
      queryKey: queryKeys.getSolutions(),
      queryFn: () => SolutionService.GetSolutions(),
    }),
  getSolutionById: (id: string) =>
    queryOptions({
      queryKey: queryKeys.getSolutionById(id),
      queryFn: () => SolutionService.GetSolution(id),
    }),
};
