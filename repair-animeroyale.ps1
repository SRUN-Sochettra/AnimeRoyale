function Write-AppFile {
  param (
    [string]$Path,
    [string -Force -Path $Dir | Out-Null    [string]$Content
  }

  Set-Content -Path $Path -Value $Content -Encoding UTF8
}

Write-AppFile "index.html" @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AnimeRoyale — two weebs enter, one egg survives." />
    <title>AnimeRoyale</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@

Write-AppFile "tailwind.config.js" @'
/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        cream: "#FFF8EC",
        butter: "#FCE9B8",
        yolk: "#F5B544",
        shell: "#F4E4C1",
        brown: {
          50: "#FAF3E3",
          100: "#F0E3C4",
          200: "#D9BF8A",
          300: "#B89968",
          400: "#8B6F47",
          500: "#6B5436",
          600: "#4A3A25",
          700: "#2E2416"
        },
        crack: "#C84A2E"
      },
      boxShadow: {
        egg: "0 6px 0 -2px #2E2416",
        eggsm: "0 4px 0 -1px #2E2416",
        soft: "0 4px 20px rgba(74, 58, 37, 0.08)"
      },
      animation: {
        wobble: "wobble 1.2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        pop: "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
      },
      keyframes: {
        wobble: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" }
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
'@

Write-AppFile "src/App.jsx" @'
import AnimeRoyalePage from "./features/animeRoyale/AnimeRoyalePage";

export default function App() {
  return <AnimeRoyalePage />;
}
'@

Write-AppFile "src/features/animeRoyale/constants.js" @'
export const PLATFORM_OPTIONS = [
  {
    id: "anilist",
    label: "AniList",
    helper: "GraphQL stats. Public profile required."
  },
  {
    id: "mal",
    label: "MyAnimeList",
    helper: "Jikan-powered public MAL stats."
  }
];

export const MODE_OPTIONS = [
  {
    id: "solo",
    label: "Solo Inspection",
    helper: "One weeb. One egg court verdict."
  },
  {
    id: "battle",
    label: "1v1 Royale",
    helper: "Two weebs enter. One egg survives."
  }
];

export const EXAMPLE_USERS = {
  anilist: ["SRUN-Sochettra", "SomChanrah"],
  mal: ["Luna", "Rin"]
};
'@

Write-AppFile "src/components/Navbar.jsx" @'
import { IconBrokenEgg } from "./Icons";

export default function Navbar() {
  function goHome() {
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-brown-300 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={goHome}
          className="focus-egg flex items-center gap-2 rounded-xl"
          aria-label="Go to EggScan home"
        >
          <IconBrokenEgg size={25} />
          <span className="font-display text-xl font-black text-brown-700">
            EggScan
          </span>
        </button>

        <div className="hide-scrollbar flex items-center gap-5 overflow-x-auto pl-4 text-sm font-bold text-brown-500">
          <span className="whitespace-nowrap border-b-2 border-brown-700 py-5 text-brown-700">
            AnimeRoyale
          </span>
          <span className="whitespace-nowrap py-5 opacity-70">
            Egg Universe
          </span>
        </div>
      </div>
    </nav>
  );
}
'@

Write-AppFile "src/components/EggLogo.jsx" @'
export default function EggLogo({ size = 80, animated = false }) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 90 104"
      aria-hidden="true"
      className={animated ? "animate-wobble" : undefined}
    >
      <ellipse
        cx="45"
        cy="54"
        rx="31"
        ry="41"
        fill="#FCE9B8"
        stroke="#2E2416"
        strokeWidth="4"
      />
      <path
        d="M28 50L36 58L45 47L54 59L63 49"
        fill="none"
        stroke="#C84A2E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="38" r="2" fill="#B89968" />
      <circle cx="56" cy="42" r="1.8" fill="#B89968" />
      <circle cx="49" cy="72" r="2" fill="#B89968" />
    </svg>
  );
}
'@

Write-AppFile "src/components/FloatingEgg.jsx" @'
export default function FloatingEgg({ className, size, delay, opacity }) {
  return (
    <div className={className} style={{ opacity }}>
      <svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 80 96"
        className="animate-float"
        style={{ animationDelay: `${delay}s` }}
        aria-hidden="true"
      >
        <ellipse
          cx="40"
          cy="52"
          rx="28"
          ry="36"
          fill="#FCE9B8"
          stroke="#2E2416"
          strokeWidth="3"
        />
        <circle cx="28" cy="42" r="1.5" fill="#B89968" />
        <circle cx="50" cy="46" r="1.2" fill="#B89968" />
        <circle cx="44" cy="68" r="1.5" fill="#B89968" />
      </svg>
    </div>
  );
}
'@

Write-AppFile "src/components/Icons.jsx" @'
export function IconBrokenEgg({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M32 5C19 5 10 23 10 39C10 52 19 60 32 60C45 60 54 52 54 39C54 23 45 5 32 5Z"
        fill="#FCE9B8"
        stroke="#2E2416"
        strokeWidth="4"
      />
      <path
        d="M18 31L25 38L32 28L39 40L47 30"
        stroke="#C84A2E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMagnifier({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconSparkle({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L14.7 8.3L21 11L14.7 13.7L12 20L9.3 13.7L3 11L9.3 8.3L12 2Z"
        fill="#F5B544"
        stroke="#2E2416"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMegaphone({ size = 23 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 13H7L17 18V6L7 11H4V13Z"
        fill="#F5B544"
        stroke="#2E2416"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M7 13L8.5 20" stroke="#2E2416" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 9C21 10 21 14 20 15" stroke="#2E2416" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconChart({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19V11" stroke="#2E2416" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 19V5" stroke="#2E2416" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19 19V8" stroke="#2E2416" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
'@

Write-AppFile "src/features/animeRoyale/AnimeRoyalePage.jsx" @'
import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import FloatingEgg from "../../components/FloatingEgg";
import EggLogo from "../../components/EggLogo";
import AnimeRoyaleForm from "./components/AnimeRoyaleForm";
import Loader from "./components/Loader";
import ErrorCard from "./components/ErrorCard";
import ResultView from "./components/ResultView";
import { fetchUserStats } from "../../lib/animeApi";
import {
  buildFallbackRoast,
  buildFallbackSoloRoast,
  generateBattleCommentary,
  generateSoloCommentary,
  getWinner
} from "../../lib/battle";
import { EXAMPLE_USERS } from "./constants";

export default function AnimeRoyalePage() {
  const [mode, setMode] = useState("solo");
  const [platform, setPlatform] = useState("anilist");
  const [usernameOne, setUsernameOne] = useState("");
  const [usernameTwo, setUsernameTwo] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  const loading = status === "loading";

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (!usernameOne.trim()) return false;
    if (mode === "battle" && !usernameTwo.trim()) return false;
    return true;
  }, [loading, mode, usernameOne, usernameTwo]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setError("");
    setResult(null);
    setCopyStatus("");

    try {
      if (mode === "solo") {
        await runSoloMode();
      } else {
        await runBattleMode();
      }
      setStatus("success");
    } catch (err) {
      setError(
        err?.message ||
          "The egg court failed to fetch that profile. Check the username and public stats."
      );
      setStatus("error");
    }
  }

  async function runSoloMode() {
    const player = await fetchUserStats(platform, usernameOne);
    let commentary;

    try {
      commentary = await generateSoloCommentary({ platform, player });
    } catch {
      commentary = buildFallbackSoloRoast(player);
    }

    setResult({ type: "solo", platform, player, commentary });
  }

  async function runBattleMode() {
    const [playerOne, playerTwo] = await Promise.all([
      fetchUserStats(platform, usernameOne),
      fetchUserStats(platform, usernameTwo)
    ]);

    const winner = getWinner(playerOne, playerTwo);
    let commentary;

    try {
      commentary = await generateBattleCommentary({
        platform,
        playerOne,
        playerTwo,
        winner
      });
    } catch {
      commentary = buildFallbackRoast(playerOne, playerTwo, winner);
    }

    setResult({
      type: "battle",
      platform,
      playerOne,
      playerTwo,
      winner,
      commentary
    });
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setError("");
    setResult(null);
    setCopyStatus("");

    if (nextMode === "solo") {
      setUsernameTwo("");
    }
  }

  function handlePlatformChange(nextPlatform) {
    setPlatform(nextPlatform);
    setError("");
    setResult(null);
    setCopyStatus("");
  }

  function fillExamples() {
    const examples = EXAMPLE_USERS[platform] || ["", ""];
    setUsernameOne(examples[0]);
    setUsernameTwo(mode === "battle" ? examples[1] : "");
  }

  async function copyResult() {
    if (!result) return;

    const title =
      result.type === "solo"
        ? `🥚 AnimeRoyale Solo Inspection: ${result.player.username}`
        : `🥚 AnimeRoyale Battle: ${result.playerOne.username} vs ${result.playerTwo.username}`;

    const text = [
      title,
      "",
      result.commentary,
      "",
      "AnimeRoyale — two weebs enter. one egg survives."
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied.");
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch {
      setCopyStatus("Copy failed.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      <FloatingEgg className="pointer-events-none fixed left-8 top-24 hidden md:block" size={62} delay={0} opacity={0.32} />
      <FloatingEgg className="pointer-events-none fixed bottom-28 right-10 hidden md:block" size={52} delay={1} opacity={0.28} />
      <FloatingEgg className="pointer-events-none fixed right-24 top-1/2 hidden lg:block" size={42} delay={2} opacity={0.22} />
      <FloatingEgg className="pointer-events-none fixed bottom-20 left-20 hidden lg:block" size={38} delay={1.5} opacity={0.24} />

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Hero />

        <AnimeRoyaleForm
          mode={mode}
          platform={platform}
          usernameOne={usernameOne}
          usernameTwo={usernameTwo}
          loading={loading}
          canSubmit={canSubmit}
          error={error}
          onModeChange={handleModeChange}
          onPlatformChange={handlePlatformChange}
          onUsernameOneChange={setUsernameOne}
          onUsernameTwoChange={setUsernameTwo}
          onSubmit={handleSubmit}
          onFillExamples={fillExamples}
        />

        {loading ? <Loader mode={mode} /> : null}

        {!loading && !result && !error ? (
          <p className="mt-6 text-center text-sm italic text-brown-400">
            warning: brutally yolk-honest
          </p>
        ) : null}

        {error ? <ErrorCard error={error} /> : null}

        {result ? (
          <ResultView result={result} copyStatus={copyStatus} onCopy={copyResult} />
        ) : null}

        <footer className="pb-4 pt-16 text-center text-xs text-brown-400">
          made with love · judged with eggs · anime damage certified
        </footer>
      </div>
    </main>
  );
}

function Hero() {
  return (
    <header className="mb-9 text-center">
      <div className="mb-4 flex justify-center">
        <EggLogo size={84} animated />
      </div>

      <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-brown-400">
        EggScan Universe
      </p>

      <h1 className="font-display text-5xl font-black tracking-tight text-brown-700 sm:text-6xl">
        AnimeRoyale
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-lg font-semibold leading-relaxed text-brown-500">
        Real anime stats, transformed into public egg judgment.
        <br />
        <span className="text-brown-400">
          Solo inspection or 1v1 weeb battle.
        </span>
      </p>
    </header>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/AnimeRoyaleForm.jsx" @'
import { IconMagnifier } from "../../../components/Icons";
import { MODE_OPTIONS, PLATFORM_OPTIONS } from "../constants";
import ChoiceGroup from "./ChoiceGroup";
import UsernameInput from "./UsernameInput";

export default function AnimeRoyaleForm({
  mode,
  platform,
  usernameOne,
  usernameTwo,
  loading,
  canSubmit,
  error,
  onModeChange,
  onPlatformChange,
  onUsernameOneChange,
  onUsernameTwoChange,
  onSubmit,
  onFillExamples
}) {
  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6">
      <fieldset disabled={loading} className="space-y-6">
        <legend className="sr-only">AnimeRoyale scan controls</legend>

        <ChoiceGroup label="Judgement type" options={MODE_OPTIONS} value={mode} onChange={onModeChange} name="mode" />
        <ChoiceGroup label="Anime platform" options={PLATFORM_OPTIONS} value={platform} onChange={onPlatformChange} name="platform" />

        <div className="space-y-3">
          <UsernameInput
            id="username-one"
            label={mode === "solo" ? "Username" : "Challenger one"}
            value={usernameOne}
            onChange={onUsernameOneChange}
            placeholder={platform === "anilist" ? "anilist-username" : "mal-username"}
            autoFocus
          />

          {mode === "battle" ? (
            <UsernameInput
              id="username-two"
              label="Challenger two"
              value={usernameTwo}
              onChange={onUsernameTwoChange}
              placeholder={platform === "anilist" ? "rival-anilist" : "rival-mal"}
            />
          ) : null}
        </div>

        {error ? (
          <p className="rounded-2xl border-2 border-brown-700 bg-[#F8D5C8] px-4 py-3 text-sm font-bold text-brown-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={!canSubmit}
            title={canSubmit ? "Start AnimeRoyale judgement" : "Enter the required username first"}
            className="btn-primary focus-egg flex flex-1 items-center justify-center gap-2"
          >
            <IconMagnifier size={20} />
            {loading ? "Cracking…" : mode === "solo" ? "Inspect weeb" : "Start battle"}
          </button>

          <button type="button" onClick={onFillExamples} disabled={loading} className="btn-secondary focus-egg">
            Fill demo
          </button>
        </div>
      </fieldset>
    </form>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/ChoiceGroup.jsx" @'
export default function ChoiceGroup({ label, options, value, onChange, name }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black text-brown-600">{label}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={[
                "focus-egg rounded-2xl border-2 border-brown-700 p-4 text-left shadow-eggsm transition",
                active ? "bg-yolk text-brown-700" : "bg-white/70 text-brown-600 hover:bg-butter"
              ].join(" ")}
            >
              <span className="block font-display text-xl font-black">{option.label}</span>
              <span className="mt-1 block text-sm font-semibold opacity-75">{option.helper}</span>
              <span className="sr-only">
                {active ? `Selected ${name}: ${option.label}` : `Select ${name}: ${option.label}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/UsernameInput.jsx" @'
export default function UsernameInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoFocus = false
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-brown-600">
        {label}
      </label>

      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-brown-300"
        >
          @
        </span>

        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value.trimStart())}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          className="input-egg focus-egg"
        />
      </div>
    </div>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/Loader.jsx" @'
import EggLogo from "../../../components/EggLogo";

export default function Loader({ mode }) {
  return (
    <div className="card mt-8 animate-[pop_0.4s_ease-out] p-7 text-center">
      <div className="mb-4 flex justify-center">
        <EggLogo size={70} animated />
      </div>
      <p className="font-display text-2xl font-black text-brown-700">
        {mode === "solo" ? "Inspecting the weeb…" : "Preparing the arena…"}
      </p>
      <p className="mt-2 text-sm font-semibold text-brown-400">
        Pulling stats, measuring yolk density, summoning the announcer.
      </p>
    </div>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/ErrorCard.jsx" @'
import { IconBrokenEgg } from "../../../components/Icons";

export default function ErrorCard({ error }) {
  return (
    <section
      role="alert"
      className="card mt-8 animate-[pop_0.4s_ease-out] p-6 text-center"
      style={{ background: "#F8D5C8" }}
    >
      <div className="mb-2 flex justify-center">
        <IconBrokenEgg size={56} />
      </div>
      <p className="font-bold text-brown-700">Oops — {error}</p>
      <p className="mt-1 text-sm text-brown-500">
        Double-check the username, platform, and public profile settings.
      </p>
    </section>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/InsightCard.jsx" @'
export default function InsightCard({ title, icon, children }) {
  return (
    <article className="card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-brown-700 bg-butter shadow-eggsm">
          {icon}
        </div>
        <h3 className="font-display text-2xl font-black text-brown-700">
          {title}
        </h3>
      </div>

      {children}
    </article>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/Stat.jsx" @'
export default function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border-2 border-brown-700 bg-cream p-3 shadow-eggsm">
      <dt className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-brown-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-lg font-black text-brown-700">
        {value}
      </dd>
    </div>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/ResultHeader.jsx" @'
export default function ResultHeader({ eyebrow, title, onCopy, copyStatus }) {
  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brown-400">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl font-black text-brown-700">
            {title}
          </h2>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <button type="button" onClick={onCopy} className="btn-secondary focus-egg">
            Copy result
          </button>

          {copyStatus ? (
            <p className="text-xs font-bold text-brown-400">{copyStatus}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/PlayerCard.jsx" @'
import { formatDays, formatNumber } from "../../../lib/eggTiers";
import Stat from "./Stat";

export default function PlayerCard({ player, crowned = false, rotate = "" }) {
  function openProfile() {
    if (player.profileUrl) {
      window.open(player.profileUrl, "_blank", "noopener,noreferrer");
    }
  }

  const avatarStyle = player.avatarUrl
    ? { backgroundImage: `url("${player.avatarUrl}")` }
    : undefined;

  return (
    <article className={`card card-hover p-5 ${rotate}`}>
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          style={avatarStyle}
          className="h-16 w-16 shrink-0 rounded-2xl border-2 border-brown-700 bg-butter bg-cover bg-center shadow-eggsm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openProfile}
              className="focus-egg rounded-lg text-left font-display text-2xl font-black text-brown-700 underline decoration-brown-300 underline-offset-4"
            >
              {player.username}
            </button>

            {crowned ? <span className="chip">👑 Crowned</span> : null}
          </div>

          <p className="mt-1 font-bold text-brown-500">
            {player.eggTier.emoji} {player.eggTier.rank}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <Stat label="Episodes" value={formatNumber(player.episodesWatched)} />
        <Stat label="Days" value={formatDays(player.daysWatched)} />
        <Stat label="Anime" value={formatNumber(player.totalAnime)} />
        <Stat label="Mean" value={Number(player.meanScore || 0).toFixed(1)} />
        <Stat label="Watching" value={formatNumber(player.currentlyWatching)} />
        <Stat label="Score" value={formatNumber(player.battleScore)} />
      </dl>

      {player.favoriteGenres?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {player.favoriteGenres.map((genre) => (
            <span key={genre} className="chip">
              {genre}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/StatsGrid.jsx" @'
import { formatDays, formatNumber } from "../../../lib/eggTiers";
import InsightCard from "./InsightCard";
import Stat from "./Stat";

export default function StatsGrid({ player, icon }) {
  return (
    <InsightCard title="Stat damage report" icon={icon}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Stat label="Platform" value={player.platform} />
        <Stat label="Egg tier" value={`${player.eggTier.emoji} ${player.eggTier.rank}`} />
        <Stat label="Episodes watched" value={formatNumber(player.episodesWatched)} />
        <Stat label="Days watched" value={formatDays(player.daysWatched)} />
        <Stat label="Total anime" value={formatNumber(player.totalAnime)} />
        <Stat label="Mean score" value={Number(player.meanScore || 0).toFixed(1)} />
      </dl>
    </InsightCard>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/ResultView.jsx" @'
import { IconChart, IconMegaphone, IconSparkle } from "../../../components/Icons";
import PlayerCard from "./PlayerCard";
import ResultHeader from "./ResultHeader";
import InsightCard from "./InsightCard";
import StatsGrid from "./StatsGrid";

export default function ResultView({ result, onCopy, copyStatus }) {
  if (result.type === "solo") {
    return <SoloResult result={result} onCopy={onCopy} copyStatus={copyStatus} />;
  }

  return <BattleResult result={result} onCopy={onCopy} copyStatus={copyStatus} />;
}

function SoloResult({ result, onCopy, copyStatus }) {
  const { player, commentary } = result;

  return (
    <section className="mt-10 space-y-5 animate-[pop_0.4s_ease-out]">
      <ResultHeader
        eyebrow="Solo inspection"
        title={`${player.username} got judged`}
        onCopy={onCopy}
        copyStatus={copyStatus}
      />

      <PlayerCard player={player} crowned />

      <InsightCard title="Egg court verdict" icon={<IconSparkle />}>
        <p className="whitespace-pre-wrap leading-relaxed text-brown-600">
          {commentary}
        </p>
      </InsightCard>

      <StatsGrid player={player} icon={<IconChart />} />
    </section>
  );
}

function BattleResult({ result, onCopy, copyStatus }) {
  const { playerOne, playerTwo, winner, commentary } = result;

  return (
    <section className="mt-10 space-y-5 animate-[pop_0.4s_ease-out]">
      <ResultHeader
        eyebrow="Battle result"
        title={winner ? `${winner.username} wins` : "Egg-stained tie"}
        onCopy={onCopy}
        copyStatus={copyStatus}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <PlayerCard
          player={playerOne}
          crowned={winner?.username === playerOne.username}
          rotate="-rotate-1"
        />
        <PlayerCard
          player={playerTwo}
          crowned={winner?.username === playerTwo.username}
          rotate="rotate-1"
        />
      </div>

      <InsightCard title="Announcer breakdown" icon={<IconMegaphone />}>
        <p className="whitespace-pre-wrap leading-relaxed text-brown-600">
          {commentary}
        </p>
      </InsightCard>
    </section>
  );
}
'@

Write-Host "AnimeRoyale files repaired."
  )

  $Dir = Split-Path $Path
  if ($Dir -and !(Test-Path $Dir)) {
