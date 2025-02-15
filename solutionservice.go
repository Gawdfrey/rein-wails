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
	Customer     string           `json:"customer"`
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
			ID:          "customer-a-core",
			Name:        "Customer A Core Infrastructure",
			Description: "Core infrastructure components for Customer A",
			Customer:    "Customer A",
			CreatedAt:   time.Now().Add(-30 * 24 * time.Hour),
			UpdatedAt:   time.Now().Add(-2 * 24 * time.Hour),
			Modules: []SolutionModule{
				{ModuleID: "redis-stack", Version: "7.2.0"},
				{ModuleID: "postgresql-ha", Version: "15.4.0"},
			},
			Environments: []Environment{
				{
					ID:           "dev-1",
					Name:         "Development 1",
					Namespace:    "customer-a-dev-1",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-24 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "redis-stack", Version: "7.2.0", Status: EnvironmentStatusRunning},
						{ModuleID: "postgresql-ha", Version: "15.4.0", Status: EnvironmentStatusRunning},
					},
				},
				{
					ID:           "staging",
					Name:         "Staging",
					Namespace:    "customer-a-staging",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-48 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "redis-stack", Version: "7.2.0", Status: EnvironmentStatusRunning},
						{ModuleID: "postgresql-ha", Version: "15.4.0", Status: EnvironmentStatusRunning},
					},
				},
				{
					ID:           "prod",
					Name:         "Production",
					Namespace:    "customer-a-prod",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-72 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "redis-stack", Version: "7.1.0", Status: EnvironmentStatusRunning},
						{ModuleID: "postgresql-ha", Version: "15.3.0", Status: EnvironmentStatusRunning},
					},
				},
			},
		},
		{
			ID:          "customer-b-analytics",
			Name:        "Customer B Analytics Platform",
			Description: "Data analytics platform for Customer B",
			Customer:    "Customer B",
			CreatedAt:   time.Now().Add(-15 * 24 * time.Hour),
			UpdatedAt:   time.Now().Add(-1 * 24 * time.Hour),
			Modules: []SolutionModule{
				{ModuleID: "redis-stack", Version: "7.2.0"},
				{ModuleID: "postgresql-ha", Version: "15.4.0"},
			},
			Environments: []Environment{
				{
					ID:           "dev",
					Name:         "Development",
					Namespace:    "customer-b-dev",
					Status:       EnvironmentStatusRunning,
					LastDeployed: time.Now().Add(-12 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "redis-stack", Version: "7.2.0", Status: EnvironmentStatusRunning},
						{ModuleID: "postgresql-ha", Version: "15.4.0", Status: EnvironmentStatusError},
					},
				},
				{
					ID:           "prod",
					Name:         "Production",
					Namespace:    "customer-b-prod",
					Status:       EnvironmentStatusError,
					LastDeployed: time.Now().Add(-36 * time.Hour),
					Modules: []EnvironmentModule{
						{ModuleID: "redis-stack", Version: "7.2.0", Status: EnvironmentStatusRunning},
						{ModuleID: "postgresql-ha", Version: "15.4.0", Status: EnvironmentStatusError},
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
	for _, solution := range s.solutions {
		if solution.ID == id {
			return &solution
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