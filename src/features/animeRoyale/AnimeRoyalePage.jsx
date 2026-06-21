import { useMemo, useState } from 'react'
import AnimeRoyaleForm from './components/AnimeRoyaleForm'
import Loader from './components/Loader'
import ErrorCard from './components/ErrorCard'
import ResultView from './components/ResultView'
import EggLogo from '../../components/EggLogo'
import { fetchUserStats } from '../../lib/animeApi'
import {
  buildFallbackRoast,
  buildFallbackSoloRoast,
  generateBattleCommentary,
  generateSoloCommentary,
  getWinner,
} from '../../lib/battle'
import { EXAMPLE_USERS } from './constants'

export default function AnimeRoyalePage() {
  const [mode, setMode] = useState('solo')
  const [platform, setPlatform] = useState('anilist')
  const [usernameOne, setUsernameOne] = useState('')
  const [usernameTwo, setUsernameTwo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')

  const canSubmit = useMemo(() => {
    if (loading) return false
    if (!usernameOne.trim()) return false
    if (mode === 'battle' && !usernameTwo.trim()) return false
    return true
  }, [loading, mode, usernameOne, usernameTwo])

  const executeWithLoading = async (action) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setCopyStatus('')
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
      if (mode === 'solo') {
        const player = await fetchUserStats(platform, usernameOne.trim())
        let commentary
        try {
          commentary = await generateSoloCommentary({ platform, player })
        } catch {
          commentary = buildFallbackSoloRoast(player)
        }
        setResult({ type: 'solo', platform, player, commentary })
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
        commentary = await generateBattleCommentary({ platform, playerOne, playerTwo, winner })
      } catch {
        commentary = buildFallbackRoast(playerOne, playerTwo, winner)
      }
      setResult({ type: 'battle', platform, playerOne, playerTwo, winner, commentary })
    })
  }

  const toggleMode = () => {
    setMode((currentMode) => {
      const nextMode = currentMode === 'solo' ? 'battle' : 'solo'
      if (nextMode === 'solo') setUsernameTwo('')
      return nextMode
    })
    setError(null)
    setResult(null)
    setCopyStatus('')
  }

  const fillExamples = () => {
    const examples = EXAMPLE_USERS[platform] || ['', '']
    setUsernameOne(examples[0])
    setUsernameTwo(mode === 'battle' ? examples[1] : '')
  }

  const copyResult = async () => {
    if (!result) return
    const title = result.type === 'solo'
      ? 'AnimeRoyale Solo Inspection: ' + result.player.username
      : 'AnimeRoyale Battle: ' + result.playerOne.username + ' vs ' + result.playerTwo.username
    const text = ['🥚 ' + title, '', result.commentary, '', 'AnimeRoyale — anime stats, rated in eggs.'].join(String.fromCharCode(10))
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copied.')
      window.setTimeout(() => setCopyStatus(''), 1800)
    } catch {
      setCopyStatus('Copy failed.')
    }
  }

  return (
    <div className="min-h-screen">
      <FloatingEgg className="hidden md:block fixed top-20 left-10" size={60} delay={0} opacity={0.35} />
      <FloatingEgg className="hidden md:block fixed bottom-32 right-12" size={48} delay={1} opacity={0.3} />
      <FloatingEgg className="hidden lg:block fixed top-1/2 right-20" size={40} delay={2} opacity={0.25} />
      <FloatingEgg className="hidden lg:block fixed bottom-20 left-20" size={36} delay={1.5} opacity={0.25} />

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 relative">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <EggLogo size={80} animated />
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-brown-700 tracking-tight">
            AnimeRoyale
          </h1>
          <p className="text-brown-500 mt-3 text-lg font-medium">
            Anime stats, through the egg court&apos;s eyes.
            <br />
            <span className="text-brown-400">Rated in eggs.</span>
          </p>
        </header>

        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={toggleMode}
            className="text-brown-500 font-bold hover:text-brown-700 underline underline-offset-4 transition-colors text-sm"
          >
            {mode === 'battle' ? 'Switch to Solo Inspection' : 'Try 1v1 Battle Mode 🥊'}
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

        {!loading && !result && !error && mode === 'solo' && (
          <p className="text-center text-brown-400 text-sm mt-6 italic">
            warning: brutally yolk-honest
          </p>
        )}

        {loading && <Loader mode={mode} />}
        {error && <ErrorCard error={error} />}
        {result && <ResultView result={result} copyStatus={copyStatus} onCopy={copyResult} />}

        <footer className="text-center text-brown-400 text-xs mt-16 pb-4">
          made with love · judged with eggs
        </footer>
      </div>
    </div>
  )
}

function FloatingEgg({ className, size, delay, opacity }) {
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
        <ellipse cx="40" cy="52" rx="28" ry="36" fill="#FCE9B8" stroke="#2E2416" strokeWidth="3" />
        <circle cx="28" cy="42" r="1.5" fill="#B89968" />
        <circle cx="50" cy="46" r="1.2" fill="#B89968" />
        <circle cx="44" cy="68" r="1.5" fill="#B89968" />
      </svg>
    </div>
  )
}
