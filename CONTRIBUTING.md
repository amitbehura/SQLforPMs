# Contributing to SQLfor PMs

Welcome! We're excited that you want to contribute. This project aims to help Product Managers master SQL through a fun, interactive office simulation.

## How to Contribute

1.  **Fork and Clone**: Fork the repository and clone it to your local machine.
2.  **Install Dependencies**: Run `npm install` to get started.
3.  **Create a Branch**: Use a descriptive name for your branch (e.g., `feature/new-level` or `fix/persistence-bug`).
4.  **Make Changes**:
    - Follow the existing coding style (ESLint + TypeScript).
    - Ensure all components are responsive and use the central design system (`src/styles/theme.css`).
5.  **Test Your Changes**:
    - Run `npm run dev` to test locally.
    - Run `npm test` to ensure no regressions.
6.  **Submit a Pull Request**: Provide a clear description of your changes and why they are needed.

## Style Guide

- **TypeScript**: Use strict types where possible. Avoid `any`.
- **Styling**: Use the CSS variables defined in `theme.css`. Prefer class-based styling over inline styles for reusable components.
- **Components**: Keep components focused. Break large components into smaller, more manageable pieces.
- **Icons**: Use `lucide-react` for all iconography.

## Adding New Curriculum

If you want to add new levels or roles, update `src/data/assignments.ts`. Ensure each level has a `teaching` section and exactly 3 `tests`.

## Reporting Issues

Found a bug or have a feature request? Open an issue on GitHub with:
- A clear title.
- Steps to reproduce (for bugs).
- Expected vs. actual behavior.

Thank you for helping make SQL education more accessible for everyone!
