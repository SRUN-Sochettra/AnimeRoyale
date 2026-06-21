import { useMemo, useState } from "react";
import { fetchUserStats } from "./lib/animeApi";
import { formatDays, formatNumber } from "./lib/eggTiers";
import {
  buildFallbackRoast,
  buildFallbackSoloRoast,
  generateBattleCommentary,
  generateSoloCommentary,
  getWinner
} from "./lib/battle";

const PLATFORM_OPTIONS = [
  {
    id: "anilist",
    label: "AniList",
    helper: "GraphQL power. Public profile required."
  },
  {
    id: "mal",
    label: "MyAnimeList",
    helper: "Powered by Jikan v4 public data."
  }
];

const MODE_OPTIONS = [
  {
    id: "battle",
    label: "Royale",
    helper: "Two usernames enter. One egg survives."
  },
  {
    id: "solo",
    label: "Solo Mode",
    helper: "One profile gets judged by the egg court."
  }
];

const EXAMPLE_USERS = {
  anilist: ["SRUN-Sochettra", "SomChanrah"],
  mal: ["Luna", "Rin"]
};

function App() {
  const [mode, setMode] = useState("battle");
  const [platform, setPlatform] = useState("anilist");
  const [usernameOne, setUsernameOne] = useState("");
  const [usernameTwo, setUsernameTwo] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  const canSubmit = useMemo(() => {
    if (status === "loading") return false;
    if (!usernameOne.trim()) return false;
    if (mode === "battle" && !usernameTwo.trim()) return false;

    return true;
  }, [mode, usernameOne, usernameTwo, status]);

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
          "The egg judges failed to fetch this profile. Check usernames and public profiles."
      );
      setStatus("error");
    }
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
        : `🥚 AnimeRoyale Result: ${result.playerOne.username} vs ${result.playerTwo.username}`;

    const text = [
      title,
      "",
      result.commentary,
      "",
      "two weebs enter. one egg survives."
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
    <main className="min-h-screen bg-egg-noise text-egg-shell">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Header />

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <ControlPanel
            mode={mode}
            setMode={setMode}
            platform={platform}
            setPlatform={setPlatform}
            usernameOne={usernameOne}
            setUsernameOne={setUsernameOne}
            usernameTwo={usernameTwo}
            setUsernameTwo={setUsernameTwo}
            status={status}
            canSubmit={canSubmit}
            error={error}
            onSubmit={handleSubmit}
            onFillExamples={fillExamples}
          />

          <ResultPanel
            result={result}
            status={status}
            onCopy={copyResult}
            copyStatus={copyStatus}
          />
        </div>

        <Footer />
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-5 border-b border-egg-gold/15 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 inline-flex rounded-full border border-egg-gold/25 bg-egg-gold/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-egg-gold">
          EggScan Universe
        </p>

        <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] text-balance sm:text-7xl lg:text-8xl">
          Anime<span className="text-egg-gold">Royale</span>
        </h1>
      </div>

      <p className="max-w-sm text-base font-bold leading-relaxed text-egg-muted sm:text-lg">
        Real anime stats. Egg tiers. Solo inspections. Head-to-head weeb
        executions.
      </p>
    </header>
  );
}

function ControlPanel({
  mode,
  setMode,
  platform,
  setPlatform,
  usernameOne,
  setUsernameOne,
  usernameTwo,
  setUsernameTwo,
  status,
  canSubmit,
  error,
  onSubmit,
  onFillExamples
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="egg-glow rounded-[2rem] border border-egg-gold/20 bg-egg-panel/85 p-5 backdrop-blur sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-[-0.04em]">
          Choose judgement
        </h2>
        <p className="mt-1 text-sm font-semibold text-egg-muted">
          Battle a friend or inspect one weeb alone under sacred egg law.
        </p>
      </div>

      <SegmentedGrid title="Mode">
        {MODE_OPTIONS.map((option) => {
          const active = mode === option.id;

          return (
            <ChoiceButton
              key={option.id}
              active={active}
              label={option.label}
              helper={option.helper}
              onClick={() => {
                setMode(option.id);
                if (option.id === "solo") {
                  setUsernameTwo("");
                }
              }}
            />
          );
        })}
      </SegmentedGrid>

      <div className="mt-6">
        <SegmentedGrid title="Platform">
          {PLATFORM_OPTIONS.map((option) => {
            const active = platform === option.id;

            return (
              <ChoiceButton
                key={option.id}
                active={active}
                label={option.label}
                helper={option.helper}
                onClick={() => setPlatform(option.id)}
              />
            );
          })}
        </SegmentedGrid>
      </div>

      <div className="mt-6 grid gap-4">
        <TextInput
          label={mode === "solo" ? "Username" : "Challenger 1"}
          value={usernameOne}
          onChange={setUsernameOne}
          placeholder={
            platform === "anilist" ? "AniList username" : "MAL username"
          }
        />

        {mode === "battle" ? (
          <TextInput
            label="Challenger 2"
            value={usernameTwo}
            onChange={setUsernameTwo}
            placeholder={
              platform === "anilist" ? "AniList username" : "MAL username"
            }
          />
        ) : null}
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-egg-danger/40 bg-egg-danger/10 p-4 text-sm font-bold text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={!canSubmit}
          className="min-h-12 flex-1 rounded-2xl bg-egg-gold px-5 py-3 text-base font-black uppercase text-egg-black transition hover:-translate-y-0.5 hover:bg-egg-yolk disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
        >
          {status === "loading"
            ? "Judging eggs..."
            : mode === "solo"
              ? "Inspect weeb 🥚"
              : "Start battle 🥚"}
        </button>

        <button
          type="button"
          onClick={onFillExamples}
          className="min-h-12 rounded-2xl border border-egg-gold/25 px-5 py-3 text-base font-black uppercase text-egg-gold transition hover:border-egg-gold hover:bg-egg-gold/10"
        >
          Fill demo
        </button>
      </div>

      <p className="mt-4 text-xs font-semibold leading-relaxed text-egg-muted">
        Private profiles, hidden stats, deleted users, or rate limits can make
        the egg tribunal explode.
      </p>
    </form>
  );
}

function SegmentedGrid({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-egg-gold">
        {title}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ChoiceButton({ active, label, helper, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-left transition",
        active
          ? "border-egg-gold bg-egg-gold text-egg-black shadow-brutal"
          : "border-egg-gold/20 bg-egg-card text-egg-shell hover:border-egg-gold/60"
      ].join(" ")}
    >
      <span className="block text-xl font-black">{label}</span>
      <span
        className={[
          "mt-1 block text-sm font-bold",
          active ? "text-egg-black/75" : "text-egg-muted"
        ].join(" ")}
      >
        {helper}
      </span>
    </button>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-egg-gold">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-14 w-full rounded-2xl border border-egg-gold/20 bg-egg-black px-4 text-lg font-black text-egg-shell outline-none transition placeholder:text-egg-muted/45 focus:border-egg-gold focus:ring-4 focus:ring-egg-gold/15"
      />
    </label>
  );
}

function ResultPanel({ result, status, onCopy, copyStatus }) {
  if (status === "loading") {
    return (
      <section className="rounded-[2rem] border border-egg-gold/20 bg-egg-card/80 p-6">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-2/3 rounded bg-egg-gold/20" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-48 rounded-3xl bg-egg-gold/10" />
            <div className="h-48 rounded-3xl bg-egg-gold/10" />
          </div>
          <div className="mt-5 h-40 rounded-3xl bg-egg-gold/10" />
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-dashed border-egg-gold/25 bg-egg-card/55 p-6 text-center">
        <div>
          <div className="mx-auto mb-5 grid size-24 place-items-center rounded-full bg-egg-gold text-6xl text-egg-black shadow-egg">
            🥚
          </div>
          <h2 className="text-3xl font-black uppercase tracking-[-0.04em]">
            Awaiting sacrifice
          </h2>
          <p className="mx-auto mt-2 max-w-sm font-bold text-egg-muted">
            Enter a username for solo inspection or two usernames for a royale
            battle.
          </p>
        </div>
      </section>
    );
  }

  if (result.type === "solo") {
    return (
      <SoloResultPanel
        result={result}
        onCopy={onCopy}
        copyStatus={copyStatus}
      />
    );
  }

  return (
    <BattleResultPanel
      result={result}
      onCopy={onCopy}
      copyStatus={copyStatus}
    />
  );
}

function BattleResultPanel({ result, onCopy, copyStatus }) {
  const { playerOne, playerTwo, winner, commentary } = result;

  return (
    <section className="rounded-[2rem] border border-egg-gold/20 bg-egg-card/80 p-5 shadow-egg sm:p-6">
      <ResultHeader
        eyebrow="Battle result"
        title={winner ? `${winner.username} wins` : "Egg-stained tie"}
        onCopy={onCopy}
        copyStatus={copyStatus}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <PlayerCard
          player={playerOne}
          isWinner={winner?.username === playerOne.username}
        />
        <PlayerCard
          player={playerTwo}
          isWinner={winner?.username === playerTwo.username}
        />
      </div>

      <CommentaryBlock commentary={commentary} />
    </section>
  );
}

function SoloResultPanel({ result, onCopy, copyStatus }) {
  const { player, commentary } = result;

  return (
    <section className="rounded-[2rem] border border-egg-gold/20 bg-egg-card/80 p-5 shadow-egg sm:p-6">
      <ResultHeader
        eyebrow="Solo inspection"
        title={`${player.username} judged`}
        onCopy={onCopy}
        copyStatus={copyStatus}
      />

      <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <PlayerCard player={player} isWinner />

        <div className="rounded-[1.5rem] border border-egg-gold/20 bg-egg-black p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-egg-gold">
            Egg court classification
          </p>

          <div className="mt-4 grid gap-3">
            <SoloBadge label="Tier" value={`${player.eggTier.emoji} ${player.eggTier.rank}`} />
            <SoloBadge label="Episodes watched" value={formatNumber(player.episodesWatched)} />
            <SoloBadge label="Days watched" value={formatDays(player.daysWatched)} />
            <SoloBadge label="Battle score" value={formatNumber(player.battleScore)} />
          </div>
        </div>
      </div>

      <CommentaryBlock commentary={commentary} />
    </section>
  );
}

function SoloBadge({ label, value }) {
  return (
    <div className="rounded-2xl border border-egg-gold/15 bg-egg-card px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-egg-muted">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-egg-shell">{value}</p>
    </div>
  );
}

function ResultHeader({ eyebrow, title, onCopy, copyStatus }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-egg-gold">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black uppercase tracking-[-0.05em]">
          {title}
        </h2>
      </div>

      <div className="flex flex-col items-start gap-1 sm:items-end">
        <button
          type="button"
          onClick={onCopy}
          className="rounded-2xl border border-egg-gold/30 px-4 py-3 text-sm font-black uppercase text-egg-gold transition hover:border-egg-gold hover:bg-egg-gold/10"
        >
          Copy result
        </button>

        {copyStatus ? (
          <p className="text-xs font-bold text-egg-muted">{copyStatus}</p>
        ) : null}
      </div>
    </div>
  );
}

function CommentaryBlock({ commentary }) {
  return (
    <article className="mt-5 rounded-[1.5rem] border border-egg-gold/20 bg-egg-black p-5">
      <p className="whitespace-pre-wrap text-lg font-black leading-relaxed text-egg-shell">
        {commentary}
      </p>
    </article>
  );
}

function PlayerCard({ player, isWinner }) {
  return (
    <article
      className={[
        "relative overflow-hidden rounded-[1.5rem] border p-4",
        isWinner
          ? "border-egg-gold bg-egg-gold text-egg-black"
          : "border-egg-gold/20 bg-egg-panel text-egg-shell"
      ].join(" ")}
    >
      {isWinner ? (
        <div className="absolute right-3 top-3 rounded-full bg-egg-black px-3 py-1 text-xs font-black uppercase text-egg-gold">
          Crowned
        </div>
      ) : null}

      <div className="flex items-center gap-3 pr-20">
        <img
          src={player.avatarUrl || "/egg-placeholder.svg"}
          alt={`${player.username} avatar`}
          className="size-16 rounded-2xl border border-current/15 object-cover"
          onError={(event) => {
            event.currentTarget.src = "/egg-placeholder.svg";
          }}
        />

        <div className="min-w-0">
          <a
            href={player.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-xl font-black underline-offset-4 hover:underline"
          >
            {player.username}
          </a>
          <p className="text-sm font-black opacity-75">
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
            <span
              key={genre}
              className="rounded-full border border-current/20 px-2.5 py-1 text-xs font-black"
            >
              {genre}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-current/15 p-3">
      <dt className="text-[0.68rem] font-black uppercase tracking-[0.16em] opacity-65">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-black tracking-[-0.04em]">{value}</dd>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-egg-gold/15 py-5 text-center text-xs font-bold uppercase tracking-[0.18em] text-egg-muted">
      AnimeRoyale · EggScan Universe · one egg survives
    </footer>
  );
}

export default App;