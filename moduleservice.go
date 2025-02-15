package main

import (
	"strings"
	"time"
)

type ModuleAttributes struct {
	GithubRepo    string `json:"githubRepo,omitempty"`
	Documentation string `json:"documentation,omitempty"`
	Website       string `json:"website,omitempty"`
	License       string `json:"license,omitempty"`
}

type ComponentType string

const (
	ComponentTypeBackend    ComponentType = "Backend"
	ComponentTypeFrontend   ComponentType = "Frontend"
	ComponentTypeApiGateway ComponentType = "ApiGateway"
	ComponentTypeSetup      ComponentType = "Setup"
)

type ModuleComponent struct {
	ID          string        `json:"id"`
	Name        string        `json:"name"`
	Type        ComponentType `json:"type"`
	Description string        `json:"description"`
	Version     string        `json:"version"`
}

type ModuleDependency struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Version string `json:"version"`
}

// Module represents a Blocc module
type Module struct {
	ID             string            `json:"id"`
	Name           string            `json:"name"`
	Description    string            `json:"description"`
	LastUpdated    time.Time         `json:"lastUpdated" ts_type:"string"`
	Tags           []string          `json:"tags"`
	Version        string            `json:"version"`
	InstallCommand string            `json:"installCommand"`
	Maintainer     string            `json:"maintainer"`
	Dependencies   []ModuleDependency `json:"dependencies"`
	Attributes     ModuleAttributes   `json:"attributes"`
	Components     []ModuleComponent  `json:"components"`
}

// ModuleResponse is used for API responses to ensure consistent JSON serialization
type ModuleResponse struct {
	ID             string            `json:"id"`
	Name           string            `json:"name"`
	Description    string            `json:"description"`
	LastUpdated    string            `json:"lastUpdated"` // ISO date string
	Tags           []string          `json:"tags"`
	Version        string            `json:"version"`
	InstallCommand string            `json:"installCommand"`
	Maintainer     string            `json:"maintainer"`
	Dependencies   []ModuleDependency `json:"dependencies"`
	Attributes     ModuleAttributes   `json:"attributes"`
	Components     []ModuleComponent  `json:"components"`
}

type ModuleService struct {
	modules []Module
}

func (m Module) ToResponse() ModuleResponse {
	return ModuleResponse{
		ID:             m.ID,
		Name:           m.Name,
		Description:    m.Description,
		LastUpdated:    m.LastUpdated.Format(time.RFC3339),
		Tags:           m.Tags,
		Version:        m.Version,
		InstallCommand: m.InstallCommand,
		Maintainer:     m.Maintainer,
		Dependencies:   m.Dependencies,
		Attributes:     m.Attributes,
		Components:     m.Components,
	}
}

func NewModuleService() *ModuleService {
	// Initialize with some mock data
	modules := []Module{
		{
			ID:             "redis-stack",
			Name:           "Redis Stack",
			Description:    "Redis with additional modules for advanced data structures",
			LastUpdated:    time.Now(),
			Tags:           []string{"database", "cache"},
			Version:        "7.2.0",
			InstallCommand: "blocc install redis-stack",
			Maintainer:     "Redis Labs",
			Dependencies: []ModuleDependency{
				{
					ID:      "redis-core",
					Name:    "Redis Core",
					Version: "7.2.0",
				},
			},
			Attributes: ModuleAttributes{
				GithubRepo:    "https://github.com/redis/redis-stack",
				Documentation: "https://redis.io/docs/stack/",
				Website:       "https://redis.io/",
				License:       "MIT",
			},
			Components: []ModuleComponent{
				{
					ID:          "redis-server",
					Name:        "Redis Server",
					Type:        ComponentTypeBackend,
					Description: "Core Redis server with additional modules",
					Version:     "7.2.0",
				},
				{
					ID:          "redis-setup",
					Name:        "Redis Setup",
					Type:        ComponentTypeSetup,
					Description: "Configuration and initialization scripts",
					Version:     "1.0.0",
				},
			},
		},
		{
			ID:             "postgresql-ha",
			Name:           "PostgreSQL HA",
			Description:    "High availability PostgreSQL cluster",
			LastUpdated:    time.Now().Add(-24 * time.Hour),
			Tags:           []string{"database", "ha"},
			Version:        "15.4.0",
			InstallCommand: "blocc install postgresql-ha",
			Maintainer:     "Zalando",
			Dependencies: []ModuleDependency{
				{
					ID:      "postgresql",
					Name:    "PostgreSQL",
					Version: "15.4.0",
				},
				{
					ID:      "etcd",
					Name:    "etcd",
					Version: "3.5.0",
				},
			},
			Attributes: ModuleAttributes{
				GithubRepo:    "https://github.com/zalando/patroni",
				Documentation: "https://patroni.readthedocs.io/",
				Website:       "https://www.postgresql.org/",
				License:       "Apache-2.0",
			},
			Components: []ModuleComponent{
				{
					ID:          "postgres-server",
					Name:        "PostgreSQL Server",
					Type:        ComponentTypeBackend,
					Description: "PostgreSQL database server",
					Version:     "15.4.0",
				},
				{
					ID:          "patroni",
					Name:        "Patroni",
					Type:        ComponentTypeBackend,
					Description: "HA controller for PostgreSQL",
					Version:     "3.1.0",
				},
				{
					ID:          "pg-api",
					Name:        "PostgreSQL API",
					Type:        ComponentTypeApiGateway,
					Description: "REST API for cluster management",
					Version:     "1.0.0",
				},
				{
					ID:          "pg-setup",
					Name:        "PostgreSQL Setup",
					Type:        ComponentTypeSetup,
					Description: "Cluster initialization and configuration",
					Version:     "1.0.0",
				},
			},
		},
	}

	return &ModuleService{
		modules: modules,
	}
}

func (s *ModuleService) GetModules() []ModuleResponse {
	responses := make([]ModuleResponse, len(s.modules))
	for i, module := range s.modules {
		responses[i] = module.ToResponse()
	}
	return responses
}

func (s *ModuleService) GetModule(id string) *ModuleResponse {
	for _, module := range s.modules {
		if module.ID == id {
			response := module.ToResponse()
			return &response
		}
	}
	return nil
}

func (s *ModuleService) SearchModules(query string) []ModuleResponse {
	if query == "" {
		return s.GetModules()
	}

	var results []Module
	queryLower := strings.ToLower(query)

	for _, module := range s.modules {
		// Search in name, description, and tags
		if strings.Contains(strings.ToLower(module.Name), queryLower) ||
			strings.Contains(strings.ToLower(module.Description), queryLower) {
			results = append(results, module)
			continue
		}

		// Search in tags
		for _, tag := range module.Tags {
			if strings.Contains(strings.ToLower(tag), queryLower) {
				results = append(results, module)
				break
			}
		}
	}

	responses := make([]ModuleResponse, len(results))
	for i, module := range results {
		responses[i] = module.ToResponse()
	}
	return responses
} 