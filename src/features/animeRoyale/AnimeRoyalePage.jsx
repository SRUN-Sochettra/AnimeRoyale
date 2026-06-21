import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import FloatingEgg from "../../components/FloatingEgg";
import EggLogo from "../../components/EggLogo";
import AnimeRoyaleForm from "./components/AnimeRoyaleForm";
import Loader from "./components/Loader";
import ErrorCard from "./components/ErrorCard";
import ResultView from "./components/ResultView";
import { fetchUserStats } from "../../lib/animeApi";
import { buildFallbackRoast, buildFallbackSoloRoast, generateBattleCommentary, generateSoloCommentary, getWinner } from "../../lib/battle";
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
      if (mode === "solo") await runSoloMode();
      else await runBattleMode();
      setStatus("success");
    } catch (err) {
      setError(err?.message || "The egg court failed to fetch that profile. Check the username and public stats.");
      setStatus("error");
    }
  }

  async function runSoloMode() {
    const player = await fetchUserStats(platform, usernameOne);
    let commentary;
    try { commentary = await generateSoloCommentary({ platform, player }); }
    catch { commentary = buildFallbackSoloRoast(player); }
    setResult({ type: "solo", platform, player, commentary });
  }

  async function runBattleMode() {
    const [playerOne, playerTwo] = await Promise.all([
      fetchUserStats(platform, usernameOne),
      fetchUserStats(platform, usernameTwo)
    ]);
    const winner = getWinner(playerOne, playerTwo);
    let commentary;
    try { commentary = await generateBattleCommentary({ platform, playerOne, playerTwo, winner }); }
    catch { commentary = buildFallbackRoast(playerOne, playerTwo, winner); }
    setResult({ type: "battle", platform, playerOne, playerTwo, winner, commentary });
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setError("");
    setResult(null);
    setCopyStatus("");
    if (nextMode === "solo") setUsernameTwo("");
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
      ? `AnimeRoyale Solo Inspection: ${result.player.username}`
      : `AnimeRoyale Battle: ${result.playerOne.username} vs ${result.playerTwo.username}`;

  const lineBreak = String.fromCharCode(10);

  const text = [
    `🥚 ${title}`,
    "",
    result.commentary,
    "",
    "AnimeRoyale — two weebs enter. one egg survives."
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
        {!loading && !result && !error ? <p className="mt-6 text-center text-sm italic text-brown-400">warning: brutally yolk-honest</p> : null}
        {error ? <ErrorCard error={error} /> : null}
        {result ? <ResultView result={result} copyStatus={copyStatus} onCopy={copyResult} /> : null}
        <footer className="pb-4 pt-16 text-center text-xs text-brown-400">made with love · judged with eggs · anime damage certified</footer>
      </div>
    </main>
  );
}

function Hero() {
  return (
    <header className="mb-9 text-center">
      <div className="mb-4 flex justify-center"><EggLogo size={84} animated /></div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-brown-400">EggScan Universe</p>
      <h1 className="font-display text-5xl font-black tracking-tight text-brown-700 sm:text-6xl">AnimeRoyale</h1>
      <p className="mx-auto mt-3 max-w-xl text-lg font-semibold leading-relaxed text-brown-500">
        Real anime stats, transformed into public egg judgment.<br />
        <span className="text-brown-400">Solo inspection or 1v1 weeb battle.</span>
      </p>
    </header>
  );
}
