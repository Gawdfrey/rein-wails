package main

import (
	"fmt"
	"math/rand"
	"time"
)

type LogService struct {
	// In a real implementation, this would connect to a log aggregation service
	// For now, we'll generate mock logs
}

type LogEntry struct {
	Timestamp time.Time `json:"timestamp" ts_type:"string"`
	Level     string    `json:"level"`
	Message   string    `json:"message"`
}

func NewLogService() *LogService {
	return &LogService{}
}

// GetComponentLogs returns logs for a specific component in an environment
func (s *LogService) GetComponentLogs(solutionId string, environmentId string, componentId string) ([]LogEntry, error) {
	logs := []LogEntry{}
	
	// Generate some mock logs
	now := time.Now()
	levels := []string{"INFO", "WARN", "ERROR", "DEBUG"}
	
	// Component-specific log templates
	logTemplates := map[string][]string{
		"redis-server": {
			"Connected to master at %s",
			"Memory usage: %dMB",
			"Processing %d commands per second",
			"Cache hit ratio: %d%%",
			"Replication status: %s",
			"Keyspace: db%d keys=%d expires=%d",
			"Received PING from client at %s",
			"Background saving started",
			"RDB: %d bytes from disk to memory",
			"AOF rewrite in progress",
		},
		"postgres-server": {
			"Database system is ready to accept connections",
			"Checkpoint starting: %s",
			"Connection received: host=%s port=%d",
			"Execute query: duration=%dms rows=%d",
			"Autovacuum: processing database %s",
			"WAL file %s has been archived",
			"Slow query detected: %dms",
			"Replication slot %s has been created",
			"Database size: %dGB",
			"Buffer cache hit rate: %d%%",
		},
		"patroni": {
			"Leader election in progress",
			"Node %s promoted to leader",
			"Sync replication with %d standbys",
			"Health check: %s",
			"Configuration reload triggered",
			"Failover initiated by %s",
			"Cluster status: %s",
			"DCS update: %s",
			"Watching node %s",
			"Timeline divergence detected",
		},
	}

	// Default templates for components without specific logs
	defaultTemplates := []string{
		"Service health check: %s",
		"Processing request from %s",
		"Response time: %dms",
		"Resource usage: CPU=%d%% Memory=%dMB",
		"Connection pool: active=%d idle=%d",
		"Cache status: size=%dMB items=%d",
		"Background task completed in %dms",
		"Configuration updated: %s",
		"Metrics collected: %d samples",
		"Event processed: type=%s duration=%dms",
	}

	// Get templates for this component
	templates := defaultTemplates
	if specificTemplates, exists := logTemplates[componentId]; exists {
		templates = specificTemplates
	}

	// Generate random IPs for log messages
	ips := []string{
		"192.168.1.100", "10.0.0.50", "172.16.0.25",
		"192.168.0.10", "10.0.1.15", "172.16.1.30",
	}

	// Generate 100 log entries
	for i := 0; i < 100; i++ {
		level := levels[rand.Intn(len(levels))]
		template := templates[rand.Intn(len(templates))]
		
		// Generate random values for template placeholders
		message := fmt.Sprintf(template,
			ips[rand.Intn(len(ips))],
			rand.Intn(1000),
			rand.Intn(100),
			rand.Intn(1000),
			"active",
			rand.Intn(10),
		)
		
		// Add component context
		message = fmt.Sprintf("[%s] %s", componentId, message)
		
		// Randomize timestamp within last hour
		timestamp := now.Add(-time.Duration(rand.Intn(3600)) * time.Second)
		
		// Adjust log level distribution
		if rand.Float32() < 0.7 {
			level = "INFO" // 70% INFO
		} else if rand.Float32() < 0.9 {
			level = "WARN" // 20% WARN
		} else {
			level = "ERROR" // 10% ERROR
		}

		logs = append(logs, LogEntry{
			Timestamp: timestamp,
			Level:     level,
			Message:   message,
		})
	}

	// Sort logs by timestamp (newest first)
	for i := 0; i < len(logs)-1; i++ {
		for j := i + 1; j < len(logs); j++ {
			if logs[i].Timestamp.Before(logs[j].Timestamp) {
				logs[i], logs[j] = logs[j], logs[i]
			}
		}
	}

	return logs, nil
}

// StreamComponentLogs would be used for real-time log streaming
// This would be implemented with WebSocket in a real application
func (s *LogService) StreamComponentLogs(solutionId string, environmentId string, componentId string) error {
	// Not implemented in this mock version
	return fmt.Errorf("log streaming not implemented")
} 