import { IconMagnifier } from '../../../components/Icons'
import { MEDIA_SCOPE_OPTIONS } from '../constants'

export default function AnimeRoyaleForm({
  mode,
  platform,
  setPlatform,
  mediaScope,
  setMediaScope,
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
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {mode === 'solo' ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <UsernameInput
            id="username-one"
            label="AnimeRoyale username"
            value={usernameOne}
            onChange={onUsernameOneChange}
            placeholder={platform === 'anilist' ? 'anilist-username' : 'mal-username'}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!canSubmit}
            title={!canSubmit ? 'Please enter a username first' : 'Inspect this profile'}
            className="btn-primary whitespace-nowrap flex items-center gap-2 justify-center"
          >
            <IconMagnifier size={20} />
            {loading ? 'Cracking…' : 'Inspect me'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <UsernameInput
              id="username-one"
              label="Challenger one"
              value={usernameOne}
              onChange={onUsernameOneChange}
              placeholder={platform === 'anilist' ? 'first-anilist-user' : 'first-mal-user'}
              disabled={loading}
              autoFocus
            />
            <UsernameInput
              id="username-two"
              label="Challenger two"
              value={usernameTwo}
              onChange={onUsernameTwoChange}
              placeholder={platform === 'anilist' ? 'second-anilist-user' : 'second-mal-user'}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            title={!canSubmit ? 'Please enter both usernames first' : 'Start this battle'}
            className="btn-primary whitespace-nowrap flex items-center gap-2 justify-center"
          >
            <IconMagnifier size={20} />
            {loading ? 'Cracking…' : 'Start battle'}
          </button>
        </div>
      )}

      <div className="flex flex-col justify-center items-center gap-3 mt-2 sm:flex-row">
        <label htmlFor="platform-select" className="text-brown-600 font-medium text-sm">
          Platform:
        </label>
        <select
          id="platform-select"
          value={platform}
          onChange={(event) => {
            setPlatform(event.target.value)
            if (event.target.value === 'mal' && mediaScope === 'novels') {
              setMediaScope('manga')
            }
          }}
          disabled={loading}
          className="bg-white/50 border border-brown-300 text-brown-700 text-sm rounded-lg focus:ring-brown-500 focus:border-brown-500 block p-2 outline-none cursor-pointer"
        >
          <option value="anilist">AniList</option>
          <option value="mal">MyAnimeList</option>
        </select>

        <label htmlFor="scope-select" className="text-brown-600 font-medium text-sm">
          Content:
        </label>
        <select
          id="scope-select"
          value={mediaScope}
          onChange={(event) => setMediaScope(event.target.value)}
          disabled={loading}
          className="bg-white/50 border border-brown-300 text-brown-700 text-sm rounded-lg focus:ring-brown-500 focus:border-brown-500 block p-2 outline-none cursor-pointer"
        >
          {MEDIA_SCOPE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id} disabled={platform === 'mal' && option.id === 'novels'}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onFillExamples}
          disabled={loading}
          className="text-brown-500 font-bold hover:text-brown-700 underline underline-offset-4 transition-colors text-sm"
        >
          Fill demo
        </button>
      </div>

      {error && (
        <div className="card mt-8 p-6 text-center" style={{ background: '#F8D5C8' }}>
          <p className="text-brown-700 font-semibold">Oops — {error}</p>
          <p className="text-brown-500 text-sm mt-1">Double-check the username and options.</p>
        </div>
      )}
    </form>
  )
}

function UsernameInput({ id, label, value, onChange, placeholder, disabled, autoFocus = false }) {
  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-300 font-bold text-lg pointer-events-none" aria-hidden="true">
        @
      </span>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value.trimStart())}
        placeholder={placeholder}
        className="input-egg w-full"
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
      />
    </div>
  )
}
