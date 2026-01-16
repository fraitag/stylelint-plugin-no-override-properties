# Example SCSS file demonstrating property override detection

## ✅ Valid - No Overrides

### Different properties in nested selectors
```scss
.button {
    color: blue;
    padding: 10px;
    
    &--large {
        font-size: 18px;  // ✅ Different property
        margin: 20px;     // ✅ Different property
    }
}
```

### Different longhand properties
```scss
.box {
    margin-top: 10px;
    
    &-inner {
        margin-bottom: 20px;  // ✅ Different margin property
    }
}
```

### Pseudo-classes (intentional)
```scss
.link {
    color: blue;
    
    &:hover {
        color: darkblue;  // ✅ Hover state is intentional
    }
    
    &:focus {
        color: navy;  // ✅ Focus state is intentional
    }
}
```

### Pseudo-elements
```scss
.icon {
    color: black;
    
    &::before {
        color: gray;  // ✅ Pseudo-element styling
    }
}
```

---

## ❌ Invalid - Property Overrides Detected

### Exact property override
```scss
.parent {
    color: red;
    
    &-child {
        color: blue;  // ❌ Overrides parent color
    }
}
```

### Shorthand overriding longhand (margin)
```scss
.element {
    margin-right: 20px;
    margin-bottom: 10px;
    
    &-child {
        margin: 0;  // ❌ Overrides margin-right and margin-bottom
    }
}
```

### Shorthand overriding longhand (padding)
```scss
.box {
    padding-left: 15px;
    
    &-inner {
        padding: 10px;  // ❌ Overrides padding-left
    }
}
```

### Border shorthand override
```scss
.card {
    border-top-color: red;
    border-top-width: 2px;
    
    &--highlighted {
        border-top: 1px solid blue;  // ❌ Overrides border-top-color and border-top-width
    }
}
```

### Background shorthand override
```scss
.header {
    background-color: white;
    
    &--dark {
        background: black;  // ❌ Overrides background-color
    }
}
```

### Real-world example: Responsive buttons
```scss
.readMoreButton {
    border: 1px solid #cecece;
    border-radius: 50px;
    color: #000000;
    margin-right: 20px;  // ❌ Will be overridden by &Desktop
    padding: 6px 18px;   // ❌ Will be overridden by &Desktop

    &Mobile {
        align-self: flex-end;
        margin-bottom: 20px;
    }

    &Desktop {
        align-self: flex-end;
        margin: 0;           // ❌ Overrides margin-right
        font-size: 1em;
        padding: 8px 16px;   // ❌ Overrides padding
    }

    &:hover {
        background: #F9F9F9;  // ✅ OK - hover state
    }
}
```

### BEM pattern with overrides
```scss
.button {
    padding: 10px 20px;
    background: blue;
    
    &--large {
        padding: 15px 30px;  // ❌ Overrides padding
    }
    
    &--small {
        font-size: 12px;  // ✅ OK - different property
    }
}
```

---

## 🔧 How to Fix

### Option 1: Remove the parent property
```scss
// Before
.button {
    padding: 10px;
    &--large {
        padding: 15px;  // ❌ Override
    }
}

// After
.button {
    // Remove padding from parent if all children override it
    &--large {
        padding: 15px;  // ✅ No override
    }
}
```

### Option 2: Use more specific longhand properties
```scss
// Before
.element {
    margin: 10px;
    &-child {
        margin-top: 20px;  // ❌ Override
    }
}

// After
.element {
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    
    &-child {
        margin-top: 20px;  // ✅ No conflict
    }
}
```

### Option 3: Restructure your selectors
```scss
// Before
.button {
    padding: 10px;
    
    &--large {
        padding: 15px;  // ❌ Override
    }
    
    &--small {
        padding: 5px;   // ❌ Override
    }
}

// After - Define base, then modify
.button {
    // Common properties only
    
    &--default {
        padding: 10px;
    }
    
    &--large {
        padding: 15px;  // ✅ No override
    }
    
    &--small {
        padding: 5px;   // ✅ No override
    }
}
```
