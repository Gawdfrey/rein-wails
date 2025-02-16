package main

import (
	"fmt"
	"strings"
	"time"
)

type SolutionService struct {
	solutions []Solution
}

type Solution struct {
	ID           string           `json:"id"`
	Name         string           `json:"name"`
	Description  string           `json:"description"`
	Organization string           `json:"organization"`
	CreatedAt    time.Time        `json:"createdAt" ts_type:"string"`
	UpdatedAt    time.Time        `json:"updatedAt" ts_type:"string"`
	Modules      []SolutionModule `json:"modules"`
	Environments []Environment    `json:"environments"`
}

type SolutionModule struct {
	ModuleID string `json:"moduleId"`
	Version  string `json:"version"`
}

type EnvironmentStatus string

const (
	EnvironmentStatusRunning EnvironmentStatus = "running"
	EnvironmentStatusStopped EnvironmentStatus = "stopped"
	EnvironmentStatusError   EnvironmentStatus = "error"
)

type Environment struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Namespace    string            `json:"namespace"`
	Status       EnvironmentStatus `json:"status"`
	LastDeployed time.Time         `json:"lastDeployed" ts_type:"string"`
	Modules      []EnvironmentModule `json:"modules"`
}

type EnvironmentModule struct {
	ModuleID string            `json:"moduleId"`
	Version  string            `json:"version"`
	Status   EnvironmentStatus `json:"status"`
}

type AddEnvironmentRequest struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

func NewSolutionService() *SolutionService {
	// Initialize with mock data
	solutions := []Solution{
		{
			ID:           "demo-solution",
			Name:         "Demo Solution",
			Description:  "A demo solution showcasing various modules",
			Organization: "stacc",
			CreatedAt:    time.Now().Add(-30 * 24 * time.Hour),
			UpdatedAt:    time.Now().Add(-2 * 24 * time.Hour),
			Modules: []SolutionModule{
				{ModuleID: "flow", Version: "1.0.0"},
				{ModuleID: "control-panel", Version: "1.0.0"},
			},
			Environments: []Environment{
				{
					ID:           "dev-1",
					Name:         "Development 1",
					Namespace:    "customer-a-dev-1",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-24 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "flow", Version: "1.0.0", Status: EnvironmentStatusRunning},
						{ModuleID: "control-panel", Version: "1.0.0", Status: EnvironmentStatusRunning},
					},
				},
				{
					ID:           "staging",
					Name:         "Staging",
					Namespace:    "customer-a-staging",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-48 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "flow", Version: "1.0.0", Status: EnvironmentStatusRunning},
						{ModuleID: "control-panel", Version: "1.0.0", Status: EnvironmentStatusRunning},
						{ModuleID: "decision", Version: "1.0.0", Status: EnvironmentStatusRunning},
					},
				},
				{
					ID:           "prod",
					Name:         "Production",
					Namespace:    "customer-a-prod",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-72 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "flow", Version: "1.0.0", Status: EnvironmentStatusRunning},
						{ModuleID: "control-panel", Version: "1.0.0", Status: EnvironmentStatusRunning},
					},
				},
			},
		},
		{
			ID:           "production-solution",
			Name:         "Production Solution",
			Description:  "Main production environment setup",
			Organization: "stacc",
			CreatedAt:    time.Now().Add(-15 * 24 * time.Hour),
			UpdatedAt:    time.Now().Add(-1 * 24 * time.Hour),
			Modules: []SolutionModule{
				{ModuleID: "flow", Version: "1.0.0"},
				{ModuleID: "control-panel", Version: "1.0.0"},
			},
			Environments: []Environment{
				{
					ID:           "dev",
					Name:         "Development",
					Namespace:    "customer-b-dev",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-12 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "flow", Version: "1.0.0", Status: EnvironmentStatusRunning},
						{ModuleID: "control-panel", Version: "1.0.0", Status: EnvironmentStatusRunning},
					},
				},
				{
					ID:           "prod",
					Name:         "Production",
					Namespace:    "customer-b-prod",
					Status:       EnvironmentStatusError,
					LastDeployed: time.Now().Add(-36 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "flow", Version: "1.0.0", Status: EnvironmentStatusRunning},
						{ModuleID: "control-panel", Version: "1.0.0", Status: EnvironmentStatusRunning},
					},
				},
			},
		},
	}

	return &SolutionService{
		solutions: solutions,
	}
}

func (s *SolutionService) GetSolutions() []Solution {
	return s.solutions
}

func (s *SolutionService) GetSolution(id string) *Solution {
	for i := range s.solutions {
		if s.solutions[i].ID == id {
			return &s.solutions[i]
		}
	}
	return nil
}

func (s *SolutionService) GetEnvironments(solutionId string) []Environment {
	solution := s.GetSolution(solutionId)
	if solution == nil {
		return nil
	}
	return solution.Environments
}

func (s *SolutionService) AddEnvironment(solutionId string, req AddEnvironmentRequest) error {
	solution := s.GetSolution(solutionId)
	if solution == nil {
		return fmt.Errorf("solution not found")
	}

	// Create a new environment
	env := Environment{
		ID:           fmt.Sprintf("%s-%s", solutionId, strings.ToLower(req.Name)),
		Name:         req.Name,
		Namespace:    req.Namespace,
		Status:       EnvironmentStatusStopped,
		LastDeployed: time.Now(),
		Modules:      make([]EnvironmentModule, 0),
	}

	// Add modules from the solution with initial stopped status
	for _, module := range solution.Modules {
		env.Modules = append(env.Modules, EnvironmentModule{
			ModuleID: module.ModuleID,
			Version:  module.Version,
			Status:   EnvironmentStatusStopped,
		})
	}

	// Add the environment to the solution
	for i := range s.solutions {
		if s.solutions[i].ID == solutionId {
			s.solutions[i].Environments = append(s.solutions[i].Environments, env)
			s.solutions[i].UpdatedAt = time.Now()
			break
		}
	}

	return nil
}

// IsDevelopmentEnvironment checks if an environment is a development environment
func (s *SolutionService) IsDevelopmentEnvironment(env Environment) bool {
	// Check if the name or namespace contains development-related terms
	nameLower := strings.ToLower(env.Name)
	namespaceLower := strings.ToLower(env.Namespace)
	return strings.Contains(nameLower, "dev") || 
		   strings.Contains(namespaceLower, "dev") ||
		   strings.Contains(nameLower, "development") ||
		   strings.Contains(namespaceLower, "development")
}

// InstallModule installs a module in a development environment
func (s *SolutionService) InstallModule(solutionId string, environmentId string, moduleId string, version string) error {
	// Find the solution
	solution := s.GetSolution(solutionId)
	if solution == nil {
		return fmt.Errorf("solution not found")
	}

	// Find the environment
	var env *Environment
	for i := range solution.Environments {
		if solution.Environments[i].ID == environmentId {
			env = &solution.Environments[i]
			break
		}
	}
	if env == nil {
		return fmt.Errorf("environment not found")
	}

	// Check if this is a development environment
	if !s.IsDevelopmentEnvironment(*env) {
		return fmt.Errorf("module installation is only allowed in development environments")
	}

	// Check if module is already installed
	for _, module := range env.Modules {
		if module.ModuleID == moduleId {
			return fmt.Errorf("module is already installed")
		}
	}

	// Add the module to the environment
	env.Modules = append(env.Modules, EnvironmentModule{
		ModuleID: moduleId,
		Version:  version,
		Status:   EnvironmentStatusStopped,
	})

	// Add the module to the solution if it's not already there
	moduleExists := false
	for _, module := range solution.Modules {
		if module.ModuleID == moduleId {
			moduleExists = true
			break
		}
	}
	if !moduleExists {
		solution.Modules = append(solution.Modules, SolutionModule{
			ModuleID: moduleId,
			Version:  version,
		})
	}

	// Update timestamps
	env.LastDeployed = time.Now()
	solution.UpdatedAt = time.Now()

	return nil
} 