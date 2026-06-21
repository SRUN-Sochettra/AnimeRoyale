# Contributing to AnimeRoyale

Thank you for your interest in contributing to AnimeRoyale! Community contributions help make this project a more entertaining and useful tool for weeb analytics.

Please review these guidelines to make the contribution process smooth and effective.

---

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [maintainers@example.com](mailto:maintainers@example.com).

---

## 🐛 How to Report Bugs & Suggest Features

*   **Check Existing Issues:** Before opening a new issue, search the issue tracker to see if the bug or feature has already been reported.
*   **Bug Reports:** When opening an issue, provide clear reproduction steps, screenshots if applicable, and details about your environment (browser, OS).
*   **Feature Suggestions:** Describe the feature's goal, how it fits into the "Egg Court" rating ecosystem, and any suggestions for the user interface.

---

## 🛠️ Local Development Setup

To set up a local workspace for developing AnimeRoyale:

1.  **Fork & Clone:** Fork the repository on GitHub and clone it locally.
2.  **Dependencies:** Install dependencies via Node Package Manager:
    ```bash
    npm install
    ```
3.  **Environment Setup:** Create a `.env.local` file by copying `.env.example`:
    ```bash
    cp .env.example .env.local
    ```
    Populate `GROQ_API_KEY` with a valid API key from Groq Console.
4.  **Run Development Servers:**
    *   To edit frontend layout only, use Vite's dev server:
        ```bash
        npm run dev
        ```
    *   To work with AI roasts or battles, use Vercel CLI to spin up serverless API functions locally:
        ```bash
        vercel dev
        ```

---

## 🎨 Coding & Style Guidelines

### 1. JavaScript & React
*   Write modular components. Keep components inside [src/features/animeRoyale/components/](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/src/features/animeRoyale/components) specific and reusable.
*   Utilize hooks for state management and functional updates.
*   Follow clean coding practices. Do not leave debug statements, console logs, or commented-out blocks in production code.

### 2. Styling (Tailwind CSS)
*   Avoid arbitrary inline CSS values in components where utility classes exist.
*   Keep colors consistent with the established warm weeb-brown theme (e.g., `text-brown-700`, `fill-[#FCE9B8]`).
*   Ensure all interface designs feel premium, highly interactive, and responsive.

### 3. Verification & Linting
Ensure your code is free of linting errors before pushing:
```bash
npm run lint
```
Fix all ESLint warnings and errors prior to submitting a Pull Request.

---

## 🚀 Pull Request Workflow

1.  **Branch Naming:** Create a branch off of `main`. Use naming prefixes:
    *   `feature/new-epic-stuff` for features.
    *   `bugfix/broken-egg-tier` for bug fixes.
    *   `docs/update-guide` for documentation.
2.  **Make Atomic Commits:** Keep commits small, descriptive, and focused.
3.  **Submit PR:**
    *   Provide a clear summary of what changed.
    *   Add screenshots or a short GIF if there are UI modifications.
    *   Reference any related issue numbers (e.g., `Closes #12`).
4.  **Review Process:** The maintainers will review your code. Address any requested changes promptly.
