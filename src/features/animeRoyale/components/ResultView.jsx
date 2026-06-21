import { IconChart, IconMegaphone, IconSparkle } from "../../../components/Icons";
import PlayerCard from "./PlayerCard";
import ResultHeader from "./ResultHeader";
import InsightCard from "./InsightCard";
import StatsGrid from "./StatsGrid";

export default function ResultView({ result, onCopy, copyStatus }) {
  if (result.type === "solo") return <SoloResult result={result} onCopy={onCopy} copyStatus={copyStatus} />;
  return <BattleResult result={result} onCopy={onCopy} copyStatus={copyStatus} />;
}

function SoloResult({ result, onCopy, copyStatus }) {
  const { player, commentary } = result;
  return (
    <section className="mt-10 space-y-5 animate-[pop_0.4s_ease-out]">
      <ResultHeader eyebrow="Solo inspection" title={`${player.username} got judged`} onCopy={onCopy} copyStatus={copyStatus} />
      <PlayerCard player={player} crowned />
      <InsightCard title="Egg court verdict" icon={<IconSparkle />}>
        <p className="whitespace-pre-wrap leading-relaxed text-brown-600">{commentary}</p>
      </InsightCard>
      <StatsGrid player={player} icon={<IconChart />} />
    </section>
  );
}

function BattleResult({ result, onCopy, copyStatus }) {
  const { playerOne, playerTwo, winner, commentary } = result;
  return (
    <section className="mt-10 space-y-5 animate-[pop_0.4s_ease-out]">
      <ResultHeader eyebrow="Battle result" title={winner ? `${winner.username} wins` : "Egg-stained tie"} onCopy={onCopy} copyStatus={copyStatus} />
      <div className="grid gap-5 sm:grid-cols-2">
        <PlayerCard player={playerOne} crowned={winner?.username === playerOne.username} rotate="-rotate-1" />
        <PlayerCard player={playerTwo} crowned={winner?.username === playerTwo.username} rotate="rotate-1" />
      </div>
      <InsightCard title="Announcer breakdown" icon={<IconMegaphone />}>
        <p className="whitespace-pre-wrap leading-relaxed text-brown-600">{commentary}</p>
      </InsightCard>
    </section>
  );
}
