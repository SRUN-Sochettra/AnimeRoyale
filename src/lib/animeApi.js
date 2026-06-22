import { getEggTier } from './eggTiers'

const ANILIST_URL = 'https://graphql.anilist.co'
const JIKAN_URL = 'https://api.jikan.moe/v4'

export class AnimeApiError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.name = 'AnimeApiError'
    this.details = details
  }
}

export async function fetchUserStats(platform, username, mediaScope = 'combined') {
  const cleanUsername = username.trim()

  if (!cleanUsername) {
    throw new AnimeApiError('Username is required.')
  }

  if (platform === 'anilist') {
    return fetchAniListStats(cleanUsername, mediaScope)
  }

  if (platform === 'mal') {
    return fetchMalStats(cleanUsername, mediaScope)
  }

  throw new AnimeApiError('Unsupported platform selected.')
}

async function fetchAniListStats(username, mediaScope) {
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
          manga {
            count
            meanScore
            chaptersRead
            volumesRead
            genres(limit: 5, sort: COUNT_DESC) {
              genre
              count
              meanScore
              chaptersRead
            }
            statuses {
              status
              count
            }
            formats {
              format
              count
              meanScore
              chaptersRead
            }
          }
        }
      }
    }
  `

  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        name: username,
      },
    }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.errors?.length) {
    const message = payload?.errors?.[0]?.message || `AniList request failed for "${username}".`

    throw new AnimeApiError(message, {
      platform: 'anilist',
      username,
      status: response.status,
      payload,
    })
  }

  const user = payload?.data?.User

  if (!user) {
    throw new AnimeApiError(`AniList user "${username}" was not found.`, {
      platform: 'anilist',
      username,
    })
  }

  return normalizeAniListUser(user, mediaScope)
}

function normalizeAniListUser(user, mediaScope) {
  const anime = user.statistics?.anime || {}
  const manga = user.statistics?.manga || {}

  const animeStats = buildAnimeStats({
    count: anime.count,
    episodesWatched: anime.episodesWatched,
    minutesWatched: anime.minutesWatched,
    meanScore: anime.meanScore,
    activeCount: findStatusCount(anime.statuses, 'CURRENT'),
    genres: anime.genres,
  })

  const mangaStats = buildMangaStats({
    count: manga.count,
    chaptersRead: manga.chaptersRead,
    volumesRead: manga.volumesRead,
    meanScore: manga.meanScore,
    activeCount: findStatusCount(manga.statuses, 'CURRENT'),
    genres: manga.genres,
  })

  const novelFormat = (manga.formats || []).find((item) => item.format === 'NOVEL') || {}
  const novelStats = buildMangaStats({
    count: novelFormat.count,
    chaptersRead: novelFormat.chaptersRead,
    volumesRead: 0,
    meanScore: novelFormat.meanScore,
    activeCount: 0,
    genres: [],
  })

  return buildUser({
    platform: 'AniList',
    username: user.name,
    avatarUrl: user.avatar?.large || '',
    profileUrl: user.siteUrl || `https://anilist.co/user/${user.name}`,
    mediaScope,
    animeStats,
    mangaStats,
    novelStats,
  })
}

async function fetchMalStats(username, mediaScope) {
  if (mediaScope === 'novels') {
    throw new AnimeApiError('Novel-only mode is currently supported for AniList only.')
  }

  const encodedUsername = encodeURIComponent(username)
  const statsUrl = `${JIKAN_URL}/users/${encodedUsername}/statistics`
  const profileUrl = `${JIKAN_URL}/users/${encodedUsername}/full`

  const [statsResponse, profileResponse] = await Promise.all([
    fetch(statsUrl, {
      headers: {
        Accept: 'application/json',
      },
    }),
    fetch(profileUrl, {
      headers: {
        Accept: 'application/json',
      },
    }),
  ])

  const statsPayload = await statsResponse.json().catch(() => null)
  const profilePayload = await profileResponse.json().catch(() => null)

  if (!statsResponse.ok) {
    throw new AnimeApiError(statsPayload?.message || `MAL stats request failed for "${username}".`, {
      platform: 'mal',
      username,
      status: statsResponse.status,
      payload: statsPayload,
    })
  }

  if (!profileResponse.ok) {
    throw new AnimeApiError(profilePayload?.message || `MAL profile request failed for "${username}".`, {
      platform: 'mal',
      username,
      status: profileResponse.status,
      payload: profilePayload,
    })
  }

  const anime = statsPayload?.data?.anime
  const manga = statsPayload?.data?.manga
  const profile = profilePayload?.data

  if (!profile || (!anime && !manga)) {
    throw new AnimeApiError(`MyAnimeList user "${username}" was not found.`, {
      platform: 'mal',
      username,
    })
  }

  const animeStats = buildAnimeStats({
    count: anime?.total_entries,
    episodesWatched: anime?.episodes_watched,
    minutesWatched: normalizeNumber(anime?.days_watched) * 1440,
    meanScore: anime?.mean_score,
    activeCount: anime?.watching,
    genres: [],
  })

  const mangaStats = buildMangaStats({
    count: manga?.total_entries,
    chaptersRead: manga?.chapters_read,
    volumesRead: manga?.volumes_read,
    meanScore: manga?.mean_score,
    activeCount: manga?.reading,
    genres: [],
  })

  return buildUser({
    platform: 'MyAnimeList',
    username: profile.username || username,
    avatarUrl: profile.images?.jpg?.image_url || profile.images?.webp?.image_url || '',
    profileUrl: profile.url || `https://myanimelist.net/profile/${username}`,
    mediaScope,
    animeStats,
    mangaStats,
    novelStats: emptyMangaStats(),
  })
}

function buildUser({ platform, username, avatarUrl, profileUrl, mediaScope, animeStats, mangaStats, novelStats }) {
  const selectedStats = selectStats(mediaScope, animeStats, mangaStats, novelStats)
  const favoriteGenres = uniqueCompact(selectedStats.genres)
  const eggTier = getEggTier(selectedStats, animeStats, mangaStats, novelStats, mediaScope)
  const battleScore = calculateBattleScore({ selectedStats, animeStats, mangaStats, novelStats, mediaScope })

  return {
    platform,
    username,
    avatarUrl,
    profileUrl,
    mediaScope,
    scopeLabel: getScopeLabel(mediaScope),
    statLabels: getStatLabels(mediaScope),
    animeStats,
    mangaStats,
    novelStats,
    totalEntries: selectedStats.totalEntries,
    activityUnits: selectedStats.activityUnits,
    daysWatched: selectedStats.daysWatched,
    meanScore: selectedStats.meanScore,
    activeCount: selectedStats.activeCount,
    favoriteGenres,
    eggTier,
    battleScore,
    totalAnime: selectedStats.totalEntries,
    episodesWatched: selectedStats.activityUnits,
    currentlyWatching: selectedStats.activeCount,
    totalRewatches: 0,
    rawCompleteness: {
      hasGenres: favoriteGenres.length > 0,
      hasRewatches: false,
    },
  }
}

function selectStats(mediaScope, animeStats, mangaStats, novelStats) {
  if (mediaScope === 'manga') return mangaStats
  if (mediaScope === 'novels') return novelStats

  if (mediaScope === 'combined') {
    const totalEntries = animeStats.totalEntries + mangaStats.totalEntries
    const activityUnits = Math.round(
      animeStats.activityUnits +
        mangaStats.chaptersRead * 0.35 +
        mangaStats.volumesRead * 6 +
        novelStats.chaptersRead * 0.45
    )
    const meanScore = weightedMean([
      [animeStats.meanScore, animeStats.totalEntries],
      [mangaStats.meanScore, mangaStats.totalEntries],
      [novelStats.meanScore, novelStats.totalEntries],
    ])

    return {
      totalEntries,
      activityUnits,
      daysWatched: animeStats.daysWatched,
      meanScore,
      activeCount: animeStats.activeCount + mangaStats.activeCount + novelStats.activeCount,
      chaptersRead: mangaStats.chaptersRead + novelStats.chaptersRead,
      volumesRead: mangaStats.volumesRead,
      genres: [...animeStats.genres, ...mangaStats.genres, ...novelStats.genres],
    }
  }

  return animeStats
}

function buildAnimeStats({ count, episodesWatched, minutesWatched, meanScore, activeCount, genres }) {
  const episodes = normalizeNumber(episodesWatched)

  return {
    totalEntries: normalizeNumber(count),
    activityUnits: episodes,
    episodesWatched: episodes,
    daysWatched: normalizeNumber(minutesWatched) / 1440,
    meanScore: normalizeNumber(meanScore),
    activeCount: normalizeNumber(activeCount),
    genres: uniqueCompact((genres || []).map((item) => item.genre)),
  }
}

function buildMangaStats({ count, chaptersRead, volumesRead, meanScore, activeCount, genres }) {
  const chapters = normalizeNumber(chaptersRead)
  const volumes = normalizeNumber(volumesRead)

  return {
    totalEntries: normalizeNumber(count),
    activityUnits: Math.round(chapters + volumes * 10),
    chaptersRead: chapters,
    volumesRead: volumes,
    daysWatched: 0,
    meanScore: normalizeNumber(meanScore),
    activeCount: normalizeNumber(activeCount),
    genres: uniqueCompact((genres || []).map((item) => item.genre)),
  }
}

function emptyMangaStats() {
  return buildMangaStats({
    count: 0,
    chaptersRead: 0,
    volumesRead: 0,
    meanScore: 0,
    activeCount: 0,
    genres: [],
  })
}

function calculateBattleScore({ selectedStats, animeStats, mangaStats, novelStats, mediaScope }) {
  const meanScore = normalizeNumber(selectedStats.meanScore)
  const activity = normalizeNumber(selectedStats.activityUnits)
  const entries = normalizeNumber(selectedStats.totalEntries)
  const active = normalizeNumber(selectedStats.activeCount)

  if (mediaScope === 'combined') {
    const combinedActivity =
      animeStats.episodesWatched +
      mangaStats.chaptersRead * 0.35 +
      mangaStats.volumesRead * 6 +
      novelStats.chaptersRead * 0.45
    return Math.round(combinedActivity + entries * 18 + active * 12 + meanScore * 45)
  }

  return Math.round(activity + entries * 20 + active * 12 + meanScore * 45)
}

function findStatusCount(statuses = [], status) {
  return normalizeNumber(statuses.find((item) => item.status === status)?.count)
}

function weightedMean(values) {
  const totalWeight = values.reduce((sum, [, weight]) => sum + normalizeNumber(weight), 0)
  if (!totalWeight) return 0

  const total = values.reduce((sum, [value, weight]) => sum + normalizeNumber(value) * normalizeNumber(weight), 0)
  return total / totalWeight
}

function getScopeLabel(mediaScope) {
  if (mediaScope === 'manga') return 'Manga'
  if (mediaScope === 'novels') return 'Novels'
  if (mediaScope === 'combined') return 'Combined'
  return 'Anime'
}

function getStatLabels(mediaScope) {
  if (mediaScope === 'manga') {
    return {
      entries: 'Manga',
      activity: 'Chapters',
      days: 'Volumes',
      active: 'Reading',
    }
  }

  if (mediaScope === 'novels') {
    return {
      entries: 'Entries',
      activity: 'Chapters',
      days: 'Novels',
      active: 'Reading',
    }
  }

  if (mediaScope === 'combined') {
    return {
      entries: 'Entries',
      activity: 'Activity',
      days: 'Anime days',
      active: 'Active',
    }
  }

  return {
    entries: 'Anime',
    activity: 'Episodes',
    days: 'Days',
    active: 'Watching',
  }
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function uniqueCompact(items) {
  return [...new Set(items.filter(Boolean))]
}
