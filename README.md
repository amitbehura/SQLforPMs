# SQLfor PMs 🚀

An interactive, gamified SQL learning experience designed specifically for Product Managers. Built with React, TypeScript, Vite, and PGlite.

## 🌟 Features

- **Role-Based Curriculum**: Choose between Analyst, PM, or Stakeholder paths.
- **Interactive Office Game**: Walk around the "PayPaySQL Headquarters" to start your mission.
- **Real SQL Sandbox**: Execute queries against an in-browser PostgreSQL database (PGlite).
- **SQL Survival Guide**: A persistent reference book to help you with syntax and common patterns.
- **Progress Persistence**: Your level and role are saved locally in your browser.
- **Modern Dark Theme**: A premium developer-focused aesthetic.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PGlite](https://pglite.dev/) (Postgres in WASM)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Editor**: [CodeMirror](https://codemirror.net/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/SQLforPMs.git
cd SQLforPMs
npm install
```

### Running Locally

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
```
The static files will be generated in the `dist` directory, ready to be hosted on Vercel, Netlify, or GitHub Pages.

## 🧪 Testing

We use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

```bash
npm test
```

## 📂 Project Structure

- `src/components`: UI components (Workspace, Editor, Game, etc.)
- `src/data`: Curriculum assignments and seed data.
- `src/lib`: Core logic (database, state store, persistence).
- `src/styles`: Central design system and theme variables.

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License.
