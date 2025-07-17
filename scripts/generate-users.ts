import { generateApiKey } from '../lib/api-key-store'

(async () => {
  for (let i = 1; i <= 10000; i++) {
    const userId = `user${String(i).padStart(5, '0')}`
    const name = `user_${String(i).padStart(5, '0')}`
    try {
      const apiKey = await generateApiKey(userId, name)
      if (i % 1000 === 0) console.log(`${i} users generated...`)
    } catch (e) {
      console.error(`Error at user ${userId}:`, e)
    }
  }
  console.log('Done: 10,000 users API keys generated.')
})() 