package main

import (
	"bytes"
	"context"
	"strings"

	"github.com/google/go-github/v69/github"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
)

type GitHubService struct {
	client *github.Client
	md     goldmark.Markdown
}

func NewGitHubService() *GitHubService {
	return &GitHubService{
		client: github.NewClient(nil),
		md:     goldmark.New(goldmark.WithExtensions(extension.GFM)),
	}
}

// GetReadmeFromURL extracts owner and repo from a GitHub URL and fetches the README
func (s *GitHubService) GetReadmeFromURL(url string) (string, error) {
	owner, repo := extractOwnerAndRepo(url)
	if owner == "" || repo == "" {
		return "", nil
	}

	ctx := context.Background()
	readme, _, err := s.client.Repositories.GetReadme(ctx, owner, repo, &github.RepositoryContentGetOptions{})
	if err != nil {
		if _, ok := err.(*github.RateLimitError); ok {
			return "", err
		}
		return "", nil
	}

	content, err := readme.GetContent()
	if err != nil {
		return "", err
	}

	// Convert markdown to HTML
	var buf bytes.Buffer
	if err := s.md.Convert([]byte(content), &buf); err != nil {
		return "", err
	}

	// Add GitHub-style markdown CSS classes
	html := `<div class="markdown-body">` + buf.String() + `</div>`
	return html, nil
}

// extractOwnerAndRepo extracts the owner and repository name from a GitHub URL
func extractOwnerAndRepo(url string) (string, string) {
	// Remove trailing slash if present
	url = strings.TrimSuffix(url, "/")

	// Handle different GitHub URL formats
	url = strings.TrimPrefix(url, "https://")
	url = strings.TrimPrefix(url, "http://")
	url = strings.TrimPrefix(url, "github.com/")

	parts := strings.Split(url, "/")
	if len(parts) < 2 {
		return "", ""
	}

	return parts[0], parts[1]
} 