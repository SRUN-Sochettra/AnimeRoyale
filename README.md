# 🥚 AnimeRoyale

AnimeRoyale is a web application that scans and rates your anime, manga, and light novel tracking statistics from **AniList** or **MyAnimeList** through the eyes of the "Egg Court". It calculates a custom **Battle Score**, assigns an **Egg Tier**, and uses advanced AI to deliver brutally honest roasts, hype commentary, or full-blown 1v1 battles between profiles.

---

## 🚀 Key Features

*   **Solo Profile Inspection:** Get a brutally honest, yolk-filled legal verdict on your media tracking habits. It details your stats, gives you an Egg Score (0–100), and assigns a custom rank (e.g., *Hard-Boiled Manga Goblin* or *Omni-Weeb Egg Ascended*).
*   **1v1 Battle Mode 🥊:** Pit two usernames against each other in the AnimeRoyale arena. An AI-powered aggressive fighting game announcer declares a winner or an egg-stained tie, roasting the loser and hyping the winner with specific stats-based feedback.
*   **Cross-Media Support:** Choose from four media scopes:
    *   **Anime:** Track episodes watched and total watch-time damage.
    *   **Manga:** Analyze chapters read and volumes turned.
    *   **Novels:** Deep-dive into light novel chapters read.
    *   **Combined:** Aggregate all your stats across all media types with smart weighted metrics.
*   **Double Platform Integration:** Fully supports profiles from **AniList** (via direct GraphQL endpoints) and **MyAnimeList** (via Jikan API v4).
*   **AI-Powered Roasts & Hype:** Leverages Groq's `llama-3.3-70b-versatile` model to write highly engaging, context-aware commentary tailored to user stats.

---

## 🛠️ Tech Stack

*   **Frontend:** [React](https://react.dev/) + [Vite](https://vite.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Serverless/API:** [Vercel Serverless Functions](https://vercel.com/docs/functions)
*   **AI Integration:** [Groq API](https://groq.com/) (running Llama-3.3-70b)
*   **Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (for display headers) & [Inter](https://fonts.google.com/specimen/Inter) (for content)

---

## 📁 Code Structure

*   `api/`
    *   [roast.js](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/api/roast.js): The Vercel serverless function handling the AI prompts, context construction, and commentary generation.
*   `src/`
    *   `components/`: Reusable global UI elements like the navbar, logo animations, and icons.
    *   `features/animeRoyale/`: Core application feature code.
        *   `components/`: Sub-components for forms, statistics displays, loader animations, and result views.
        *   [AnimeRoyalePage.jsx](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/src/features/animeRoyale/AnimeRoyalePage.jsx): The main controller component.
    *   `lib/`
        *   [animeApi.js](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/src/lib/animeApi.js): Normalizes raw API responses from AniList & MyAnimeList and calculates ratings.
        *   [battle.js](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/src/lib/battle.js): Logic for determining winners, fallback offline roasts, and calling the AI serverless endpoint.
        *   [eggTiers.js](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/src/lib/eggTiers.js): Configuration for tier boundaries and weeb rating labels.

---

## 💻 Local Setup & Development

Follow these steps to run AnimeRoyale locally on your machine:

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### 2. Clone and Install Dependencies

```bash
cd animeroyale
npm install
```

### 3. Environment Variables Setup

AnimeRoyale requires a Groq API Key to power the AI commentary.
1. Copy the `.env.example` file to `.env` or `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and replace `gsk_your_key_here` with your actual Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_goes_here
   ```

### 4. Running the Development Servers

For the local React frontend *only*:
```bash
npm run dev
```
By default, the Vite dev server runs on `http://localhost:5173`. 

> [!NOTE]
> Since the project uses a Vercel Serverless Function under `api/roast.js` to communicate with Groq, running only the Vite development server will cause API requests to fail (as it doesn't run the backend functions).

To run **both** the frontend and serverless API endpoints locally:
1. Install the Vercel CLI globally (if you haven't already):
   ```bash
   npm install -g vercel
   ```
2. Start the development server using the Vercel CLI wrapper:
   ```bash
   npm run vercel-dev
   ```
This will run the serverless backend function environment alongside Vite on `http://localhost:3000`.

### 5. Production Build

To build the static application assets:
```bash
npm run build
```

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](file:///d:/Users/ROG/Documents/School_Projects/Vibe/animeroyale/LICENSE) file for more information.
