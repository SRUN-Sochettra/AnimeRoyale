import { getEggTier } from "./eggTiers";

const ANILIST_URL = "https://graphql.anilist.co";
const JIKAN_URL = "https://api.jikan.moe/v4";

export class AnimeApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "AnimeApiError";
    this.details = details;
  }
}

export async function fetchUserStats(platform, username) {
  const cleanUsername = username.trim();

  if (!cleanUsername) {
    throw new AnimeApiError("Username is required.");
  }

  if (platform === "anilist") {
    return fetchAniListStats(cleanUsername);
  }

  if (platform === "mal") {
    return fetchMalStats(cleanUsername);
  }

  throw new AnimeApiError("Unsupported platform selected.");
}

async function fetchAniListStats(username) {
  const query = `
    query AnimeRoyaleUser($name: String!) {
      User(name: $name) {
        id
        name
        avatar {
          large
        }
        siteUrl
        statistics {
          anime {
            count
            meanScore
            minutesWatched
            episodesWatched
            genres(limit: 5, sort: COUNT_DESC) {
              genre
              count
              meanScore
              minutesWatched
            }
            statuses {
              status
              count
            }
          }
        }
      }
    }
  `;

  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query,
      variables: {
        name: username
      }
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.errors?.length) {
    const message =
      payload?.errors?.[0]?.message ||
      `AniList request failed for "${username}".`;

    throw new AnimeApiError(message, {
      platform: "anilist",
      username,
      status: response.status,
      payload
    });
  }

  const user = payload?.data?.User;

  if (!user) {
    throw new AnimeApiError(`AniList user "${username}" was not found.`, {
      platform: "anilist",
      username
    });
  }

  const anime = user.statistics?.anime || {};
  const statuses = anime.statuses || [];

  const currentlyWatching =
    statuses.find((item) => item.status === "CURRENT")?.count || 0;

  const episodesWatched = normalizeNumber(anime.episodesWatched);
  const daysWatched = normalizeNumber(anime.minutesWatched) / 1440;
  const meanScore = normalizeNumber(anime.meanScore);
  const totalAnime = normalizeNumber(anime.count);

  const favoriteGenres = uniqueCompact(
    (anime.genres || []).map((item) => item.genre)
  );

  return withBattleFields({
    platform: "AniList",
    username: user.name,
    avatarUrl: user.avatar?.large || "",
    profileUrl: user.siteUrl || `https://anilist.co/user/${user.name}`,
    totalAnime,
    episodesWatched,
    daysWatched,
    meanScore,
    totalRewatches: 0,
    favoriteGenres,
    currentlyWatching,
    rawCompleteness: {
      hasGenres: favoriteGenres.length > 0,
      hasRewatches: false
    }
  });
}

async function fetchMalStats(username) {
  const encodedUsername = encodeURIComponent(username);

  const statsUrl = `${JIKAN_URL}/users/${encodedUsername}/statistics`;
  const profileUrl = `${JIKAN_URL}/users/${encodedUsername}/full`;

  const [statsResponse, profileResponse] = await Promise.all([
    fetch(statsUrl, {
      headers: {
        Accept: "application/json"
      }
    }),
    fetch(profileUrl, {
      headers: {
        Accept: "application/json"
      }
    })
  ]);

  const statsPayload = await statsResponse.json().catch(() => null);
  const profilePayload = await profileResponse.json().catch(() => null);

  if (!statsResponse.ok) {
    throw new AnimeApiError(
      statsPayload?.message || `MAL stats request failed for "${username}".`,
      {
        platform: "mal",
        username,
        status: statsResponse.status,
        payload: statsPayload
      }
    );
  }

  if (!profileResponse.ok) {
    throw new AnimeApiError(
      profilePayload?.message || `MAL profile request failed for "${username}".`,
      {
        platform: "mal",
        username,
        status: profileResponse.status,
        payload: profilePayload
      }
    );
  }

  const anime = statsPayload?.data?.anime;
  const profile = profilePayload?.data;

  if (!anime || !profile) {
    throw new AnimeApiError(`MyAnimeList user "${username}" was not found.`, {
      platform: "mal",
      username
    });
  }

  const episodesWatched = normalizeNumber(anime.episodes_watched);
  const daysWatched = normalizeNumber(anime.days_watched);
  const meanScore = normalizeNumber(anime.mean_score);
  const totalAnime = normalizeNumber(anime.total_entries);
  const totalRewatches = normalizeNumber(anime.rewatched);
  const currentlyWatching = normalizeNumber(anime.watching);

  return withBattleFields({
    platform: "MyAnimeList",
    username: profile.username || username,
    avatarUrl:
      profile.images?.jpg?.image_url || profile.images?.webp?.image_url || "",
    profileUrl: profile.url || `https://myanimelist.net/profile/${username}`,
    totalAnime,
    episodesWatched,
    daysWatched,
    meanScore,
    totalRewatches,
    favoriteGenres: [],
    currentlyWatching,
    rawCompleteness: {
      hasGenres: false,
      hasRewatches: true
    }
  });
}

function withBattleFields(user) {
  const eggTier = getEggTier(user.episodesWatched);

  return {
    ...user,
    eggTier,
    battleScore: calculateBattleScore(user)
  };
}

function calculateBattleScore(user) {
  const episodes = normalizeNumber(user.episodesWatched);
  const days = normalizeNumber(user.daysWatched);
  const anime = normalizeNumber(user.totalAnime);
  const rewatches = normalizeNumber(user.totalRewatches);
  const score = normalizeNumber(user.meanScore);

  return Math.round(
    episodes * 1 + days * 8 + anime * 20 + rewatches * 15 + score * 45
  );
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function uniqueCompact(items) {
  return [...new Set(items.filter(Boolean))];
}