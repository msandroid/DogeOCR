import { NextRequest, NextResponse } from "next/server"
import { createSession, getSession } from "../../../../lib/session-store"

export async function POST(request: NextRequest) {
  try {
    const session = createSession()

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error("セッション作成エラー:", error)
    return NextResponse.json(
      {
        success: false,
        error: "セッションの作成に失敗しました",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

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

 