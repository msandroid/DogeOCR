import { NextRequest, NextResponse } from "next/server"
import { getSession, updateSession } from "../../../../../lib/session-store"

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "セッションIDが必要です",
        },
        { status: 400 }
      )
    }

    const session = getSession(sessionId)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "セッションが見つかりません",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error("セッション取得エラー:", error)
    return NextResponse.json(
      {
        success: false,
        error: "セッションの取得に失敗しました",
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "セッションIDが必要です",
        },
        { status: 400 }
      )
    }

    const session = getSession(sessionId)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "セッションが見つかりません",
        },
        { status: 404 }
      )
    }

    // セッションが期限切れかチェック
    if (new Date() > new Date(session.expiresAt)) {
      const updatedSession = updateSession(sessionId, { status: "expired" })
      return NextResponse.json({
        success: true,
        session: updatedSession,
      })
    }

    // セッション状態を更新
    const updates: any = {}
    if (body.status) {
      updates.status = body.status
    }

    if (body.result) {
      updates.result = body.result
    }

    const updatedSession = updateSession(sessionId, updates)

    return NextResponse.json({
      success: true,
      session: updatedSession,
    })
  } catch (error) {
    console.error("セッション更新エラー:", error)
    return NextResponse.json(
      {
        success: false,
        error: "セッションの更新に失敗しました",
      },
      { status: 500 }
    )
  }
} 