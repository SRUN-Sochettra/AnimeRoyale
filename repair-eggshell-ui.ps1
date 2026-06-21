function Write-AppFile {
  param (
    [string]$Path,
    [string]$Content
  )

  $Dir = Split" opacity="0.7" />  $Dir = Split-Path $Path

      <circle cx="28" cy="36" r="1.8" fill="#B89968" />
      <circle cx="56" cy="34" r="1.6" fill="#B89968" />
      <circle cx="39" cy="72" r="1.8" fill="#B89968" />
    </svg>
  );
}
'@

Write-AppFile "src/components/Navbar.jsx" @'
import { IconBrokenEgg } from "./Icons";

const links = [
  {
    name: "Profile Scanner",
    href: "/"
  },
  {
    name: "AnimeRoyale",
    href: "/",
    active: true
  },
  {
    name: "Commit Shame",
    href: "/commit-shame"
  },
  {
    name: "README Rater",
    href: "/readme-rater"
  },
  {
    name: "Stack Roast",
    href: "/stack-roast"
  }
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-brown-300 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-3">
          <IconBrokenEgg size={28} />
          <span className="font-display text-2xl font-black text-brown-700">
            EggScan
          </span>
        </a>

        <div className="hide-scrollbar ml-10 hidden h-full items-center gap-10 overflow-x-auto sm:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={
                "inline-flex h-full items-center border-b-2 px-1 text-lg font-medium transition-colors " +
                (link.active
                  ? "border-brown-700 text-brown-700"
                  : "border-transparent text-brown-500 hover:border-brown-300 hover:text-brown-700")
              }
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hide-scrollbar ml-6 flex h-full flex-1 items-center gap-5 overflow-x-auto sm:hidden">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={
                "whitespace-nowrap text-sm font-medium " +
                (link.active
                  ? "border-b-2 border-brown-700 text-brown-700"
                  : "text-brown-500 hover:text-brown-700")
              }
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
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
          "The egg court failed to fetch that profile. Check username, platform, and public stats."
      );
      setStatus("error");
    }
  }

  async function runSoloMode() {
    const player = await fetchUserStats(platform, usernameOne);
    let commentary;

    try {
      commentary = await generateSoloCommentary({
        platform,
        player
      });
    } catch {
      commentary = buildFallbackSoloRoast(player);
    }

    setResult({
      type: "solo",
      platform,
      player,
      commentary
    });
  }

  async function runBattleMode() {
    const users = await Promise.all([
      fetchUserStats(platform, usernameOne),
      fetchUserStats(platform, usernameTwo)
    ]);

    const playerOne = users[0];
    const playerTwo = users[1];
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

  function toggleMode() {
    const nextMode = mode === "solo" ? "battle" : "solo";

    setMode(nextMode);
    setError("");
    setResult(null);
    setCopyStatus("");

    if (nextMode === "solo") {
      setUsernameTwo("");
    }
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
        ? "AnimeRoyale Solo Inspection: " + result.player.username
        : "AnimeRoyale Battle: " +
          result.playerOne.username +
          " vs " +
          result.playerTwo.username;

    const lineBreak = String.fromCharCode(10);

    const text = [
      "🥚 " + title,
      "",
      result.commentary,
      "",
      "AnimeRoyale — anime stats, rated in eggs."
    ].join(lineBreak);

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied.");
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch {
      setCopyStatus("Copy failed.");
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <FloatingEgg
        className="pointer-events-none fixed left-10 top-28 hidden md:block"
        size={60}
        delay={0}
        opacity={0.35}
      />
      <FloatingEgg
        className="pointer-events-none fixed bottom-32 right-12 hidden md:block"
        size={48}
        delay={1}
        opacity={0.3}
      />
      <FloatingEgg
        className="pointer-events-none fixed right-20 top-1/2 hidden lg:block"
        size={40}
        delay={2}
        opacity={0.25}
      />
      <FloatingEgg
        className="pointer-events-none fixed bottom-20 left-20 hidden lg:block"
        size={36}
        delay={1.5}
        opacity={0.25}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
        <Hero />

        <div className="mb-9 flex justify-center">
          <button
            type="button"
            onClick={toggleMode}
            className="rounded text-lg font-bold text-brown-500 underline underline-offset-4 transition-colors hover:text-brown-700 focus-egg"
          >
            {mode === "solo"
              ? "Try 1v1 Battle Mode 🥊"
              : "Switch to Solo Inspection 🥚"}
          </button>
        </div>

        <AnimeRoyaleForm
          mode={mode}
          platform={platform}
          setPlatform={setPlatform}
          usernameOne={usernameOne}
          usernameTwo={usernameTwo}
          loading={loading}
          canSubmit={canSubmit}
          error={error}
          onUsernameOneChange={setUsernameOne}
          onUsernameTwoChange={setUsernameTwo}
          onSubmit={handleSubmit}
          onFillExamples={fillExamples}
        />

        {loading ? <Loader mode={mode} /> : null}

        {!loading && !result && !error ? (
          <p className="mt-9 text-center text-lg italic text-brown-400">
            warning: brutally yolk-honest
          </p>
        ) : null}

        {error ? <ErrorCard error={error} /> : null}

        {result ? (
          <ResultView
            result={result}
            copyStatus={copyStatus}
            onCopy={copyResult}
          />
        ) : null}

        <footer className="mt-28 pb-4 text-center text-base text-brown-400">
          made with love · judged with eggs
        </footer>
      </div>
    </main>
  );
}

function Hero() {
  return (
    <header className="mb-16 text-center">
      <div className="mb-6 flex justify-center">
        <EggLogo size={112} animated />
      </div>

      <h1 className="font-display text-[5.25rem] font-black leading-[0.9] tracking-[-0.045em] text-brown-700 sm:text-[6.75rem]">
        AnimeRoyale
      </h1>

      <p className="mt-5 text-2xl font-medium leading-relaxed text-brown-500">
        Anime stats, through the egg court&apos;s eyes.
        <br />
        <span className="text-brown-400">Rated in eggs.</span>
      </p>
    </header>
  );
}
'@

Write-AppFile "src/features/animeRoyale/components/AnimeRoyaleForm.jsx" @'
import { IconMagnifier } from "../../../components/Icons";

export default function AnimeRoyaleForm({
  mode,
  platform,
  setPlatform,
  usernameOne,
  usernameTwo,
  loading,
  canSubmit,
  error,
  onUsernameOneChange,
  onUsernameTwoChange,
  onSubmit,
  onFillExamples
}) {
  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-4xl flex-col gap-3">
      {mode === "solo" ? (
        <SoloFields
          platform={platform}
          usernameOne={usernameOne}
          loading={loading}
          canSubmit={canSubmit}
          onUsernameOneChange={onUsernameOneChange}
        />
      ) : (
        <BattleFields
          platform={platform}
          usernameOne={usernameOne}
          usernameTwo={usernameTwo}
          loading={loading}
          canSubmit={canSubmit}
          onUsernameOneChange={onUsernameOneChange}
          onUsernameTwoChange={onUsernameTwoChange}
        />
      )}

      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <label
          htmlFor="platform-select"
          className="text-lg font-semibold text-brown-600"
        >
          Anime Platform:
        </label>

        <select
          id="platform-select"
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
          disabled={loading}
          className="block rounded-lg border border-brown-300 bg-white/50 px-4 py-3 text-lg text-brown-700 outline-none transition focus:border-brown-500 focus:ring-2 focus:ring-brown-200"
        >
          <option value="anilist">AniList</option>
          <option value="mal">MyAnimeList</option>
        </select>

        <button
          type="button"
          onClick={onFillExamples}
          disabled={loading}
          className="rounded text-base font-bold text-brown-500 underline underline-offset-4 transition-colors hover:text-brown-700 focus-egg"
        >
          Fill demo
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="card mt-6 p-6 text-center"
          style={{ background: "#F8D5C8" }}
        >
          <p className="font-semibold text-brown-700">Oops — {error}</p>
          <p className="mt-1 text-sm text-brown-500">
            Double-check the username and platform.
          </p>
        </div>
      ) : null}
    </form>
  );
}

function SoloFields({
  platform,
  usernameOne,
  loading,
  canSubmit,
  onUsernameOneChange
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <UsernameField
        id="username-one"
        label="Anime username"
        value={usernameOne}
        onChange={onUsernameOneChange}
        placeholder={platform === "anilist" ? "anilist-username" : "mal-username"}
        disabled={loading}
        autoFocus
      />

      <button
        type="submit"
        disabled={!canSubmit}
        title={canSubmit ? "Inspect this anime profile" : "Please enter a username first"}
        className="btn-primary flex min-w-[230px] items-center justify-center gap-3 whitespace-nowrap text-xl"
      >
        <IconMagnifier size={23} />
        {loading ? "Cracking…" : "Inspect me"}
      </button>
    </div>
  );
}

function BattleFields({
  platform,
  usernameOne,
  usernameTwo,
  loading,
  canSubmit,
  onUsernameOneChange,
  onUsernameTwoChange
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <UsernameField
          id="username-one"
          label="Challenger one"
          value={usernameOne}
          onChange={onUsernameOneChange}
          placeholder={platform === "anilist" ? "first-anilist-user" : "first-mal-user"}
          disabled={loading}
          autoFocus
        />

        <UsernameField
          id="username-two"
          label="Challenger two"
          value={usernameTwo}
          onChange={onUsernameTwoChange}
          placeholder={platform === "anilist" ? "second-anilist-user" : "second-mal-user"}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        title={canSubmit ? "Start the 1v1 anime battle" : "Please enter both usernames first"}
        className="btn-primary flex items-center justify-center gap-3 whitespace-nowrap text-xl"
      >
        <IconMagnifier size={23} />
        {loading ? "Cracking…" : "Start battle"}
      </button>
    </div>
  );
}

function UsernameField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  autoFocus = false
}) {
  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-brown-300"
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
        className="input-egg h-[84px] w-full pl-16 text-2xl"
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </div>
  );
}
'@

Write-Host "EggScan-style AnimeRoyale files repaired."
  if ($Dir -and !(Test-Path $Dir)) {
    New-Item -ItemType Directory -Force -Path $Dir | Out-Null
  }

  if (Test-Path $Path) {
    Remove-Item $Path -Force
  }

  Set-Content -Path $Path -Value $Content -Encoding UTF8
}

Write-AppFile "src/components/EggLogo.jsx" @'
export default function EggLogo({ size = 80, animated = false }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 80 96"
      aria-hidden="true"
      className={animated ? "animate-float" : undefined}
    >
      <ellipse
        cx="40"
        cy="52"
        rx="28"
        ry="36"
        fill="#FCE9B8"
        stroke="#2E2416"
        strokeWidth="4"
      />

      <path
        d="M29 54C31 58 35 60 40 60C45 60 49 58 51 54"
        stroke="#2E2416"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M30 45C32 42 35 42 37 45"
        stroke="#2E2416"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M43 45C45 42 48 42 50 45"
        stroke="#2E2416"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="27" cy="52" r="3" fill="#F5B544" opacity="0.7" />
