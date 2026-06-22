export function getWinner(playerOne, playerTwo) {
  if (playerOne.battleScore > playerTwo.battleScore) return playerOne
  if (playerTwo.battleScore > playerOne.battleScore) return playerTwo

  if (playerOne.activityUnits > playerTwo.activityUnits) return playerOne
  if (playerTwo.activityUnits > playerOne.activityUnits) return playerTwo

  return null
}

export function buildFallbackRoast(playerOne, playerTwo, winner) {
  const scope = playerOne.scopeLabel || 'Anime'
  const activityLabel = playerOne.statLabels?.activity || 'Episodes'

  if (!winner) {
    return `ABSOLUTE EGG CHAOS. ${playerOne.username.toUpperCase()} AND ${playerTwo.username.toUpperCase()} HAVE PRODUCED A ${scope.toUpperCase()} TIE SO UNSTABLE THE YOLK REFUSES TO PICK A SIDE.

TWO WEEBS ENTERED. TWO WEEBS SURVIVED. THE EGG JUDGES ARE DISGUSTED.

RESULT: EGG-STAINED TIE 🥚⚔️`
  }

  const loser = winner.username === playerOne.username ? playerTwo : playerOne

  return `AND THERE IT IS, FOLKS! ${winner.username.toUpperCase()} HAS CRACKED THE ${scope.toUpperCase()} ARENA OPEN WITH ${winner.activityUnits.toLocaleString()} ${activityLabel.toUpperCase()}, STANDING PROUD AS A ${winner.eggTier.emoji} ${winner.eggTier.rank.toUpperCase()}.

${loser.username.toUpperCase()} PUT UP A FIGHT, BUT THIS WAS LESS OF A BATTLE AND MORE OF A PUBLIC EGG INSPECTION. ${loser.activityUnits.toLocaleString()} ${activityLabel.toUpperCase()}? RESPECTABLE. DANGEROUS? NOT TODAY.

WINNER: ${winner.username.toUpperCase()} ${winner.eggTier.emoji}👑`
}

export function buildFallbackSoloRoast(player) {
  const scope = player.scopeLabel || 'Anime'
  const labels = player.statLabels || {
    entries: 'Anime',
    activity: 'Episodes',
    days: 'Days',
  }

  return `THE EGG COURT HAS INSPECTED ${player.username.toUpperCase()} IN ${scope.toUpperCase()} MODE AND THE RESULTS ARE LOUD, YOLKY, AND LEGALLY CONCERNING.

${player.username.toUpperCase()} HAS LOGGED ${player.activityUnits.toLocaleString()} ${labels.activity.toUpperCase()} ACROSS ${player.totalEntries.toLocaleString()} ${labels.entries.toUpperCase()}, EARNING THE SACRED TITLE OF ${player.eggTier.emoji} ${player.eggTier.rank.toUpperCase()}.

FINAL VERDICT: ${player.username.toUpperCase()} IS ${player.eggTier.rank.toUpperCase()} ${player.eggTier.emoji}`
}

export async function generateBattleCommentary({
  platform,
  playerOne,
  playerTwo,
  winner,
  mediaScope,
  tone,
}) {
  const response = await fetch('/api/roast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'battle',
      platform,
      mediaScope,
      tone,
      playerOne,
      playerTwo,
      winner,
    }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'AI commentary failed.')
  }

  return payload.commentary
}

export async function generateSoloCommentary({ platform, player, mediaScope, tone }) {
  const response = await fetch('/api/roast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'solo',
      platform,
      mediaScope,
      tone,
      player,
    }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || 'AI solo commentary failed.')
  }

  return payload.commentary
}


export function buildFallbackMatchmaker(playerOne, playerTwo) {
  return `THE EGG COURT HAS EVALUATED THE AFFINITY BETWEEN ${playerOne.username.toUpperCase()} AND ${playerTwo.username.toUpperCase()}.

RESULT: IT'S A MATCH MADE IN ANIME HEAVEN 🥚💖 (or maybe not, the AI failed to respond).`
}

export async function generateMatchmakerCommentary({
  platform,
  playerOne,
  playerTwo,
  mediaScope,
  tone,
}) {
  const response = await fetch('/api/roast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'matchmaker',
      platform,
      mediaScope,
      tone,
      playerOne,
      playerTwo,
    }),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message || 'AI commentary failed.')
  return payload.commentary
}
