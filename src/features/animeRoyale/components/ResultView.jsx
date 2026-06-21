import { IconChart, IconMegaphone, IconSparkle } from '../../../components/Icons'
import PlayerCard from './PlayerCard'
import ResultHeader from './ResultHeader'
import InsightCard from './InsightCard'
import StatsGrid from './StatsGrid'

export default function ResultView({ result, onCopy, copyStatus }) {
  if (result.type === 'solo') return <SoloResult result={result} onCopy={onCopy} copyStatus={copyStatus} />
  return <BattleResult result={result} onCopy={onCopy} copyStatus={copyStatus} />
}

function SoloResult({ result, onCopy, copyStatus }) {
  const { player, commentary } = result
  return (
    <section className="space-y-5 mt-10 animate-pop">
      <ResultHeader eyebrow="Solo inspection" title={player.username + ' got judged'} onCopy={onCopy} copyStatus={copyStatus} />
      <PlayerCard player={player} crowned />
      <InsightCard title="Egg court verdict" icon={<IconSparkle />}>
        <p className="text-brown-600 leading-relaxed whitespace-pre-wrap">{commentary}</p>
      </InsightCard>
      <StatsGrid player={player} icon={<IconChart />} />
    </section>
  )
}

function BattleResult({ result, onCopy, copyStatus }) {
  const { playerOne, playerTwo, winner, commentary } = result
  return (
    <section className="space-y-5 mt-10 animate-pop">
      <ResultHeader eyebrow="Battle result" title={winner ? winner.username + ' wins' : 'Egg-stained tie'} onCopy={onCopy} copyStatus={copyStatus} />
      <div className="grid gap-5 sm:grid-cols-2">
        <PlayerCard player={playerOne} crowned={winner?.username === playerOne.username} rotate="-rotate-1" />
        <PlayerCard player={playerTwo} crowned={winner?.username === playerTwo.username} rotate="rotate-1" />
      </div>
      <InsightCard title="Announcer breakdown" icon={<IconMegaphone />}>
        <p className="text-brown-600 leading-relaxed whitespace-pre-wrap">{commentary}</p>
      </InsightCard>
    </section>
  )
}
