import { IconChart, IconMegaphone, IconSparkle } from '../../../components/Icons'
import PlayerCard from './PlayerCard'
import ResultHeader from './ResultHeader'
import InsightCard from './InsightCard'
import StatsGrid from './StatsGrid'

export default function ResultView({ result, onCopy, onDownload, copyStatus }) {
  if (result.type === 'matchmaker') return <MatchmakerResult result={result} onCopy={onCopy} onDownload={onDownload} copyStatus={copyStatus} />
  if (result.type === 'solo') return <SoloResult result={result} onCopy={onCopy} onDownload={onDownload} copyStatus={copyStatus} />
  return <BattleResult result={result} onCopy={onCopy} onDownload={onDownload} copyStatus={copyStatus} />
}

function SoloResult({ result, onCopy, onDownload, copyStatus }) {
  const { player, commentary } = result
  return (
    <section className="space-y-5 mt-10 animate-pop">
      <ResultHeader eyebrow="Solo inspection" title={player.username + ' got judged'} onCopy={onCopy} onDownload={onDownload} copyStatus={copyStatus} />
      <PlayerCard player={player} crowned />
      <InsightCard title="Egg court verdict" icon={<IconSparkle />}>
        <p className="text-brown-600 leading-relaxed whitespace-pre-wrap">{commentary}</p>
      </InsightCard>
      <StatsGrid player={player} icon={<IconChart />} />
    </section>
  )
}

function BattleResult({ result, onCopy, onDownload, copyStatus }) {
  const { playerOne, playerTwo, winner, commentary } = result
  return (
    <section className="space-y-5 mt-10 animate-pop">
      <ResultHeader eyebrow="Battle result" title={winner ? winner.username + ' wins' : 'Egg-stained tie'} onCopy={onCopy} onDownload={onDownload} copyStatus={copyStatus} />
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


function MatchmakerResult({ result, onCopy, onDownload, copyStatus }) {
  const { playerOne, playerTwo, commentary } = result
  return (
    <section className="space-y-5 mt-10 animate-pop">
      <ResultHeader eyebrow="Matchmaker result" title="Affinity Assessment" onCopy={onCopy} onDownload={onDownload} copyStatus={copyStatus} />
      <div className="grid gap-5 sm:grid-cols-2">
        <PlayerCard player={playerOne} rotate="-rotate-1" />
        <PlayerCard player={playerTwo} rotate="rotate-1" />
      </div>
      <InsightCard title="Relationship Assessment" icon={<IconSparkle />}>
        <p className="text-brown-600 leading-relaxed whitespace-pre-wrap">{commentary}</p>
      </InsightCard>
    </section>
  )
}
