import stylelint from 'stylelint';

const ruleName = 'plugin/no-overriding-properties';
const messages = stylelint.utils.ruleMessages(ruleName, {
  overriddenProperty: (property, parentProperty, parentSelector, childSelector) =>
    `Property "${property}" from "${parentSelector}" is overridden by "${parentProperty}" in nested selector "${childSelector}"`,
});

const meta = {
  url: 'https://github.com/fraitag/stylelint-plugin-no-override-properties',
};

/**
 * Shorthand properties and their longhand equivalents
 */
const shorthandMap = {
  'margin': ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  'padding': ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  'border': ['border-width', 'border-style', 'border-color', 'border-top', 'border-right', 'border-bottom', 'border-left'],
  'border-width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
  'border-style': ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
  'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'border-top': ['border-top-width', 'border-top-style', 'border-top-color'],
  'border-right': ['border-right-width', 'border-right-style', 'border-right-color'],
  'border-bottom': ['border-bottom-width', 'border-bottom-style', 'border-bottom-color'],
  'border-left': ['border-left-width', 'border-left-style', 'border-left-color'],
  'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
  'background': ['background-color', 'background-image', 'background-position', 'background-size', 'background-repeat', 'background-origin', 'background-clip', 'background-attachment'],
  'font': ['font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family'],
  'flex': ['flex-grow', 'flex-shrink', 'flex-basis'],
  'flex-flow': ['flex-direction', 'flex-wrap'],
};

/**
 * Checks if a shorthand property would override a longhand property
 * @param {string} shorthand - Shorthand property name
 * @param {string} longhand - Longhand property name
 * @returns {boolean} True if shorthand overrides longhand
 */
function shorthandOverridesLonghand(shorthand, longhand) {
  const longhands = shorthandMap[shorthand];
  return longhands && longhands.includes(longhand);
}

/**
 * Extracts property declarations from a rule
 * @param {Object} rule - PostCSS rule node
 * @returns {Map} Map of property names to their nodes
 */
function extractProperties(rule) {
  const properties = new Map();
  
  rule.walkDecls((decl) => {
    // Skip if declaration is inside nested rule
    if (decl.parent !== rule) return;
    
    properties.set(decl.prop, {
      node: decl,
      value: decl.value,
    });
  });
  
  return properties;
}

/**
 * Gets the full selector path for better error messages
 * @param {Object} rule - PostCSS rule node
 * @returns {string} Full selector path
 */
function getFullSelector(rule) {
  const selectors = [];
  let current = rule;
  
  while (current && current.type === 'rule') {
    selectors.unshift(current.selector);
    current = current.parent;
  }
  
  return selectors.join(' ');
}

/**
 * Checks if child selector is a pseudo-class, pseudo-element, or attribute selector
 * These are typically intentional overrides and should be ignored
 * @param {string} selector - Child selector
 * @returns {boolean} True if selector should be ignored
 */
function shouldIgnoreSelector(selector) {
  // Ignore pseudo-classes (:hover, :focus, etc.)
  if (selector.includes(':') && !selector.includes('::')) return true;
  
  // Ignore pseudo-elements (::before, ::after, etc.)
  if (selector.includes('::')) return true;
  
  // Ignore attribute selectors ([attr], [attr="value"])
  if (selector.includes('[') && selector.includes(']')) return true;
  
  return false;
}

function ruleFunction(primaryOption) {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [true, false],
    });

    if (!validOptions || !primaryOption) {
      return;
    }

    root.walkRules((parentRule) => {
      const parentProperties = extractProperties(parentRule);
      
      if (parentProperties.size === 0) {
        return;
      }

      const parentSelector = getFullSelector(parentRule);

      // Walk through all child rules at any nesting level
      parentRule.each((node) => {
        if (node.type !== 'rule') {
          return;
        }

        const childRule = node;
        const childSelector = childRule.selector;
        
        // Skip pseudo-classes, pseudo-elements, and attribute selectors
        if (shouldIgnoreSelector(childSelector)) {
          return;
        }

        const childProperties = extractProperties(childRule);

        // Check for property overrides
        childProperties.forEach((childPropData, childProp) => {
          // Check for exact match
          if (parentProperties.has(childProp)) {
            stylelint.utils.report({
              message: messages.overriddenProperty(
                childProp,
                childProp,
                parentSelector,
                `${parentSelector}${childSelector}`
              ),
              node: childPropData.node,
              result,
              ruleName,
            });
            return;
          }
          
          // Check if child property is a shorthand that overrides parent longhand
          parentProperties.forEach((parentPropData, parentProp) => {
            if (shorthandOverridesLonghand(childProp, parentProp)) {
              stylelint.utils.report({
                message: messages.overriddenProperty(
                  parentProp,
                  childProp,
                  parentSelector,
                  `${parentSelector}${childSelector}`
                ),
                node: childPropData.node,
                result,
                ruleName,
              });
            }
          });
        });
      });
    });
  };
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

const plugin = stylelint.createPlugin(ruleName, ruleFunction);

export default plugin;
