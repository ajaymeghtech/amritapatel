# Assets Folder

This folder contains all static assets used in the frontend.

## Structure

```
assets/
├── images/      # Image files (jpg, png, svg, webp, etc.)
├── fonts/       # Font files (woff, woff2, ttf, etc.)
├── icons/       # Icon files (svg, png, etc.)
└── README.md    # This file
```

## Usage

### Images
Place all image assets in the `images/` folder. Use Next.js Image component for optimized images:

```jsx
import Image from 'next/image';
import logo from '@/app/assets/images/logo.png';

<Image src={logo} alt="Logo" width={200} height={50} />
```

### Fonts
Place font files in the `fonts/` folder and import them in your SCSS:

```scss
@font-face {
  font-family: 'CustomFont';
  src: url('../assets/fonts/custom-font.woff2') format('woff2');
}
```

### Icons
Place icon files in the `icons/` folder. You can use SVG files directly or import them as components.

## Best Practices

1. Optimize images before adding them to the project
2. Use appropriate formats (WebP for photos, SVG for icons)
3. Keep file names descriptive and lowercase with hyphens
4. Organize files by category or feature when the folder grows large

