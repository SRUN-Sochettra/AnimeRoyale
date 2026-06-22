export function getEggTier(selectedStats, animeStats, mangaStats, novelStats, mediaScope = 'anime') {
  const value = Number(selectedStats?.activityUnits) || 0
  const labels = getTierLabels(mediaScope)

  // Easter Eggs
  const meanScore = Number(selectedStats?.meanScore) || 0
  const daysWatched = Number(selectedStats?.daysWatched) || 0

  if (meanScore >= 6.85 && meanScore <= 6.95) {
    return { emoji: '😎', rank: 'Nice Egg', min: 0, max: Infinity }
  }

  if (daysWatched > 365) {
    return { emoji: '🌱', rank: 'Grass-Starved Egg', min: 0, max: Infinity }
  }

  const animeCount = Number(animeStats?.totalEntries) || 0
  const mangaCount = Number(mangaStats?.totalEntries) || 0
  if (animeCount === 0 && mangaCount > 100) {
    return { emoji: '👻', rank: 'Manga Ghost Egg', min: 0, max: Infinity }
  }

  if (value < 500) {
    return {
      emoji: '🐣',
      rank: labels.fresh,
      min: 0,
      max: 499,
    }
  }

  if (value <= 2000) {
    return {
      emoji: '🍳',
      rank: labels.half,
      min: 500,
      max: 2000,
    }
  }

  if (value <= 5000) {
    return {
      emoji: '🥚',
      rank: labels.hard,
      min: 2001,
      max: 5000,
    }
  }

  if (value <= 10000) {
    return {
      emoji: '🔥',
      rank: labels.scrambled,
      min: 5001,
      max: 10000,
    }
  }

  return {
    emoji: '💀',
    rank: labels.ascended,
    min: 10001,
    max: Infinity,
  }
}

function getTierLabels(mediaScope) {
  if (mediaScope === 'manga') {
    return {
      fresh: 'Freshly Hatched Reader',
      half: 'Half-Boiled Page Turner',
      hard: 'Hard-Boiled Manga Goblin',
      scrambled: 'Scrambled Shelf Dweller',
      ascended: 'Manga Egg Ascended',
    }
  }

  if (mediaScope === 'novels') {
    return {
      fresh: 'Freshly Hatched Novel Reader',
      half: 'Half-Boiled Lore Consumer',
      hard: 'Hard-Boiled Novel Scholar',
      scrambled: 'Scrambled Lore Archivist',
      ascended: 'Light Novel Egg Ascended',
    }
  }

  if (mediaScope === 'combined') {
    return {
      fresh: 'Freshly Hatched Media Weeb',
      half: 'Half-Boiled Multi-Tracker',
      hard: 'Hard-Boiled Full Spectrum Weeb',
      scrambled: 'Scrambled Media Goblin',
      ascended: 'Omni-Weeb Egg Ascended',
    }
  }

  return {
    fresh: 'Freshly Hatched Weeb',
    half: 'Half-Boiled Weeb',
    hard: 'Hard-Boiled Weeb',
    scrambled: 'Scrambled Life Weeb',
    ascended: 'Weeb Egg Ascended',
  }
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0)
}

export function formatDays(value) {
  const days = Number(value) || 0

  return days.toLocaleString('en-US', {
    maximumFractionDigits: 1,
  })
}
