package main

import (
	"os"
	"runtime"
)

type SystemInfo struct {
	OperatingSystem string `json:"operatingSystem"`
	Shell           string `json:"shell"`
	Architecture    string `json:"architecture"`
}

type SystemService struct{}

func NewSystemService() *SystemService {
	return &SystemService{}
}

// GetSystemInfo returns information about the system
func (s *SystemService) GetSystemInfo() SystemInfo {
	shell := os.Getenv("SHELL")
	if shell == "" {
		if runtime.GOOS == "windows" {
			shell = "cmd.exe"
		} else {
			shell = "/bin/sh"
		}
	}

	return SystemInfo{
		OperatingSystem: runtime.GOOS + " " + runtime.GOARCH,
		Shell:          shell,
		Architecture:   runtime.GOARCH,
	}
} 