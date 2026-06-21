function Write-CodeFile {function Write-CodeFile $Path -Value $Decoded -Encoding UTF8
}

Copy-Item "D:\Users\ROG\Documents\School_Projects\Vibe\EggScan\frontend\src\index.css" ".\src\index.css" -Force
Copy-Item "D:\Users\ROG\Documents\School_Projects\Vibe\EggScan\frontend\tailwind.config.js" ".\tailwind.config.js" -Force
Copy-Item "D:\Users\ROG\Documents\School_Projects\Vibe\EggScan\frontend\src\components\EggLogo.jsx" ".\src\components\EggLogo.jsx" -Force
Copy-Item "D:\Users\ROG\Documents\School_Projects\Vibe\EggScan\frontend\src\components\Icons.jsx" ".\src\components\Icons.jsx" -Force

Write-CodeFile "src/features/animeRoyale/constants.js" @'
export const EXAMPLE_USERS = {
  anilist: ["SRUN-Sochettra", "SomChanrah"],
  mal: ["Luna", "Rin"]
}
'@

Write-CodeFile "src/features/animeRoyale/AnimeRoyalePage.jsx" @'
import { useMemo, useState } from "react"
import AnimeRoyaleForm from "./components/AnimeRoyaleForm"
import Loader from "./components/Loader"
import ErrorCard from "./components/ErrorCard"
import ResultView from "./components/ResultView"
import EggLogo from "../../components/EggLogo"
import { fetchUserStats } from "../../lib/animeApi"
import {
  buildFallbackRoast,
  buildFallbackSoloRoast,
  generateBattleCommentary,
  generateSoloCommentary,
  getWinner,
} from "../../lib/battle"
import { EXAMPLE_USERS } from "./constants"

export default function AnimeRoyalePage() {
  const [mode, setMode] = useState("solo")
  const [platform, setPlatform] = useState("anilist")
  const [usernameOne, setUsernameOne] = useState("")
  const [usernameTwo, setUsernameTwo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copyStatus, setCopyStatus] = useState("")

  const canSubmit = useMemo(() => {
    if (loading) return false
    if (!usernameOne.trim()) return false
    if (mode === "battle" && !usernameTwo.trim()) return false
    return true
  }, [loading, mode, usernameOne, usernameTwo])

  const executeWithLoading = async (action) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setCopyStatus("")

    try {
      await action()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!canSubmit) return

    await executeWithLoading(async () => {
      if (mode === "solo") {
        const player = await fetchUserStats(platform, usernameOne.trim())
        let commentary

        try {
          commentary = await generateSoloCommentary({ platform, player })
        } catch {
          commentary = buildFallbackSoloRoast(player)
        }

        setResult({
          type: "solo",
          platform,
          player,
          commentary,
        })

        return
      }

      const users = await Promise.all([
        fetchUserStats(platform, usernameOne.trim()),
        fetchUserStats(platform, usernameTwo.trim()),
      ])

      const playerOne = users[0]
      const playerTwo = users[1]
      const winner = getWinner(playerOne, playerTwo)
      let commentary

      try {
        commentary = await generateBattleCommentary({
          platform,
          playerOne,
          playerTwo,
          winner,
        })
      } catch {
        commentary = buildFallbackRoast(playerOne, playerTwo, winner)
      }

      setResult({
        type: "battle",
        platform,
        playerOne,
        playerTwo,
        winner,
        commentary,
      })
    })
  }

  const toggleMode = () => {
    setMode((currentMode) => {
      const nextMode = currentMode === "solo" ? "battle" : "solo"

      if (nextMode === "solo") {
        setUsernameTwo("")
      }

      return nextMode
    })

    setError(null)
    setResult(null)
    setCopyStatus("")
  }

  const fillExamples = () => {
    const examples = EXAMPLE_USERS[platform] || ["", ""]
    setUsernameOne(examples[0])
    setUsernameTwo(mode === "battle" ? examples[1] : "")
  }

  const copyResult = async () => {
    if (!result) return

    const title =
      result.type === "solo"
        ? "AnimeRoyale Solo Inspection: " + result.player.username
        : "AnimeRoyale Battle: " +
          result.playerOne.username +
          " vs " +
          result.playerTwo.username

    const text = [
      "🥚 " + title,
      "",
      result.commentary,
      "",
      "AnimeRoyale — anime stats, rated in eggs.",
    ].join(String.fromCharCode(10))

    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus("Copied.")
      window.setTimeout(() => setCopyStatus(""), 1800)
    } catch {
      setCopyStatus("Copy failed.")
    }
  }

  return (
    __OPEN__div className="min-h-screen"__CLOSE__
      __OPEN__FloatingEgg className="hidden md:block fixed top-20 left-10" size={60} delay={0} opacity={0.35} /__CLOSE__
      __OPEN__FloatingEgg className="hidden md:block fixed bottom-32 right-12" size={48} delay={1} opacity={0.3} /__CLOSE__
      __OPEN__FloatingEgg className="hidden lg:block fixed top-1/2 right-20" size={40} delay={2} opacity={0.25} /__CLOSE__
      __OPEN__FloatingEgg className="hidden lg:block fixed bottom-20 left-20" size={36} delay={1.5} opacity={0.25} /__CLOSE__

      __OPEN__div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 relative"__CLOSE__
        __OPEN__header className="text-center mb-10"__CLOSE__
          __OPEN__div className="flex justify-center mb-4"__CLOSE__
            __OPEN__EggLogo size={80} animated /__CLOSE__
          __OPEN__/div__CLOSE__

          __OPEN__h1 className="font-display font-black text-5xl sm:text-6xl text-brown-700 tracking-tight"__CLOSE__
            AnimeRoyale
          __OPEN__/h1__CLOSE__

          __OPEN__p className="text-brown-500 mt-3 text-lg font-medium"__CLOSE__
            Anime stats, through the egg court's eyes.
            __OPEN__br /__CLOSE__
            __OPEN__span className="text-brown-400"__CLOSE__Rated in eggs.__OPEN__/span__CLOSE__
          __OPEN__/p__CLOSE__
        __OPEN__/header__CLOSE__

        __OPEN__div className="flex justify-center mb-6"__CLOSE__
          __OPEN__button
            type="button"
            onClick={toggleMode}
            className="text-brown-500 font-bold hover:text-brown-700 underline underline-offset-4 transition-colors text-sm"
          __CLOSE__
            {mode === "battle" ? "Switch to Solo Inspection" : "Try 1v1 Battle Mode 🥊"}
          __OPEN__/button__CLOSE__
        __OPEN__/div__CLOSE__

        __OPEN__AnimeRoyaleForm
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
        /__CLOSE__

        {!loading && !result && !error && mode === "solo" && (
          __OPEN__p className="text-center text-brown-400 text-sm mt-6 italic"__CLOSE__
            warning: brutally yolk-honest
          __OPEN__/p__CLOSE__
        )}

        {loading && __OPEN__Loader mode={mode} /__CLOSE__}
        {error && __OPEN__ErrorCard error={error} /__CLOSE__}
        {result && (
          __OPEN__ResultView
            result={result}
            copyStatus={copyStatus}
            onCopy={copyResult}
          /__CLOSE__
        )}

        __OPEN__footer className="text-center text-brown-400 text-xs mt-16 pb-4"__CLOSE__
          made with love · judged with eggs
        __OPEN__/footer__CLOSE__
      __OPEN__/div__CLOSE__
    __OPEN__/div__CLOSE__
  )
}

function FloatingEgg({ className, size, delay, opacity }) {
  return (
    __OPEN__div className={className} style={{ opacity }}__CLOSE__
      __OPEN__svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 80 96"
        className="animate-float"
        style={{ animationDelay: `${delay}s` }}
        aria-hidden="true"
      __CLOSE__
        __OPEN__ellipse cx="40" cy="52" rx="28" ry="36" fill="#FCE9B8" stroke="#2E2416" strokeWidth="3" /__CLOSE__
        __OPEN__circle cx="28" cy="42" r="1.5" fill="#B89968" /__CLOSE__
        __OPEN__circle cx="50" cy="46" r="1.2" fill="#B89968" /__CLOSE__
        __OPEN__circle cx="44" cy="68" r="1.5" fill="#B89968" /__CLOSE__
      __OPEN__/svg__CLOSE__
    __OPEN__/div__CLOSE__
  )
}
'@

Write-CodeFile "src/features/animeRoyale/components/AnimeRoyaleForm.jsx" @'
import { IconMagnifier } from "../../../components/Icons"

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
  onFillExamples,
}) {
  return (
    __OPEN__form onSubmit={onSubmit} className="flex flex-col gap-3"__CLOSE__
      {mode === "solo" ? (
        __OPEN__div className="flex flex-col sm:flex-row gap-3"__CLOSE__
          __OPEN__UsernameInput
            id="username-one"
            label="Anime username"
            value={usernameOne}
            onChange={onUsernameOneChange}
            placeholder={platform === "anilist" ? "anilist-username" : "mal-username"}
            disabled={loading}
            autoFocus
          /__CLOSE__

          __OPEN__button
            type="submit"
            disabled={!canSubmit}
            title={!canSubmit ? "Please enter a username first" : "Inspect this profile"}
            className="btn-primary whitespace-nowrap flex items-center gap-2 justify-center"
          __CLOSE__
            __OPEN__IconMagnifier size={20} /__CLOSE__
            {loading ? "Cracking…" : "Inspect me"}
          __OPEN__/button__CLOSE__
        __OPEN__/div__CLOSE__
      ) : (
        __OPEN__div className="flex flex-col gap-3"__CLOSE__
          __OPEN__div className="flex flex-col sm:flex-row gap-3"__CLOSE__
            __OPEN__UsernameInput
              id="username-one"
              label="Challenger one"
              value={usernameOne}
              onChange={onUsernameOneChange}
              placeholder={platform === "anilist" ? "first-anilist-user" : "first-mal-user"}
              disabled={loading}
              autoFocus
            /__CLOSE__

            __OPEN__UsernameInput
              id="username-two"
              label="Challenger two"
              value={usernameTwo}
              onChange={onUsernameTwoChange}
              placeholder={platform === "anilist" ? "second-anilist-user" : "second-mal-user"}
              disabled={loading}
            /__CLOSE__
          __OPEN__/div__CLOSE__

          __OPEN__button
            type="submit"
            disabled={!canSubmit}
            title={!canSubmit ? "Please enter both usernames first" : "Start this battle"}
            className="btn-primary whitespace-nowrap flex items-center gap-2 justify-center"
          __CLOSE__
            __OPEN__IconMagnifier size={20} /__CLOSE__
            {loading ? "Cracking…" : "Start battle"}
          __OPEN__/button__CLOSE__
        __OPEN__/div__CLOSE__
      )}

      __OPEN__div className="flex justify-center items-center gap-3 mt-2"__CLOSE__
        __OPEN__label htmlFor="platform-select" className="text-brown-600 font-medium text-sm"__CLOSE__
          Anime Platform:
        __OPEN__/label__CLOSE__

        __OPEN__select
          id="platform-select"
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
          disabled={loading}
          className="bg-white/50 border border-brown-300 text-brown-700 text-sm rounded-lg focus:ring-brown-500 focus:border-brown-500 block p-2 outline-none cursor-pointer"
        __CLOSE__
          __OPEN__option value="anilist"__CLOSE__AniList__OPEN__/option__CLOSE__
          __OPEN__option value="mal"__CLOSE__MyAnimeList__OPEN__/option__CLOSE__
        __OPEN__/select__CLOSE__

        __OPEN__button
          type="button"
          onClick={onFillExamples}
          disabled={loading}
          className="text-brown-500 font-bold hover:text-brown-700 underline underline-offset-4 transition-colors text-sm"
        __CLOSE__
          Fill demo
        __OPEN__/button__CLOSE__
      __OPEN__/div__CLOSE__

      {error && (
        __OPEN__div className="card mt-8 p-6 text-center" style={{ background: "#F8D5C8" }}__CLOSE__
          __OPEN__p className="text-brown-700 font-semibold"__CLOSE__Oops — {error}__OPEN__/p__CLOSE__
          __OPEN__p className="text-brown-500 text-sm mt-1"__CLOSE__
            Double-check the username and try again.
          __OPEN__/p__CLOSE__
        __OPEN__/div__CLOSE__
      )}
    __OPEN__/form__CLOSE__
  )
}

function UsernameInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  autoFocus = false,
}) {
  return (
    __OPEN__div className="relative flex-1"__CLOSE__
      __OPEN__label htmlFor={id} className="sr-only"__CLOSE__
        {label}
      __OPEN__/label__CLOSE__

      __OPEN__span
        className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-300 font-bold text-lg pointer-events-none"
        aria-hidden="true"
      __CLOSE__
        @
      __OPEN__/span__CLOSE__

      __OPEN__input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value.trimStart())}
        placeholder={placeholder}
        className="input-egg w-full"
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
      /__CLOSE__
    __OPEN__/div__CLOSE__
  )
}
'@

$badPage = Select-String -Path ".\src\features\animeRoyale\AnimeRoyalePage.jsx" -Pattern "&lt;|&gt;|__OPEN__|__CLOSE__" -ErrorAction SilentlyContinue
$badForm = Select-String -Path ".\src\features\animeRoyale\components\AnimeRoyaleForm.jsx" -Pattern "&lt;|&gt;|__OPEN__|__CLOSE__" -ErrorAction SilentlyContinue

if ($badPage -or $badForm) {
  Write-Error "Repair failed: escaped JSX or placeholders remain."
  exit 1
}

Write-Host "AnimeRoyale EggScan-style no-navbar repair complete."
  param (
    [string]$Path,
    [string]$Content
  )

  $Dir = Split-Path $Path

  if ($Dir -and !(Test-Path $Dir)) {
    New-Item -ItemType Directory -Force -Path $Dir | Out-Null
  }

  if (Test-Path $Path) {
    Remove-Item $Path -Force
  }

  $Decoded = $Content.Replace("__OPEN__", [string][char]60).Replace("__CLOSE__", [string][char]62)
