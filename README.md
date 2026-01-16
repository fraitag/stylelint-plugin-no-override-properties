# Stylelint Plugin: No Override Properties

[![npm version](https://img.shields.io/npm/v/stylelint-plugin-no-override-properties.svg)](https://www.npmjs.com/package/stylelint-plugin-no-override-properties)
[![CI](https://github.com/yourusername/stylelint-plugin-no-override-properties/workflows/CI/badge.svg)](https://github.com/yourusername/stylelint-plugin-no-override-properties/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Stylelint plugin that detects CSS property overriding in nested selectors (SCSS/Sass/Less). Helps maintain cleaner, more maintainable stylesheets by catching unintentional property overrides.

## 🎯 Problem

In nested CSS (SCSS/Sass/Less), it's easy to accidentally override properties from parent selectors, leading to:
- Confusing code where properties are set but immediately overridden
- Unexpected styling behavior
- Maintenance difficulties

### Example Problem:

```scss
.readMoreButton {
    margin-right: 20px;  // ❌ This will be overridden!
    padding: 6px 18px;

    &Desktop {
        margin: 0;  // ❌ Overrides margin-right from parent
        padding: 8px 16px;  // ❌ Overrides padding from parent
    }
}
```

This plugin detects these overrides and reports them so you can fix them:

```scss
.readMoreButton {
    padding: 6px 18px;

    &Desktop {
        margin: 0;  // ✅ No conflict - margin wasn't set in parent
        padding: 8px 16px;  // ⚠️ Warning: overrides parent padding
    }
}
```

## 📦 Installation

```bash
npm install stylelint-plugin-no-override-properties --save-dev
```

## 🚀 Usage

### Basic Configuration

Add the plugin to your `.stylelintrc.json`:

```json
{
  "plugins": ["stylelint-plugin-no-override-properties"],
  "rules": {
    "plugin/no-overriding-properties": true
  }
}
```

### With Severity Levels

```json
{
  "plugins": ["stylelint-plugin-no-override-properties"],
  "rules": {
    "plugin/no-overriding-properties": [true, { "severity": "warning" }]
  }
}
```

### Running Stylelint

```bash
# Lint SCSS files
npx stylelint "src/**/*.scss" --custom-syntax postcss-scss

# Lint with autofix (for other rules)
npx stylelint "src/**/*.scss" --fix --custom-syntax postcss-scss

# Lint Sass files
npx stylelint "src/**/*.sass" --custom-syntax postcss-sass

# Lint Less files
npx stylelint "src/**/*.less" --custom-syntax postcss-less
```

## 🔍 What It Detects

### 1. Exact Property Overrides

```scss
.parent {
    color: red;
    
    &-child {
        color: blue;  // ⚠️ Warning: overrides parent color
    }
}
```

### 2. Shorthand Overriding Longhand

```scss
.element {
    margin-right: 20px;
    margin-bottom: 10px;
    
    &-child {
        margin: 0;  // ⚠️ Warning: overrides margin-right and margin-bottom
    }
}
```

### 3. Longhand Within Shorthand

```scss
.box {
    padding: 10px;
    
    &-inner {
        padding-left: 20px;  // ⚠️ Warning: padding-left is part of parent's padding shorthand
    }
}
```

### 4. Complex Shorthands (border, background, font, flex)

```scss
.card {
    border-top-color: red;
    border-top-width: 2px;
    
    &--highlighted {
        border-top: 1px solid blue;  // ⚠️ Warning: overrides border-top-color and border-top-width
    }
}
```

## ✅ What It Ignores

The plugin **does not** report warnings for:

### Pseudo-classes (Intentional State Changes)
```scss
.button {
    background: blue;
    
    &:hover {
        background: darkblue;  // ✅ OK - hover state is intentional
    }
    
    &:focus {
        background: navy;  // ✅ OK - focus state is intentional
    }
}
```

### Pseudo-elements
```scss
.icon {
    color: black;
    
    &::before {
        color: gray;  // ✅ OK - pseudo-element styling is separate
    }
}
```

### Attribute Selectors
```scss
.input {
    background: white;
    
    &[disabled] {
        background: gray;  // ✅ OK - disabled state is intentional
    }
}
```

## 📋 Supported Shorthand Properties

The plugin understands these CSS shorthands:

| Shorthand | Longhand Properties |
|-----------|-------------------|
| `margin` | `margin-top`, `margin-right`, `margin-bottom`, `margin-left` |
| `padding` | `padding-top`, `padding-right`, `padding-bottom`, `padding-left` |
| `border` | `border-width`, `border-style`, `border-color`, `border-top`, `border-right`, `border-bottom`, `border-left` |
| `border-width` | `border-top-width`, `border-right-width`, `border-bottom-width`, `border-left-width` |
| `border-style` | `border-top-style`, `border-right-style`, `border-bottom-style`, `border-left-style` |
| `border-color` | `border-top-color`, `border-right-color`, `border-bottom-color`, `border-left-color` |
| `border-top` | `border-top-width`, `border-top-style`, `border-top-color` |
| `border-right` | `border-right-width`, `border-right-style`, `border-right-color` |
| `border-bottom` | `border-bottom-width`, `border-bottom-style`, `border-bottom-color` |
| `border-left` | `border-left-width`, `border-left-style`, `border-left-color` |
| `border-radius` | `border-top-left-radius`, `border-top-right-radius`, `border-bottom-right-radius`, `border-bottom-left-radius` |
| `background` | `background-color`, `background-image`, `background-position`, `background-size`, `background-repeat`, `background-origin`, `background-clip`, `background-attachment` |
| `font` | `font-style`, `font-variant`, `font-weight`, `font-size`, `line-height`, `font-family` |
| `flex` | `flex-grow`, `flex-shrink`, `flex-basis` |
| `flex-flow` | `flex-direction`, `flex-wrap` |

## 🛠️ Integration Examples

### Webpack

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('stylelint')({
                    config: {
                      plugins: ['stylelint-plugin-no-override-properties'],
                      rules: {
                        'plugin/no-overriding-properties': true
                      }
                    }
                  })
                ]
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
};
```

### VS Code

Install the [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) and configure:

```json
// .vscode/settings.json
{
  "stylelint.validate": ["css", "scss", "sass", "less"],
  "stylelint.customSyntax": "postcss-scss"
}
```

### GitHub Actions

```yaml
# .github/workflows/lint.yml
name: Lint

on: [push, pull_request]

jobs:
  stylelint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx stylelint "src/**/*.scss" --custom-syntax postcss-scss
```

### Pre-commit Hook (Husky + lint-staged)

```json
// package.json
{
  "lint-staged": {
    "*.scss": "stylelint --custom-syntax postcss-scss"
  }
}
```

```bash
# Install
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

## 📊 Example Output

```
src/components/button.scss
 8:9  ✖  Property "margin-right" from ".readMoreButton" is     plugin/no-overriding-properties
         overridden by "margin" in nested selector 
         ".readMoreButton&Desktop"
 12:9 ✖  Property "padding" from ".readMoreButton" is          plugin/no-overriding-properties
         overridden by "padding" in nested selector 
         ".readMoreButton&Desktop"
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development

```bash
# Clone repository
git clone https://github.com/yourusername/stylelint-plugin-no-override-properties.git
cd stylelint-plugin-no-override-properties

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📄 License

MIT © Krzysztof Piątek

## 🙏 Acknowledgments

- Built with [Stylelint](https://stylelint.io/)
- Tested with [Jest](https://jestjs.io/)
- Uses [PostCSS](https://postcss.org/) for CSS parsing

## 📝 Changelog

### 1.0.0
- Initial release
- Support for exact property override detection
- Support for shorthand/longhand property detection
- Auto-ignore pseudo-classes, pseudo-elements, and attribute selectors
- Support for SCSS, Sass, and Less syntaxes

## 🐛 Issues & Support

- [Report bugs](https://github.com/yourusername/stylelint-plugin-no-override-properties/issues)
- [Request features](https://github.com/yourusername/stylelint-plugin-no-override-properties/issues)
- [Ask questions](https://github.com/yourusername/stylelint-plugin-no-override-properties/discussions)
