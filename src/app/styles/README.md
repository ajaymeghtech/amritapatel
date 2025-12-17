# Styles Folder

This folder contains all SCSS stylesheets for the frontend.

## Structure

```
styles/
└── scss/
    ├── main.scss              # Main entry point - import this in your components
    ├── _variables.scss         # Global variables (colors, spacing, etc.)
    ├── _mixins.scss            # Reusable mixins
    ├── base/
    │   ├── _reset.scss         # CSS reset styles
    │   └── _typography.scss    # Typography styles
    ├── components/
    │   ├── _buttons.scss       # Button component styles
    │   ├── _cards.scss         # Card component styles
    │   └── _example.module.scss # Example module SCSS
    └── utils/
        └── _utilities.scss      # Utility classes
```

## Usage

### Global Styles
Import the main SCSS file in your layout or page:

```jsx
import '@/app/frontend/styles/scss/main.scss';
```

### SCSS Modules
Use SCSS modules for component-specific styles:

```jsx
import styles from '@/app/frontend/styles/scss/components/_example.module.scss';

<div className={styles.exampleCard}>
  {/* Component content */}
</div>
```

### Using Variables and Mixins
In any SCSS file, you can import variables and mixins:

```scss
@import '../variables';
@import '../mixins';

.my-component {
  color: $primary-color;
  padding: $spacing-md;
  
  @include respond-to(md) {
    padding: $spacing-lg;
  }
}
```

## Best Practices

1. Use variables for colors, spacing, and other repeated values
2. Use mixins for reusable code patterns
3. Keep component styles modular
4. Use utility classes for common styling needs
5. Follow BEM naming convention for classes

