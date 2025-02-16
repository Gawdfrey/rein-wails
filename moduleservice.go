package main

import (
	"strings"
	"time"
)

type ModuleAttributes struct {
	GithubRepo    string            `json:"githubRepo,omitempty"`
	Documentation string            `json:"documentation,omitempty"`
	Website       string            `json:"website,omitempty"`
	License       string            `json:"license,omitempty"`
	Packages      map[string]string `json:"packages,omitempty"`
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
	Organization   string            `json:"organization"`
	LastUpdated    time.Time         `json:"lastUpdated" ts_type:"string"`
	Tags           []string          `json:"tags"`
	Version        string            `json:"version"`
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
	Organization   string            `json:"organization"`
	LastUpdated    time.Time         `json:"lastUpdated" ts_type:"string"`
	Tags           []string          `json:"tags"`
	Version        string            `json:"version"`
	Maintainer     string            `json:"maintainer"`
	Dependencies   []ModuleDependency `json:"dependencies"`
	Attributes     ModuleAttributes   `json:"attributes"`
	Components     []ModuleComponent  `json:"components"`
}

type ModuleService struct {
	modules []Module
	github  *GitHubService
}

func (m Module) ToResponse() ModuleResponse {
	return ModuleResponse{
		ID:             m.ID,
		Name:           m.Name,
		Description:    m.Description,
		Organization:   m.Organization,
		LastUpdated:    m.LastUpdated,
		Tags:           m.Tags,
		Version:        m.Version,
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
			ID:             "decision",
			Name:           "Decision Engine",
			Description:    "Comprehensive decision management system with case handling and business rules engine",
			Organization:   "stacc",
			LastUpdated:    time.Now(),
			Tags:           []string{"business-logic", "workflow", "rules-engine"},
			Version:        "1.0.0",
			Maintainer:     "Blocc Team",
			Dependencies:   []ModuleDependency{
				{
					ID:      "control-panel",
					Name:    "Control Panel",
					Version: "1.0.0",
				},
			},
			Attributes: ModuleAttributes{
				Documentation: "https://docs.blocc.dev/decision",
				License:       "Apache-2.0",
				Packages: map[string]string{
					"npm": "https://www.npmjs.com/package/@blocc/decision-engine",
					"nuget": "https://www.nuget.org/packages/Blocc.DecisionEngine",
				},
			},
			Components: []ModuleComponent{
				{
					ID:          "decision-api",
					Name:        "Decision API Gateway",
					Type:        ComponentTypeApiGateway,
					Description: "API Gateway for decision engine services",
				},
				{
					ID:          "case-manager",
					Name:        "Case Manager Frontend",
					Type:        ComponentTypeFrontend,
					Description: "User interface for managing cases and workflows",
				},
				{
					ID:          "control-panel",
					Name:        "Control Panel Frontend",
					Type:        ComponentTypeFrontend,
					Description: "Administrative interface for managing rules and configurations",
				},
				{
					ID:          "decision-engine",
					Name:        "Decision Engine",
					Type:        ComponentTypeBackend,
					Description: "Core decision engine for processing business rules",
				},
			},
		},
		{
			ID:             "control-panel",
			Name:           "Control Panel",
			Description:    "Control Panel for managing rules and configurations",
			Organization:   "stacc",
			LastUpdated:    time.Now(),
			Tags:           []string{"admin", "dashboard"},
			Version:        "1.0.0",
			Maintainer:     "Asset finance",
			Dependencies: []ModuleDependency{
				
			},
			Attributes: ModuleAttributes{
				GithubRepo:    "https://github.com/stacc/reimagined-tribble",
			},
			Components: []ModuleComponent{
				{
					ID:          "control-panel-server",
					Name:        "Control Panel Server",
					Type:        ComponentTypeBackend,
					Description: "Core Control Panel server",
				},
				{
					ID:          "control-panel-frontend",
					Name:        "Control Panel Frontend",
					Type:        ComponentTypeFrontend,
					Description: "User interface for managing rules and configurations",
				},
			},
		},
		{
			ID:             "flow",
			Name:           "Flow",
			Description:    "Process orchestration tool based on Camunda",
			Organization:   "stacc",
			LastUpdated:    time.Now().Add(-24 * time.Hour),
			Tags:           []string{"process"},
			Version:        "15.4.0",
			Maintainer:     "Workflow",
			Attributes: ModuleAttributes{
				GithubRepo:    "https://github.com/sindresorhus/github-markdown-css",
				Documentation: "https://developer.stacc.dev/",
				Website:       "https://www.stacc.com/",
				License:       "Apache-2.0",
			},
			Dependencies:   []ModuleDependency{},
			Components: []ModuleComponent{
				{
					ID:          "camunda",
					Name:        "Camunda",
					Type:        ComponentTypeBackend,
					Description: "Camunda process engine",
				},
				{
					ID:          "process",
					Name:        "Process",
					Type:        ComponentTypeBackend,
					Description: "Process orchestration",
				},
				
			},
		},
	}

	return &ModuleService{
		modules: modules,
		github:  NewGitHubService(),
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

// GetModuleReadme fetches the README content from GitHub if available
func (s *ModuleService) GetModuleReadme(id string) string {
	module := s.GetModule(id)
	if module == nil || module.Attributes.GithubRepo == "" {
		return ""
	}

	readme, err := s.github.GetReadmeFromURL(module.Attributes.GithubRepo)
	if err != nil {
		return ""
	}

	return readme
} 