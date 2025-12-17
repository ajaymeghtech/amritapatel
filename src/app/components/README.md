# Components Folder

This folder contains all React components used in the frontend.

## Structure

```
components/
├── ExampleComponent.jsx  # Example component demonstrating SCSS usage
└── README.md             # This file
```

## Usage

### Importing Components

```jsx
import ExampleComponent from '@/app/components/ExampleComponent';

function MyPage() {
  return (
    <ExampleComponent title="My Title">
      Component content here
    </ExampleComponent>
  );
}
```

### Component Structure

Each component should follow this structure:

```jsx
'use client'; // Add if component uses client-side features

import React from 'react';
import styles from '../styles/scss/components/_component-name.module.scss';

/**
 * ComponentName
 * 
 * Description of what the component does.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 */
const ComponentName = ({ title, children }) => {
  return (
    <div className={styles.componentWrapper}>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

## Best Practices

1. Keep components focused and reusable
2. Use TypeScript or PropTypes for prop validation
3. Use SCSS modules for component-specific styles
4. Write clear, descriptive component names
5. Add JSDoc comments for documentation
6. Extract logic into custom hooks when needed
7. Use composition over inheritance

## File Naming

- Use PascalCase for component files: `MyComponent.jsx`
- Use kebab-case for SCSS modules: `_my-component.module.scss`

