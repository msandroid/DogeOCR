import { randomBytes, createHash } from 'crypto'
import { supabase } from './utils'

// 簡易APIキー保存用（本番はDB推奨）
const apiKeyFile = process.env.API_KEY_STORE_PATH || './api-keys.json'
import { promises as fs } from 'fs'

function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex')
}

export async function generateApiKey(userId: string, name: string): Promise<string> {
  const apiKey = randomBytes(32).toString('hex')
  const hashedKey = hashApiKey(apiKey)
  const record = { key: hashedKey, userId, name, createdAt: Date.now(), revoked: false }
  let keys = []
  try {
    const raw = await fs.readFile(apiKeyFile, 'utf8')
    keys = JSON.parse(raw)
  } catch {}
  keys.push(record)
  await fs.writeFile(apiKeyFile, JSON.stringify(keys, null, 2))
  return apiKey // 平文はこの時のみ返す
}

export async function isValidApiKey(apiKey: string): Promise<boolean> {
  try {
    const raw = await fs.readFile(apiKeyFile, 'utf8')
    const keys = JSON.parse(raw)
    const hashed = hashApiKey(apiKey)
    return keys.some((k: any) => k.key === hashed && !k.revoked)
  } catch {
    return false
  }
}

export async function getUserApiKeys(userId: string): Promise<any[]> {
  try {
    const raw = await fs.readFile(apiKeyFile, 'utf8')
    const keys = JSON.parse(raw)
    return keys.filter((k: any) => k.userId === userId)
  } catch {
    return []
  }
}

export async function revokeApiKey(apiKey: string, isHashed = false): Promise<boolean> {
  try {
    const raw = await fs.readFile(apiKeyFile, 'utf8')
    const keys = JSON.parse(raw)
    const idx = keys.findIndex((k: any) => k.key === (isHashed ? apiKey : hashApiKey(apiKey)))
    if (idx === -1) return false
    keys[idx].revoked = true
    await fs.writeFile(apiKeyFile, JSON.stringify(keys, null, 2))
    return true
  } catch {
    return false
  }
}

// 追加: APIキーの再有効化
export async function unrevokeApiKey(apiKey: string, isHashed = false): Promise<boolean> {
  try {
    const raw = await fs.readFile(apiKeyFile, 'utf8')
    const keys = JSON.parse(raw)
    const idx = keys.findIndex((k: any) => k.key === (isHashed ? apiKey : hashApiKey(apiKey)))
    if (idx === -1) return false
    keys[idx].revoked = false
    await fs.writeFile(apiKeyFile, JSON.stringify(keys, null, 2))
    return true
  } catch {
    return false
  }
}

export async function deleteApiKey(apiKey: string, isHashed = false): Promise<boolean> {
  try {
    const raw = await fs.readFile(apiKeyFile, 'utf8')
    let keys = JSON.parse(raw)
    const before = keys.length
    keys = keys.filter((k: any) => k.key !== (isHashed ? apiKey : hashApiKey(apiKey)))
    if (keys.length === before) return false
    await fs.writeFile(apiKeyFile, JSON.stringify(keys, null, 2))
    return true
  } catch {
    return false
  }
}

// SupabaseからAPIキー情報を取得し、roleを返す
export async function getApiKeyInfoFromSupabase(apiKey: string) {
  // プレーンキーからハッシュを生成
  const { createHash } = await import('crypto')
  const key_hash = createHash('sha256').update(apiKey).digest('hex')
  // api_keysテーブル検索
  const { data, error } = await supabase
    .from('api_keys')
    .select('*, users(role)')
    .eq('key_hash', key_hash)
    .eq('status', 'active')
    .single()
  if (error || !data) return null
  return {
    ...data,
    role: data.users?.role || 'user',
  }
} 