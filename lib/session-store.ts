interface Session {
  sessionId: string
  status: "pending" | "active" | "completed" | "expired"
  createdAt: string
  expiresAt: string
  result?: any
}

// インメモリセッションストア（本番環境ではRedisやデータベースを使用）
const sessions = new Map<string, Session>()

export function createSession(): Session {
  const sessionId = Math.random().toString(36).substr(2, 16)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000) // 30分後に期限切れ

  const session: Session = {
    sessionId,
    status: "pending",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }

  sessions.set(sessionId, session)
  cleanupExpiredSessions()

  return session
}

export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId)
  
  if (!session) {
    return null
  }

  // セッションが期限切れかチェック
  if (new Date() > new Date(session.expiresAt)) {
    session.status = "expired"
  }

  return session
}

export function updateSession(sessionId: string, updates: Partial<Session>): Session | null {
  const session = sessions.get(sessionId)
  
  if (!session) {
    return null
  }

  // セッションが期限切れかチェック
  if (new Date() > new Date(session.expiresAt)) {
    session.status = "expired"
    return session
  }

  // セッションを更新
  Object.assign(session, updates)
  sessions.set(sessionId, session)

  return session
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId)
}

export function getAllSessions(): Session[] {
  cleanupExpiredSessions()
  return Array.from(sessions.values())
}

export function getActiveSessions(): Session[] {
  cleanupExpiredSessions()
  return Array.from(sessions.values()).filter(session => session.status !== "expired")
}

function cleanupExpiredSessions() {
  const now = new Date()
  for (const [sessionId, session] of sessions.entries()) {
    if (new Date(session.expiresAt) < now) {
      sessions.delete(sessionId)
    }
  }
} 