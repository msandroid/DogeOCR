import { v4 as uuidv4 } from 'uuid'

export interface SessionData {
  id: string
  status: 'waiting' | 'active' | 'completed' | 'expired'
  createdAt: Date
  expiresAt: Date
  mobileUrl: string
  desktopUrl: string
  result?: any
  error?: string
}

class SessionManager {
  private sessions: Map<string, SessionData> = new Map()
  private readonly SESSION_TIMEOUT = 10 * 60 * 1000 // 10分

  constructor() {
    // デバッグ用: セッション管理の初期化を確認
    console.log('SessionManager initialized')
  }

  // 新しいセッションを作成
  createSession(desktopUrl: string): SessionData {
    const sessionId = uuidv4()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + this.SESSION_TIMEOUT)

    const session: SessionData = {
      id: sessionId,
      status: 'waiting',
      createdAt: now,
      expiresAt,
      mobileUrl: `${desktopUrl}/id-verify/mobile/${sessionId}`,
      desktopUrl: `${desktopUrl}/id-verify/desktop/${sessionId}`,
    }

    this.sessions.set(sessionId, session)
    
    // デバッグ用: セッション作成を確認
    console.log(`Session created: ${sessionId}, total sessions: ${this.sessions.size}`)
    
    // セッションタイムアウトの設定
    setTimeout(() => {
      this.expireSession(sessionId)
    }, this.SESSION_TIMEOUT)

    return session
  }

  // セッションを取得
  getSession(sessionId: string): SessionData | null {
    const session = this.sessions.get(sessionId)
    if (!session) {
      console.log(`Session not found: ${sessionId}, available sessions: ${Array.from(this.sessions.keys())}`)
      return null
    }

    // セッションが期限切れかチェック
    if (new Date() > session.expiresAt) {
      this.expireSession(sessionId)
      return null
    }

    console.log(`Session found: ${sessionId}`)
    return session
  }

  // セッションを更新
  updateSession(sessionId: string, updates: Partial<SessionData>): SessionData | null {
    const session = this.getSession(sessionId)
    if (!session) return null

    const updatedSession = { ...session, ...updates }
    this.sessions.set(sessionId, updatedSession)
    return updatedSession
  }

  // セッションを期限切れにする
  expireSession(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.status = 'expired'
      this.sessions.set(sessionId, session)
    }
  }

  // セッションを削除
  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }

  // アクティブなセッションを取得
  getActiveSessions(): SessionData[] {
    const now = new Date()
    return Array.from(this.sessions.values()).filter(
      session => session.status !== 'expired' && session.expiresAt > now
    )
  }

  // 期限切れセッションをクリーンアップ
  cleanupExpiredSessions(): void {
    const now = new Date()
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt <= now) {
        this.sessions.delete(sessionId)
      }
    }
  }

  // セッション統計を取得
  getSessionStats(): {
    total: number
    waiting: number
    active: number
    completed: number
    expired: number
  } {
    const stats = {
      total: 0,
      waiting: 0,
      active: 0,
      completed: 0,
      expired: 0,
    }

    for (const session of this.sessions.values()) {
      stats.total++
      stats[session.status]++
    }

    return stats
  }
}

// グローバルセッション管理
let globalSessionManager: SessionManager | null = null

// シングルトンインスタンスを取得
export function getSessionManager(): SessionManager {
  if (!globalSessionManager) {
    globalSessionManager = new SessionManager()
    
    // 定期的なクリーンアップ（5分ごと）
    setInterval(() => {
      globalSessionManager!.cleanupExpiredSessions()
    }, 5 * 60 * 1000)
  }
  return globalSessionManager
}

// 後方互換性のため
export const sessionManager = getSessionManager() 