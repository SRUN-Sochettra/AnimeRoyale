export function getEggTier(episodesWatched = 0) {
  const episodes = Number(episodesWatched) || 0;

  if (episodes < 500) {
    return {
      emoji: "🐣",
      rank: "Freshly Hatched Weeb",
      min: 0,
      max: 499
    };
  }

  if (episodes <= 2000) {
    return {
      emoji: "🍳",
      rank: "Half-Boiled Weeb",
      min: 500,
      max: 2000
    };
  }

  if (episodes <= 5000) {
    return {
      emoji: "🥚",
      rank: "Hard-Boiled Weeb",
      min: 2001,
      max: 5000
    };
  }

  if (episodes <= 10000) {
    return {
      emoji: "🔥",
      rank: "Scrambled Life Weeb",
      min: 5001,
      max: 10000
    };
  }

  return {
    emoji: "💀",
    rank: "Weeb Egg Ascended",
    min: 10001,
    max: Infinity
  };
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

export function formatDays(value) {
  const days = Number(value) || 0;

  return days.toLocaleString("en-US", {
    maximumFractionDigits: 1
  });
}