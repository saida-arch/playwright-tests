# Asana Demo App — Playwright Test Suite

A **data-driven** Playwright test suite (TypeScript) that validates task placement and tags across the [Asana Demo App](https://animated-gingersnap-8cf7f2.netlify.app).

---

## Architecture

```
asana-playwright-tests/
├── data/
│   └── testCases.ts        # Single source of truth — all 6 test scenarios as JSON
├── tests/
│   └── tasks.spec.ts       # Data-driven test loop (no copy-paste)
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json
└── package.json
```

### Why data-driven?

All 6 test cases share the same workflow:
1. Login
2. Navigate to a project
3. Assert a task is in the right column with the right tags

Instead of repeating that code 6 times, a `for...of` loop iterates over the `testCases` array and generates each `test()` dynamically. Adding a new scenario requires **only a new JSON entry** — zero code changes.

---

## Test Cases

| # | Project | Task | Column | Tags |
|---|---------|------|--------|------|
| 1 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| 2 | Web Application | Fix navigation bug | To Do | Bug |
| 3 | Web Application | Design system updates | In Progress | Design |
| 4 | Mobile Application | Push notification system | To Do | Feature |
| 5 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| 6 | Mobile Application | App icon design | Done | Design |

---

## Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd asana-playwright-tests

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium
```

---

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run with browser visible
npm run test:headed

# View HTML report after run
npm run test:report
```

---

## Credentials

| Field    | Value       |
|----------|-------------|
| Username | `admin`     |
| Password | `password123` |
| URL      | https://animated-gingersnap-8cf7f2.netlify.app |
