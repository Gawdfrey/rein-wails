package main

import (
	"strings"
	"time"
)

// Module represents a Blocc module
type Module struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	LastUpdated time.Time `json:"lastUpdated" ts_type:"string"` // Use ts_type to specify the TypeScript type
	Tags        []string  `json:"tags"`
}

// ModuleResponse is used for API responses to ensure consistent JSON serialization
type ModuleResponse struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	LastUpdated string   `json:"lastUpdated"` // ISO date string
	Tags        []string `json:"tags"`
}

type ModuleService struct {
	modules []Module
}

func (m Module) ToResponse() ModuleResponse {
	return ModuleResponse{
		ID:          m.ID,
		Name:        m.Name,
		Description: m.Description,
		LastUpdated: m.LastUpdated.Format(time.RFC3339),
		Tags:        m.Tags,
	}
}

func NewModuleService() *ModuleService {
	// Initialize with some mock data
	modules := []Module{
		{
			ID:          "1",
			Name:        "Redis Stack",
			Description: "Redis with additional modules for advanced data structures",
			LastUpdated: time.Now(),
			Tags:        []string{"database", "cache"},
		},
		{
			ID:          "2",
			Name:        "PostgreSQL HA",
			Description: "High availability PostgreSQL cluster",
			LastUpdated: time.Now().Add(-24 * time.Hour),
			Tags:        []string{"database", "ha"},
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