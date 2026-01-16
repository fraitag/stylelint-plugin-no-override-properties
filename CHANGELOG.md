# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-16

### Added
- Initial release of stylelint-plugin-no-override-properties
- Detection of exact property overrides in nested selectors
- Detection of shorthand properties overriding longhand properties
- Support for the following CSS shorthand properties:
  - `margin`, `padding`
  - `border`, `border-width`, `border-style`, `border-color`
  - `border-top`, `border-right`, `border-bottom`, `border-left`
  - `border-radius`
  - `background`
  - `font`
  - `flex`, `flex-flow`
- Auto-ignore for intentional overrides:
  - Pseudo-classes (`:hover`, `:focus`, `:active`, etc.)
  - Pseudo-elements (`::before`, `::after`, etc.)
  - Attribute selectors (`[disabled]`, `[type="text"]`, etc.)
- Full test suite with 22 test cases
- Comprehensive documentation (README.md, CONTRIBUTING.md)
- MIT License

### Features
- Works with SCSS, Sass, and Less syntaxes via postcss-scss/postcss-sass/postcss-less
- Compatible with Stylelint 14.x, 15.x, and 16.x
- ES Modules (ESM) support
- Zero dependencies (peer dependencies only)

### Developer Experience
- Jest test suite with full coverage
- Clear error messages with full selector paths
- GitHub Actions ready
- Husky + lint-staged compatible
- VS Code integration via Stylelint extension

---

## Future Releases

### [Unreleased]
- Potential additions for future releases:
  - Support for more CSS shorthands (grid, place-items, etc.)
  - Auto-fix capability where applicable
  - Configuration options to customize ignored selectors
  - Performance optimizations for large codebases

---

[1.0.0]: https://github.com/fraitag/stylelint-plugin-no-override-properties/releases/tag/v1.0.0
