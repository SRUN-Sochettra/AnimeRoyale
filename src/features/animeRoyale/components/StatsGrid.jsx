import { formatDays, formatNumber } from '../../../lib/eggTiers'
import InsightCard from './InsightCard'
import Stat from './Stat'

export default function StatsGrid({ player, icon }) {
  const labels = player.statLabels || {
    entries: 'Anime',
    activity: 'Episodes',
    days: 'Days',
  }
  const volumeValue = player.mediaScope === 'manga' || player.mediaScope === 'novels'
    ? formatNumber(player.mangaStats?.volumesRead || player.novelStats?.volumesRead || 0)
    : formatDays(player.daysWatched)

  return (
    <InsightCard title="Stat damage report" icon={icon}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Stat label="Platform" value={player.platform} />
        <Stat label="Content" value={player.scopeLabel} />
        <Stat label="Egg tier" value={player.eggTier.emoji + ' ' + player.eggTier.rank} />
        <Stat label={labels.activity} value={formatNumber(player.activityUnits)} />
        <Stat label={labels.days} value={volumeValue} />
        <Stat label={labels.entries} value={formatNumber(player.totalEntries)} />
        <Stat label="Mean score" value={Number(player.meanScore || 0).toFixed(1)} />
      </dl>
    </InsightCard>
  )
}
