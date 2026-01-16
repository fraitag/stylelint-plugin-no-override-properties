import plugin from './stylelint-plugin-no-overriding-properties.js';
import stylelint from 'stylelint';

const config = {
  plugins: [plugin],
  rules: {
    'plugin/no-overriding-properties': true,
  },
};

describe('stylelint-plugin-no-overriding-properties', () => {
  describe('exact property override detection', () => {
    it('should report error when child overrides parent property', async () => {
      const code = `
        .parent {
          color: red;
          &-child {
            color: blue;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].text).toContain('color');
    });

    it('should report error for margin override in real-world example', async () => {
      const code = `
        .readMoreButton {
          border: 1px solid #cecece;
          margin-right: 20px;
          
          &Desktop {
            margin: 0;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].text).toContain('margin-right');
      expect(result.results[0].warnings[0].text).toContain('margin');
    });

    it('should report multiple overrides', async () => {
      const code = `
        .box {
          padding: 10px;
          margin: 20px;
          
          &-inner {
            padding: 5px;
            margin: 10px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(2);
    });
  });

  describe('shorthand property override detection', () => {
    it('should detect shorthand overriding longhand (margin)', async () => {
      const code = `
        .element {
          margin-top: 10px;
          margin-right: 20px;
          
          &-child {
            margin: 0;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings.length).toBeGreaterThanOrEqual(1);
      expect(result.results[0].warnings[0].text).toContain('margin');
    });

    it('should detect shorthand overriding longhand (padding)', async () => {
      const code = `
        .box {
          padding-left: 15px;
          
          &-content {
            padding: 10px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].text).toContain('padding-left');
    });

    it('should detect border shorthand overriding border-top properties', async () => {
      const code = `
        .card {
          border-top-color: red;
          border-top-width: 2px;
          
          &--highlighted {
            border-top: 1px solid blue;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings.length).toBeGreaterThanOrEqual(1);
    });

    it('should detect background shorthand overriding background-color', async () => {
      const code = `
        .header {
          background-color: white;
          
          &--dark {
            background: black;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].text).toContain('background-color');
    });
  });

  describe('ignored selectors (should not report)', () => {
    it('should not report for :hover pseudo-class', async () => {
      const code = `
        .button {
          color: blue;
          
          &:hover {
            color: red;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should not report for :focus pseudo-class', async () => {
      const code = `
        .input {
          border: 1px solid gray;
          
          &:focus {
            border: 2px solid blue;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should not report for ::before pseudo-element', async () => {
      const code = `
        .icon {
          color: black;
          
          &::before {
            color: gray;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should not report for attribute selectors', async () => {
      const code = `
        .button {
          background: blue;
          
          &[disabled] {
            background: gray;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });
  });

  describe('valid cases (should not report)', () => {
    it('should not report when properties do not overlap', async () => {
      const code = `
        .element {
          color: red;
          padding: 10px;
          
          &-child {
            margin: 20px;
            font-size: 14px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should not report for different longhand properties', async () => {
      const code = `
        .box {
          margin-top: 10px;
          
          &-inner {
            margin-bottom: 20px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should not report when parent has no properties', async () => {
      const code = `
        .parent {
          &-child {
            color: blue;
            margin: 10px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });
  });

  describe('nested selectors', () => {
    it('should detect overrides in directly nested selectors with &', async () => {
      const code = `
        .container {
          margin: 20px;
          
          &-wrapper {
            padding: 10px;
            margin: 10px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].text).toContain('margin');
    });

    it('should handle multiple levels of nesting with shorthands and &', async () => {
      const code = `
        .level1 {
          padding-left: 10px;
          
          &-level2 {
            padding: 20px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].text).toContain('padding-left');
    });
  });

  describe('real-world SCSS patterns', () => {
    it('should handle BEM modifier pattern', async () => {
      const code = `
        .button {
          padding: 10px 20px;
          background: blue;
          
          &--large {
            padding: 15px 30px;
          }
          
          &--small {
            font-size: 12px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
      expect(result.results[0].warnings[0].text).toContain('padding');
    });

    it('should handle responsive design pattern', async () => {
      const code = `
        .readMoreButton {
          margin-right: 20px;
          padding: 6px 18px;
          
          &Mobile {
            margin-bottom: 20px;
          }
          
          &Desktop {
            margin: 0;
            padding: 8px 16px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('configuration', () => {
    it('should not report when rule is disabled', async () => {
      const code = `
        .element {
          color: red;
          &-child {
            color: blue;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config: {
          plugins: [plugin],
          rules: {
            'plugin/no-overriding-properties': false,
          },
        },
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty rulesets', async () => {
      const code = `
        .empty {
          &-child {
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(0);
    });

    it('should handle single property in parent and child', async () => {
      const code = `
        .single {
          color: red;
          
          &-child {
            color: blue;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
    });

    it('should handle complex selectors with combinators', async () => {
      const code = `
        .parent {
          margin: 10px;
          
          > .child {
            margin: 20px;
          }
        }
      `;

      const result = await stylelint.lint({
        code,
        config,
        customSyntax: 'postcss-scss',
      });

      expect(result.results[0].warnings).toHaveLength(1);
    });
  });
});
