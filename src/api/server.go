// EvalScope Go backend — high-performance search and analytics
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
)

type Entry struct {
    ID          string `json:"id"`
    Name        string `json:"name"`
    Category    string `json:"category"`
    Language    string `json:"language"`
    Stars       int    `json:"stars"`
    Pricing     string `json:"pricing"`
    Description string `json:"description"`
}

var catalog = []Entry{
    {ID: "1", Name: "LangChain", Category: "agent-framework", Language: "Python", Stars: 95000, Pricing: "free"},
    {ID: "2", Name: "CrewAI", Category: "agent-framework", Language: "Python", Stars: 25000, Pricing: "free"},
    {ID: "3", Name: "Inspect AI", Category: "evaluation-harness", Language: "Python", Stars: 8000, Pricing: "free"},
    {ID: "4", Name: "promptfoo", Category: "evaluation-harness", Language: "TypeScript", Stars: 12000, Pricing: "free"},
}

func handleEntries(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{"entries": catalog, "total": len(catalog)})
}

func handleSearch(w http.ResponseWriter, r *http.Request) {
    q := strings.ToLower(r.URL.Query().Get("q"))
    var results []Entry
    for _, e := range catalog {
        if strings.Contains(strings.ToLower(e.Name), q) || strings.Contains(strings.ToLower(e.Description), q) {
            results = append(results, e)
        }
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{"results": results, "total": len(results)})
}

func main() {
    http.HandleFunc("/api/v1/entries", handleEntries)
    http.HandleFunc("/api/v1/search", handleSearch)
    fmt.Println("EvalScope Go API on :9090")
    http.ListenAndServe(":9090", nil)
}
