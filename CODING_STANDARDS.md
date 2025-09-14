# Coding Standards

This document outlines the coding standards and style guidelines for the SkinCare AI project. Following these standards ensures code consistency and quality across the codebase.

## General Guidelines

- Write clean, readable, and maintainable code
- Use meaningful variable, function, and class names
- Keep functions small and focused on a single responsibility
- Add comments for complex logic, but prioritize self-documenting code
- Follow the [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle

## Code Formatting

We use [Prettier](https://prettier.io/) to automatically format our code. The configuration can be found in `.prettierrc` at the root of the project.

Key formatting rules:

- Single quotes for strings
- 2 spaces for indentation
- 100 character line length
- Semicolons at the end of statements
- Trailing commas in objects and arrays

## Linting

We use [ESLint](https://eslint.org/) to catch errors and enforce coding standards. The configuration can be found in `.eslintrc.js` at the root of the project.

To lint your code locally:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

## JavaScript/React Guidelines

- Use ES6+ features when possible
- Prefer `const` over `let`, and avoid using `var`
- Use destructuring where appropriate
- Use functional components with hooks instead of class components
- Keep component files small and focused
- Use PropTypes or TypeScript for type checking
- Follow the React component file structure convention

## CSS/Styling Guidelines

- Use Tailwind CSS classes for styling
- Avoid inline styles when possible
- Follow a mobile-first approach for responsive design
- Use meaningful class names when custom CSS is needed

## Git Workflow

- Write clear, concise commit messages
- Reference issue numbers in commit messages when applicable
- Keep pull requests focused on a single feature or bug fix
- Request code reviews before merging

## Automated Code Quality Checks

A GitHub Action automatically runs on all pull requests and commits to the main branch to ensure code quality:

1. Formats code with Prettier
2. Fixes ESLint issues where possible
3. Commits any changes made during the process

## Additional Resources

- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
