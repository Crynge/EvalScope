[![CI](https://github.com/Crynge/EvalScope/actions/workflows/ci.yml/badge.svg)](https://github.com/Crynge/EvalScope/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://typescriptlang.org)
[![Go](https://img.shields.io/badge/Go-1.22-00ADD8)](https://go.dev)

# EvalScope

**Multi-language evaluation and scanning platform.**

Scan codebases, APIs, and configurations for vulnerabilities, style issues, and compliance gaps — surfaced through a rich web dashboard.

## Scorecard

```
┌─────────────────────────────────────────────────────────────┐
│                      EVALSCOPE REPORT                       │
├─────────────────────────────────────────────────────────────┤
│  Repository:    Crynge/eval-demo                            │
│  Branch:        main                                        │
│  Commit:        a1b2c3d                                      │
│  Timestamp:     2026-07-01T12:00:00Z                        │
├─────────────────────────────────────────────────────────────┤
│  Category           Score    Issues    Pass/Fail            │
│  ─────────────────────────────────────────────────────────  │
│  Security           ████████░░  80%     12 │ ▓▓▓▓▓▓▓▓░░     │
│  Style              ███████░░░  70%     24 │ ▓▓▓▓▓▓▓░░░░     │
│  Performance        █████████░  90%      3 │ ▓▓▓▓▓▓▓▓▓░     │
│  Accessibility      ██████░░░░  60%     18 │ ▓▓▓▓▓▓░░░░     │
│  Compliance         ████████░░  80%      7 │ ▓▓▓▓▓▓▓▓░░     │
│  Test Coverage      █████░░░░░  50%     31 │ ▓▓▓▓▓░░░░░     │
├─────────────────────────────────────────────────────────────┤
│  Overall:           ███████░░░  72%     95 issues           │
│  Verdict:           ⚠️  Needs improvement                    │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
npm install @crynge/evalscope

# Scan a directory
npx evalscope scan ./src --format detailed

# Start web dashboard
npx evalscope dashboard --port 8080

# CI mode (fail on score below threshold)
npx evalscope scan ./src --ci --threshold 80
```

## API

```bash
# Run scan via REST API
curl -X POST http://localhost:8080/api/scan \
  -H "Content-Type: application/json" \
  -d '{"path": "./src", "categories": ["security", "style"]}'

# Get results
curl http://localhost:8080/api/results/latest
```

## Check Categories

| Category | Checks | Go Backend | TS Backend |
|---|---|---|---|
| Security | SQL injection, XSS, credential leaks | ✅ | ✅ |
| Style | Linting, formatting, conventions | ✅ | ✅ |
| Performance | Bottlenecks, memory leaks | ✅ | ❌ |
| Accessibility | ARIA labels, contrast ratios | ❌ | ✅ |
| Compliance | SPDX headers, license audits | ✅ | ✅ |

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Scanner TS  │────▶│   API Gateway    │────▶│  Dashboard   │
│  (rulesets)  │     │  (Go + Express)  │     │  (Web UI)    │
└──────────────┘     └──────────────────┘     └──────────────┘
                           │
                    ┌──────┴──────┐
                    │  Store      │
                    │  (SQLite)   │
                    └─────────────┘
```
