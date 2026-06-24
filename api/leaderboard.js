import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      if (!process.env.UPSTASH_REDIS_REST_URL) {
         return response.status(200).json({ leaderboard: [] });
      }

      // Fetch top 10 from a sorted set 'leaderboard:eggscore'
      const topScores = await redis.zrange('leaderboard:eggscore', 0, 9, { rev: true, withScores: true })
      
      const formatted = [];
      for (let i = 0; i < topScores.length; i += 2) {
          formatted.push({
             username: topScores[i],
             score: topScores[i+1]
          })
      }

      return response.status(200).json({ leaderboard: formatted })
    } catch (error) {
      return response.status(500).json({ message: error.message || 'Failed to fetch leaderboard.' })
    }
  }

  if (request.method === 'POST') {
    try {
      if (!process.env.UPSTASH_REDIS_REST_URL) {
          return response.status(200).json({ success: true, warning: 'Redis not configured.' });
      }

      const { username, score } = request.body || {}

      if (!username || typeof score !== 'number') {
        return response.status(400).json({ message: 'Invalid payload.' })
      }

      await redis.zadd('leaderboard:eggscore', { score, member: username })

      return response.status(200).json({ success: true })
    } catch (error) {
      return response.status(500).json({ message: error.message || 'Failed to update leaderboard.' })
    }
  }

  return response.status(405).json({ message: 'Method not allowed.' })
}