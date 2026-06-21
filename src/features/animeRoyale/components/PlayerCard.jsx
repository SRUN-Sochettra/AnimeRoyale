import { formatDays, formatNumber } from '../../../lib/eggTiers'
import Stat from './Stat'

export default function PlayerCard({ player, crowned = false, rotate = '' }) {
  function openProfile() {
    if (player.profileUrl) window.open(player.profileUrl, '_blank', 'noopener,noreferrer')
  }

  const avatarStyle = player.avatarUrl ? { backgroundImage: 'url(' + player.avatarUrl + ')' } : undefined
  const labels = player.statLabels || {
    entries: 'Anime',
    activity: 'Episodes',
    days: 'Days',
    active: 'Watching',
  }
  const secondary = getSecondaryStat(player, labels)

  return (
    <article className={'card p-5 ' + rotate}>
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
              className="rounded-lg text-left font-display text-2xl font-black text-brown-700 underline decoration-brown-300 underline-offset-4"
            >
              {player.username}
            </button>
            {crowned ? <span className="chip">👑 Crowned</span> : null}
          </div>
          <p className="mt-1 font-bold text-brown-500">
            {player.eggTier.emoji} {player.eggTier.rank}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-brown-400">
            {player.scopeLabel} mode
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        <Stat label={labels.activity} value={formatNumber(player.activityUnits)} />
        <Stat label={secondary.label} value={secondary.value} />
        <Stat label={labels.entries} value={formatNumber(player.totalEntries)} />
        <Stat label="Mean" value={Number(player.meanScore || 0).toFixed(1)} />
        <Stat label={labels.active} value={formatNumber(player.activeCount)} />
        <Stat label="Score" value={formatNumber(player.battleScore)} />
      </dl>
      {player.favoriteGenres?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {player.favoriteGenres.map((genre) => <span key={genre} className="chip">{genre}</span>)}
        </div>
      ) : null}
    </article>
  )
}

function getSecondaryStat(player, labels) {
  if (player.mediaScope === 'manga') {
    return {
      label: labels.days,
      value: formatNumber(player.mangaStats?.volumesRead || 0),
    }
  }

  if (player.mediaScope === 'novels') {
    return {
      label: labels.days,
      value: formatNumber(player.totalEntries),
    }
  }

  return {
    label: labels.days,
    value: formatDays(player.daysWatched),
  }
}
