# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD, testing, and maintenance.

## Workflows

### 1. CI (Continuous Integration) - `ci.yml`
**Triggers:** Push to main/develop, Pull requests

**Jobs:**
- **Test Matrix:** Tests on Node.js 18.x, 20.x, 22.x
- **Coverage:** Uploads coverage to Codecov (Node 20.x only)
- **Code Quality:** Runs npm audit for security vulnerabilities

**Status Badge:**
```markdown
[![CI](https://github.com/yourusername/stylelint-plugin-no-override-properties/workflows/CI/badge.svg)](https://github.com/yourusername/stylelint-plugin-no-override-properties/actions)
```

---

### 2. Publish to npm - `publish.yml`
**Triggers:** GitHub Release published

**Jobs:**
- Verifies version in package.json matches release tag
- Runs full test suite
- Publishes to npm with provenance
- Comments on release with npm link

**Required Secrets:**
- `NPM_TOKEN` - npm authentication token (create at https://www.npmjs.com/settings/tokens)

**Setup:**
1. Create npm token: `npm token create`
2. Add to GitHub: Settings → Secrets → Actions → New secret
3. Name: `NPM_TOKEN`, Value: your token

---

### 3. Auto Update Dependencies - `auto-update.yml`
**Triggers:** 
- Schedule: Every Monday at 9:00 AM UTC
- Manual: workflow_dispatch

**Jobs:**
- Updates all devDependencies to latest compatible versions
- Fixes security vulnerabilities
- Runs tests
- Creates PR if tests pass
- Creates issue if tests fail

**Features:**
- Automatic PR creation with detailed change summary
- Only creates PR if all tests pass
- Labels PR as `dependencies` and `automated`

---

### 4. Dependency Review - `dependency-review.yml`
**Triggers:** Pull requests to main

**Jobs:**
- Reviews dependency changes in PRs
- Checks for security vulnerabilities
- Blocks PRs with AGPL/GPL licenses
- Comments summary on PR

---

### 5. CodeQL Security Analysis - `codeql.yml`
**Triggers:**
- Push to main/develop
- Pull requests to main
- Schedule: Every Saturday at 2:00 AM UTC

**Jobs:**
- Static code analysis for security issues
- Checks for common vulnerabilities
- Results visible in Security tab

---

### 6. Release - `release.yml`
**Triggers:** Push tags matching `v*.*.*` (e.g., v1.0.0)

**Jobs:**
- Creates GitHub Release from tag
- Extracts changelog from CHANGELOG.md
- Runs tests before creating release
- Auto-generates release notes

**Usage:**
```bash
# Create and push tag
git tag v1.0.1
git push origin v1.0.1

# Workflow will automatically:
# 1. Run tests
# 2. Create GitHub Release
# 3. Trigger publish.yml workflow
```

---

## Setup Instructions

### 1. Enable GitHub Actions
Go to repository Settings → Actions → General → Allow all actions

### 2. Required Secrets

Add these secrets in Settings → Secrets → Actions:

| Secret | Description | How to get |
|--------|-------------|------------|
| `NPM_TOKEN` | npm publish token | https://www.npmjs.com/settings/tokens |
| `CODECOV_TOKEN` | Codecov upload token | https://codecov.io/ (optional) |

### 3. Branch Protection (Optional but Recommended)

Settings → Branches → Add rule for `main`:
- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - [x] Test on Node 20.x
  - [x] Code Quality
- [x] Require branches to be up to date before merging

### 4. Enable Dependabot (Optional)

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```

---

## Workflow Diagram

```
┌─────────────────┐
│  Push to main   │
└────────┬────────┘
         │
         ├──────────→ CI Workflow (test on 3 Node versions)
         │
         └──────────→ CodeQL Analysis (security)


┌─────────────────┐
│   Create Tag    │
│    (v1.0.0)     │
└────────┬────────┘
         │
         ├──────────→ Release Workflow (create GitHub release)
         │
         └──────────→ Publish Workflow (publish to npm)


┌─────────────────┐
│  Every Monday   │
└────────┬────────┘
         │
         └──────────→ Auto Update Workflow (update deps → create PR)


┌─────────────────┐
│  Pull Request   │
└────────┬────────┘
         │
         ├──────────→ CI Workflow
         │
         └──────────→ Dependency Review
```

---

## Troubleshooting

### CI fails on npm ci
- Check that package-lock.json is committed
- Try deleting and regenerating: `rm package-lock.json && npm install`

### Publish fails with 403
- Verify NPM_TOKEN is valid and has publish permissions
- Check package name is available on npm
- Ensure you're logged into correct npm account

### Auto-update creates too many PRs
- Adjust schedule in `auto-update.yml`
- Use Dependabot instead for more granular control

### CodeQL analysis fails
- Check that code compiles successfully
- Some syntax errors may cause CodeQL to fail

---

## Badges for README

Add these to your README.md:

```markdown
[![CI](https://github.com/yourusername/stylelint-plugin-no-override-properties/workflows/CI/badge.svg)](https://github.com/yourusername/stylelint-plugin-no-override-properties/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/stylelint-plugin-no-override-properties.svg)](https://www.npmjs.com/package/stylelint-plugin-no-override-properties)
[![codecov](https://codecov.io/gh/yourusername/stylelint-plugin-no-override-properties/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/stylelint-plugin-no-override-properties)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

---

Last updated: 2026-01-16
