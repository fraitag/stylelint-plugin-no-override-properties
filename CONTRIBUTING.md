# Contributing to stylelint-plugin-no-override-properties

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to:
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards others

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stylelint-plugin-no-override-properties.git
   cd stylelint-plugin-no-override-properties
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests to verify setup**
   ```bash
   npm test
   ```

## Making Changes

### Project Structure

```
.
├── stylelint-plugin-no-overriding-properties.js  # Main plugin code
├── stylelint-plugin-no-overriding-properties.test.js  # Test suite
├── package.json                                   # Package configuration
├── README.md                                      # User documentation
├── CONTRIBUTING.md                                # This file
└── .gitignore                                     # Git ignore rules
```

### Code Style

- Use **ES Modules** (ESM) syntax
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused on a single responsibility

### Key Components

#### 1. Shorthand Map (`shorthandMap`)
Defines relationships between CSS shorthand and longhand properties:
```javascript
const shorthandMap = {
  'margin': ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  // ...
};
```

**To add new shorthands:**
1. Add to `shorthandMap` object
2. Add test cases for the new shorthand
3. Update README.md documentation

#### 2. Main Rule Function (`ruleFunction`)
Contains the core logic for detecting property overrides:
- Walks through CSS rules
- Extracts properties from parent and child selectors
- Compares properties and reports violations

#### 3. Helper Functions

- `shorthandOverridesLonghand()` - Checks if a shorthand overrides a longhand
- `extractProperties()` - Extracts CSS properties from a rule
- `getFullSelector()` - Constructs full selector path for error messages
- `shouldIgnoreSelector()` - Determines if a selector should be ignored (pseudo-classes, etc.)

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

Tests are written using Jest. Each test should:

1. **Have a clear, descriptive name**
   ```javascript
   it('should detect shorthand overriding longhand (margin)', async () => {
     // ...
   });
   ```

2. **Test one specific behavior**
   ```javascript
   const code = `
     .element {
       margin-top: 10px;
       &-child {
         margin: 0;
       }
     }
   `;
   ```

3. **Make clear assertions**
   ```javascript
   expect(result.results[0].warnings).toHaveLength(1);
   expect(result.results[0].warnings[0].text).toContain('margin-top');
   ```

### Test Categories

- **Exact property override detection** - Same property in parent and child
- **Shorthand property override detection** - Shorthand overriding longhand
- **Ignored selectors** - Pseudo-classes, pseudo-elements, attribute selectors
- **Valid cases** - Cases that should NOT report errors
- **Real-world SCSS patterns** - BEM, responsive design patterns
- **Edge cases** - Empty rulesets, complex selectors

### Adding New Tests

When adding a new feature or fixing a bug:

1. Add a failing test first (TDD approach)
2. Implement the fix/feature
3. Ensure all tests pass
4. Add edge case tests if applicable

## Submitting Changes

### Before Submitting

1. **Run tests**
   ```bash
   npm test
   ```

2. **Verify your changes work with real SCSS**
   ```bash
   # Create a test SCSS file and run stylelint
   npx stylelint your-test-file.scss --config your-config.json
   ```

3. **Update documentation** if needed
   - Update README.md for user-facing changes
   - Update CONTRIBUTING.md for developer-facing changes
   - Add JSDoc comments for new functions

### Pull Request Process

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add support for X" 
   # or
   git commit -m "fix: resolve issue with Y"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `test:` - Adding or updating tests
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance tasks

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots/examples if applicable
   - Ensure all CI checks pass

### Pull Request Checklist

- [ ] Tests pass (`npm test`)
- [ ] Code follows existing style
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventional format
- [ ] No unrelated changes included
- [ ] Branch is up-to-date with main

## Common Development Tasks

### Adding a New Shorthand Property

1. Update `shorthandMap` in `stylelint-plugin-no-overriding-properties.js`
2. Add test cases in `stylelint-plugin-no-overriding-properties.test.js`
3. Run tests to verify
4. Update README.md to document the new shorthand

Example:
```javascript
// In stylelint-plugin-no-overriding-properties.js
const shorthandMap = {
  // ... existing shorthands
  'place-items': ['align-items', 'justify-items'],
};

// In stylelint-plugin-no-overriding-properties.test.js
it('should detect place-items shorthand overriding align-items', async () => {
  const code = `
    .grid {
      align-items: center;
      &-container {
        place-items: start;
      }
    }
  `;
  const result = await stylelint.lint({ code, config, customSyntax: 'postcss-scss' });
  expect(result.results[0].warnings).toHaveLength(1);
});
```

### Debugging Tests

```bash
# Run a specific test file
npm test -- stylelint-plugin-no-overriding-properties.test.js

# Run tests matching a pattern
npm test -- -t "shorthand"

# Run with verbose output
npm test -- --verbose
```

### Manual Testing

Create a test SCSS file:
```scss
// test.scss
.test {
  margin-right: 20px;
  
  &-child {
    margin: 0;  // Should trigger warning
  }
}
```

Create a stylelint config:
```json
// .stylelintrc.json
{
  "plugins": ["./stylelint-plugin-no-overriding-properties.js"],
  "rules": {
    "plugin/no-overriding-properties": true
  }
}
```

Run stylelint:
```bash
npx stylelint test.scss --config .stylelintrc.json --custom-syntax postcss-scss
```

## Release Process

(For maintainers only)

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag
4. Push to GitHub
5. Publish to npm

```bash
npm version patch  # or minor, or major
git push --follow-tags
npm publish
```

## Getting Help

- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers directly for sensitive issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- CHANGELOG.md for significant contributions
- README.md for major features

Thank you for contributing! 🎉
