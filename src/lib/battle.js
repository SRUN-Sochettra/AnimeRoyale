export function getWinner(playerOne, playerTwo) {
  if (playerOne.battleScore > playerTwo.battleScore) return playerOne;
  if (playerTwo.battleScore > playerOne.battleScore) return playerTwo;

  if (playerOne.episodesWatched > playerTwo.episodesWatched) return playerOne;
  if (playerTwo.episodesWatched > playerOne.episodesWatched) return playerTwo;

  return null;
}

export function buildFallbackRoast(playerOne, playerTwo, winner) {
  if (!winner) {
    return `ABSOLUTE EGG CHAOS. ${playerOne.username.toUpperCase()} AND ${playerTwo.username.toUpperCase()} HAVE PRODUCED A TIE SO UNSTABLE THE YOLK REFUSES TO PICK A SIDE.

TWO WEEBS ENTERED. TWO WEEBS SURVIVED. THE EGG JUDGES ARE DISGUSTED.

RESULT: EGG-STAINED TIE 🥚⚔️`;
  }

  const loser = winner.username === playerOne.username ? playerTwo : playerOne;

  return `AND THERE IT IS, FOLKS! ${winner.username.toUpperCase()} HAS CRACKED THE ARENA OPEN WITH ${winner.episodesWatched.toLocaleString()} EPISODES WATCHED, STANDING PROUD AS A ${winner.eggTier.emoji} ${winner.eggTier.rank.toUpperCase()}.

${loser.username.toUpperCase()} PUT UP A FIGHT, BUT THIS WAS LESS OF A BATTLE AND MORE OF A PUBLIC EGG INSPECTION. ${loser.episodesWatched.toLocaleString()} EPISODES? RESPECTABLE. DANGEROUS? NOT TODAY.

WINNER: ${winner.username.toUpperCase()} ${winner.eggTier.emoji}👑`;
}

export function buildFallbackSoloRoast(player) {
  return `THE EGG COURT HAS INSPECTED ${player.username.toUpperCase()} AND THE RESULTS ARE LOUD, YOLKY, AND LEGALLY CONCERNING.

${player.username.toUpperCase()} HAS WATCHED ${player.episodesWatched.toLocaleString()} EPISODES ACROSS ${player.totalAnime.toLocaleString()} ANIME, CLOCKING IN AT ${Number(
    player.daysWatched || 0
  ).toFixed(1)} DAYS OF COMMITTED SCREEN-TIME DAMAGE. THAT EARNS THE SACRED TITLE OF ${player.eggTier.emoji} ${player.eggTier.rank.toUpperCase()}.

FINAL VERDICT: ${player.username.toUpperCase()} IS ${player.eggTier.rank.toUpperCase()} ${player.eggTier.emoji}`;
}

export async function generateBattleCommentary({
  platform,
  playerOne,
  playerTwo,
  winner
}) {
  const response = await fetch("/api/roast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mode: "battle",
      platform,
      playerOne,
      playerTwo,
      winner
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "AI commentary failed.");
  }

  return payload.commentary;
}

export async function generateSoloCommentary({ platform, player }) {
  const response = await fetch("/api/roast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mode: "solo",
      platform,
      player
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "AI solo commentary failed.");
  }

  return payload.commentary;
}