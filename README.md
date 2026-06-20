# Modern Calculator App

A modern calculator web application built with React, TypeScript, and Vite. It adapts automatically to the user's system color scheme with full light and dark mode support.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Color Themes](https://img.shields.io/badge/Color_Themes-Multiple-FF6B6B?style=for-the-badge&logo=palette&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## Features

- Standard calculator operations: addition, subtraction, multiplication, and division
- Automatic light and dark mode driven by the system `prefers-color-scheme` media query — no manual toggle required
- Dark mode default (`#242424` background) with a clean light mode (`#ffffff` background)
- Multiple color theme modes
- Responsive layout
- Fast development experience powered by Vite HMR
- Strict TypeScript and ESLint configuration for code quality

## Tech Stack

| Technology | Version |
|------------|---------|
| React      | 19.1.1  |
| TypeScript | 5.8.3   |
| Vite       | 7.1.2   |
| ESLint     | 9.33.0  |

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
git clone https://github.com/v-testers/modern-calculator-app.git
cd modern-calculator-app
npm install
```

### Development

Start the local development server with hot module replacement:

```bash
npm run dev
```

### Build

Compile and bundle the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint across the source files:

```bash
npm run lint
```

## License

This project is licensed under the [MIT License](LICENSE).
