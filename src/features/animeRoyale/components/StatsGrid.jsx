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
