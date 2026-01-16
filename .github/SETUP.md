# GitHub Actions Setup Guide

This guide will help you configure GitHub Actions for automatic testing, publishing, and dependency updates.

## 📋 Prerequisites

- GitHub repository created
- npm account (for publishing)
- Admin access to repository

## 🚀 Quick Setup (5 minutes)

### Step 1: Create npm Token

1. Go to https://www.npmjs.com/settings/tokens
2. Click "Generate New Token" → "Classic Token"
3. Select "Automation" type
4. Copy the token (you won't see it again!)

### Step 2: Add npm Token to GitHub

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: paste your npm token
6. Click "Add secret"

### Step 3: Push Workflows to GitHub

```bash
cd /Users/kpiatek2/workspace/stylelint-plugin-no-override-properties
git add .github/
git commit -m "feat: add GitHub Actions workflows"
git push
```

### Step 4: Enable GitHub Actions (if needed)

1. Go to repository Settings → Actions → General
2. Under "Actions permissions", select "Allow all actions"
3. Click "Save"

## ✅ That's it! Your workflows are ready.

---

## 📊 Available Workflows

### 1. CI (Continuous Integration)
**Auto-runs on:** Every push and pull request

**What it does:**
- ✅ Tests on Node.js 18, 20, 22
- ✅ Runs test coverage
- ✅ Checks for security vulnerabilities

**No setup required** - works automatically!

---

### 2. Auto Update Dependencies
**Auto-runs:** Every Monday at 9:00 AM UTC

**What it does:**
- 🔄 Updates all dependencies to latest compatible versions
- 🧪 Runs tests
- 📝 Creates PR if tests pass
- ⚠️ Creates issue if tests fail

**No setup required** - works automatically!

You can also trigger manually:
1. Go to Actions tab
2. Select "Auto Update Dependencies"
3. Click "Run workflow"

---

### 3. Publish to npm
**Auto-runs:** When you create a GitHub Release

**What it does:**
- ✅ Verifies version matches tag
- ✅ Runs tests
- 📦 Publishes to npm
- 💬 Comments on release with npm link

**Setup:** Requires `NPM_TOKEN` secret (see Step 1-2 above)

**Usage:**
```bash
# Option A: Create release via GitHub UI
1. Go to Releases → Draft a new release
2. Create tag: v1.0.0
3. Fill in release notes
4. Click "Publish release"
# → Automatically publishes to npm!

# Option B: Create release via command line
git tag v1.0.0
git push origin v1.0.0
# Then create release on GitHub UI
```

---

### 4. Release Creation
**Auto-runs:** When you push a tag like `v1.0.0`

**What it does:**
- 📝 Creates GitHub Release
- 📋 Extracts notes from CHANGELOG.md
- ✅ Runs tests

**Usage:**
```bash
# Update version in package.json
npm version patch  # 1.0.0 → 1.0.1
# or
npm version minor  # 1.0.0 → 1.1.0
# or
npm version major  # 1.0.0 → 2.0.0

# Push tag
git push --follow-tags

# Workflow creates GitHub Release
# → Which triggers Publish workflow → npm!
```

---

### 5. Dependency Review
**Auto-runs:** On every pull request

**What it does:**
- 🔍 Reviews dependency changes
- 🚨 Warns about security issues
- ⛔ Blocks AGPL/GPL licenses
- 💬 Comments on PR

**No setup required** - works automatically!

---

### 6. CodeQL Security Analysis
**Auto-runs:** 
- Every push to main/develop
- Every Saturday at 2:00 AM UTC
- On pull requests

**What it does:**
- 🔒 Static security analysis
- 🐛 Finds vulnerabilities
- 📊 Results in Security tab

**No setup required** - works automatically!

---

## 🔧 Optional: Codecov Integration

To track test coverage over time:

1. Go to https://codecov.io/
2. Sign in with GitHub
3. Enable your repository
4. Copy the token
5. Add to GitHub Secrets as `CODECOV_TOKEN`
6. Coverage badge will appear in README

---

## 🎯 Complete Publishing Workflow

Here's how to release a new version:

```bash
# 1. Make your changes
git add .
git commit -m "feat: add awesome feature"

# 2. Update CHANGELOG.md
# Add entry for new version

# 3. Bump version
npm version minor  # or patch/major

# 4. Push everything
git push --follow-tags

# 5. Wait for workflows to complete
# ✅ CI tests pass
# ✅ Release workflow creates GitHub Release
# ✅ Publish workflow publishes to npm
# 🎉 Done!
```

---

## 🛠️ Troubleshooting

### Publish fails with "403 Forbidden"
- Check NPM_TOKEN is valid
- Verify you have publish permissions
- Ensure package name is available on npm

### Auto-update creates too many PRs
Edit `.github/workflows/auto-update.yml`:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Change to run less frequently
```

### CI fails on specific Node version
This is expected if your code uses features not available in older Node.
Update `engines` in package.json:
```json
"engines": {
  "node": ">=20.0.0"
}
```

### Workflows don't run
1. Check Settings → Actions → General → Allow all actions
2. Verify workflows are in `.github/workflows/` directory
3. Check workflow syntax at https://www.yamllint.com/

---

## 📊 Monitoring Your Workflows

### View Workflow Runs
Repository → Actions tab

### Enable Email Notifications
Settings → Notifications → Actions → Configure

### Add Status Badges to README
Already added! Update username in README.md:
```markdown
[![CI](https://github.com/YOURUSERNAME/stylelint-plugin-no-override-properties/workflows/CI/badge.svg)]
```

---

## 🎉 You're All Set!

Your GitHub Actions are configured and ready to:
- ✅ Automatically test every change
- ✅ Update dependencies weekly
- ✅ Publish to npm on release
- ✅ Scan for security issues
- ✅ Review dependency changes

Questions? Check the [workflows README](.github/workflows/README.md)
