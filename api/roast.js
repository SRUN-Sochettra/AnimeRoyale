
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const VERDICTS = ["Golden Egg", "Hard Boiled", "Fresh Egg", "Cracked", "Scrambled"];

const SCOPE_META = {
  anime: {
    label: "Anime",
    entries: "anime entries",
    activity: "episodes watched",
    active: "currently watching",
    habit: "watch-time damage"
  },
  manga: {
    label: "Manga",
    entries: "manga entries",
    activity: "chapters read",
    active: "currently reading",
    habit: "page-turning damage"
  },
  novels: {
    label: "Novels",
    entries: "novel entries",
    activity: "chapters read",
    active: "currently reading",
    habit: "light-novel dungeon damage"
  },
  combined: {
    label: "Combined",
    entries: "tracked entries",
    activity: "activity units",
    active: "active entries",
    habit: "cross-media damage"
  }
};

function metaFor(scope) {
  return SCOPE_META[scope] || SCOPE_META.anime;
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function oneDecimal(value) {
  return asNumber(value).toFixed(1);
}

function formatInt(value) {
  return new Intl.NumberFormat("en-US").format(asNumber(value));
}

function compactStats(stats = {}) {
  return {
    entries: asNumber(stats.totalEntries),
    episodes: asNumber(stats.episodesWatched),
    chapters: asNumber(stats.chaptersRead),
    volumes: asNumber(stats.volumesRead),
    days: oneDecimal(stats.daysWatched),
    meanScore: asNumber(stats.meanScore),
    active: asNumber(stats.activeCount)
  };
}

function safeUser(user = {}) {
  const mediaScope = user.mediaScope || "anime";
  const meta = metaFor(mediaScope);
  const labels = user.statLabels || {};

  return {
    platform: user.platform || "unknown",
    username: user.username || "unknown-user",
    mediaScope,
    scopeLabel: user.scopeLabel || meta.label,
    eggTier: user.eggTier || { emoji: "🥚", rank: "Unranked Egg" },
    battleScore: asNumber(user.battleScore),
    entriesLabel: labels.entries || meta.entries,
    activityLabel: labels.activity || meta.activity,
    activeLabel: labels.active || meta.active,
    totalEntries: asNumber(user.totalEntries ?? user.totalAnime),
    activityUnits: asNumber(user.activityUnits ?? user.episodesWatched),
    meanScore: asNumber(user.meanScore),
    activeCount: asNumber(user.activeCount ?? user.currentlyWatching),
    daysWatched: oneDecimal(user.daysWatched),
    favoriteGenres: Array.isArray(user.favoriteGenres) ? user.favoriteGenres.slice(0, 5) : [],
    animeStats: compactStats(user.animeStats),
    mangaStats: compactStats(user.mangaStats),
    novelStats: compactStats(user.novelStats)
  };
}

function stripEmoji(input) {
  if (!input) return "";
  return String(input)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function chatJson(systemPrompt, userPrompt) {
  const groqResponse = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  const data = await groqResponse.json().catch(() => null);

  if (!groqResponse.ok) {
    throw new Error(data?.error?.message || "Groq request failed. Check your API key or model access.");
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  try {
    return JSON.parse(content);
  } catch (parseError) {
    throw new Error("Groq returned invalid JSON: " + content, { cause: parseError });
  }
}

function getSoloPrompt(mode = "honest") {
  const basePrompt =
    "You are an AI scanning a user's anime, manga, and novel tracking profile inside the EggScan universe. " +
    "You must analyze their public tracking stats and determine their EggScore (0-100) and an EggVerdict ('Golden Egg', 'Hard Boiled', 'Fresh Egg', 'Cracked', 'Scrambled'). " +
    "Provide a brutally honest anime-court impression, actual media habits demonstrated, and harsh areas for improvement. " +
    "Provide a single 'vibe' phrase.";

  const tone = getTonePrompt(mode);

  const schema =
    "Respond with valid JSON: { " +
    "\"firstImpression\": \"\", " +
    "\"habits\": [], " +
    "\"improvements\": [], " +
    "\"vibe\": \"\", " +
    "\"eggScore\": 0, " +
    "\"eggVerdict\": \"\" " +
    "}";

  return basePrompt + " " + tone + " " + schema;
}

function getBattlePrompt(tone) {
  const tonePrompt = getTonePrompt(tone);
  return (
    "Two anime/manga/novel tracking profiles are battling. " +
    "Read their stats and declare a winner in exactly one paragraph. Roast the loser. Hype the winner. Be highly entertaining. " +
    "Use only public tracking stats. Be specific. No filler. " + tonePrompt + " " +
    "Respond with valid JSON: { \"winner\": \"username or TIE\", \"report\": \"your paragraph here\" }"
  );
}

function getTonePrompt(tone) {
  switch (String(tone || "honest").toLowerCase()) {
    case "professional":
      return "Be polite, constructive, and highly professional.";
    case "roast":
      return "Be absolutely brutal. Roast them. Make them question their media tracking habits.";
    case "hype":
      return "Be an over-enthusiastic anime startup founder. Everything is a paradigm shift in weeb analytics.";
    case "pirate":
      return "Talk like a salty sea captain reviewing a deckhand's anime, manga, and novel logs.";
    default:
      return "Be a tired, cynical, brutally honest egg-court judge.";
  }
}

function buildSoloContext({ platform, mediaScope, player }) {
  const p = safeUser(player);
  const meta = metaFor(mediaScope || p.mediaScope);
  const genres = p.favoriteGenres.length ? p.favoriteGenres.join(", ") : "(none visible)";

  return `=== PROFILE ===
Platform: ${platform}
Username: ${p.username}
Content scope: ${meta.label}
Scope roast target: ${meta.habit}
Egg tier: ${p.eggTier.emoji} ${p.eggTier.rank}
Battle score: ${formatInt(p.battleScore)}

=== SELECTED ACTIVITY ===
${p.entriesLabel}: ${formatInt(p.totalEntries)}
${p.activityLabel}: ${formatInt(p.activityUnits)}
Mean score: ${oneDecimal(p.meanScore)}
${p.activeLabel}: ${formatInt(p.activeCount)}
Anime days watched: ${p.daysWatched}
Favorite genres: ${genres}

=== CROSS-MEDIA BREAKDOWN ===
Anime entries: ${formatInt(p.animeStats.entries)}
Anime episodes: ${formatInt(p.animeStats.episodes)}
Anime days: ${p.animeStats.days}
Manga entries: ${formatInt(p.mangaStats.entries)}
Manga chapters: ${formatInt(p.mangaStats.chapters)}
Manga volumes: ${formatInt(p.mangaStats.volumes)}
Novel entries: ${formatInt(p.novelStats.entries)}
Novel chapters: ${formatInt(p.novelStats.chapters)}

Now produce the JSON analysis. Be honest. Be specific. No filler.`;
}

function buildBattleContext({ platform, mediaScope, playerOne, playerTwo, winner }) {
  const p1 = safeUser(playerOne);
  const p2 = safeUser(playerTwo);
  const safeWinner = winner ? safeUser(winner) : null;
  const meta = metaFor(mediaScope || p1.mediaScope);

  return `--- PLAYER 1: ${p1.username} ---
Platform: ${platform}
Content scope: ${meta.label}
Egg tier: ${p1.eggTier.emoji} ${p1.eggTier.rank}
Battle score: ${formatInt(p1.battleScore)}
${p1.entriesLabel}: ${formatInt(p1.totalEntries)}
${p1.activityLabel}: ${formatInt(p1.activityUnits)}
Mean score: ${oneDecimal(p1.meanScore)}
${p1.activeLabel}: ${formatInt(p1.activeCount)}
Genres: ${p1.favoriteGenres.length ? p1.favoriteGenres.join(", ") : "(none visible)"}

--- PLAYER 2: ${p2.username} ---
Platform: ${platform}
Content scope: ${meta.label}
Egg tier: ${p2.eggTier.emoji} ${p2.eggTier.rank}
Battle score: ${formatInt(p2.battleScore)}
${p2.entriesLabel}: ${formatInt(p2.totalEntries)}
${p2.activityLabel}: ${formatInt(p2.activityUnits)}
Mean score: ${oneDecimal(p2.meanScore)}
${p2.activeLabel}: ${formatInt(p2.activeCount)}
Genres: ${p2.favoriteGenres.length ? p2.favoriteGenres.join(", ") : "(none visible)"}

--- SCORING WINNER ---
${safeWinner ? safeWinner.username : "TIE"}

Respond with JSON: { "winner": "username or TIE", "report": "your paragraph here" }`;
}

function buildSoloCommentary(json, player) {
  const p = safeUser(player);
  const rawVerdict = stripEmoji(json?.eggVerdict || "Fresh Egg");
  const eggVerdict = VERDICTS.includes(rawVerdict) ? rawVerdict : "Fresh Egg";
  const eggScore = clamp(Number(json?.eggScore) || 50, 0, 100);
  const firstImpression = stripEmoji(json?.firstImpression);
  const vibe = stripEmoji(json?.vibe);
  const habits = Array.isArray(json?.habits) ? json.habits.map(stripEmoji).filter(Boolean) : [];
  const improvements = Array.isArray(json?.improvements) ? json.improvements.map(stripEmoji).filter(Boolean) : [];

  const habitsLine = habits.length ? "\n\nHABITS ON TRIAL: " + habits.join("; ") + "." : "";
  const improvementsLine = improvements.length ? "\n\nCOURT-ORDERED IMPROVEMENTS: " + improvements.join("; ") + "." : "";
  const vibeLine = vibe ? "\n\nVIBE: " + vibe + "." : "";
  const impression = firstImpression || "The egg court has reviewed the evidence and found the tracking habits legally crunchy.";

  return `${impression}${habitsLine}${improvementsLine}${vibeLine}\n\nEGG SCORE: ${eggScore}/100 — ${eggVerdict}\nFINAL VERDICT: ${p.username.toUpperCase()} IS ${p.eggTier.rank.toUpperCase()} ${p.eggTier.emoji}`.trim();
}

function buildBattleCommentary(json, fallbackWinner) {
  const winner = stripEmoji(json?.winner || fallbackWinner?.username || "TIE");
  const report = stripEmoji(json?.report || "The egg court stared at the stats and somehow produced no usable commentary.");

  if (!winner || winner.toUpperCase() === "TIE") {
    return `${report}\n\nRESULT: EGG-STAINED TIE 🥚⚔️`;
  }

  return `${report}\n\nWINNER: ${winner.toUpperCase()} 🥚👑`;
}


function getMatchmakerPrompt(tone) {
  const tonePrompt = getTonePrompt(tone);
  return (
    "Two anime/manga/novel tracking profiles are being compared for compatibility. " +
    "Read their stats and provide a relationship assessment in exactly one paragraph. Compare their genres, scores, and activity levels. Be highly entertaining. " +
    "Use only public tracking stats. Be specific. No filler. " + tonePrompt + " " +
    "Respond with valid JSON: { \"affinityScore\": \"0-100\", \"report\": \"your paragraph here\" }"
  );
}


function buildMatchmakerContext({ platform, mediaScope, playerOne, playerTwo }) {
  const p1 = safeUser(playerOne);
  const p2 = safeUser(playerTwo);
  const meta = metaFor(mediaScope || p1.mediaScope);

  return `--- PLAYER 1: ${p1.username} ---
Platform: ${platform}
Content scope: ${meta.label}
${p1.entriesLabel}: ${formatInt(p1.totalEntries)}
${p1.activityLabel}: ${formatInt(p1.activityUnits)}
Mean score: ${oneDecimal(p1.meanScore)}
Genres: ${p1.favoriteGenres.length ? p1.favoriteGenres.join(", ") : "(none visible)"}

--- PLAYER 2: ${p2.username} ---
Platform: ${platform}
Content scope: ${meta.label}
${p2.entriesLabel}: ${formatInt(p2.totalEntries)}
${p2.activityLabel}: ${formatInt(p2.activityUnits)}
Mean score: ${oneDecimal(p2.meanScore)}
Genres: ${p2.favoriteGenres.length ? p2.favoriteGenres.join(", ") : "(none visible)"}

Respond with JSON: { "affinityScore": "0-100", "report": "your paragraph here" }`;
}


function buildMatchmakerCommentary(json) {
  const score = stripEmoji(json?.affinityScore || "0");
  const report = stripEmoji(json?.report || "The egg court stared at the stats and somehow produced no usable commentary.");
  return `${report}\n\nCOMPATIBILITY SCORE: ${score}/100 🥚💖`;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  if (!process.env.GROQ_API_KEY) {
    return response.status(500).json({ message: "Missing GROQ_API_KEY server environment variable." });
  }

  try {
    const body = request.body || {};
    const {
      mode = "battle",
      tone = "honest",
      platform,
      mediaScope = "anime",
      playerOne,
      playerTwo,
      winner,
      player
    } = body;

    if (!platform) {
      return response.status(400).json({ message: "Missing platform." });
    }


    if (mode === "matchmaker") {
      if (!playerOne || !playerTwo) {
        return response.status(400).json({ message: "Missing matchmaker payload." });
      }

      const json = await chatJson(
        getMatchmakerPrompt(tone),
        buildMatchmakerContext({ platform, mediaScope, playerOne, playerTwo })
      );

      return response.status(200).json({
        commentary: buildMatchmakerCommentary(json),
        analysis: json
      });
    }

    if (mode === "solo") {
      if (!player) {
        return response.status(400).json({ message: "Missing solo player payload." });
      }

      const json = await chatJson(
        getSoloPrompt(tone),
        buildSoloContext({ platform, mediaScope, player })
      );

      return response.status(200).json({
        commentary: buildSoloCommentary(json, player),
        analysis: json
      });
    }

    if (!playerOne || !playerTwo) {
      return response.status(400).json({ message: "Missing battle payload." });
    }

    const json = await chatJson(
      getBattlePrompt(tone),
      buildBattleContext({ platform, mediaScope, playerOne, playerTwo, winner })
    );

    return response.status(200).json({
      commentary: buildBattleCommentary(json, winner),
      analysis: json
    });
  } catch (caughtError) {
    return response.status(500).json({ message: caughtError?.message || "Unexpected server error." });
  }
}
