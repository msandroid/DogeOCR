import { NextRequest, NextResponse } from 'next/server'
import { generateApiKey, getUserApiKeys, revokeApiKey, deleteApiKey } from '../../../../lib/api-key-store'
import { unrevokeApiKey } from '../../../../lib/api-key-store'

// userIdはヘッダー 'x-user-id' で受け取る（本番は認証セッション推奨）

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 401 })
  }
  const { name } = await request.json()
  if (!name || typeof name !== 'string' || name.length === 0) {
    return NextResponse.json({ error: 'APIキー名が必要です' }, { status: 400 })
  }
  const apiKey = await generateApiKey(userId, name)
  return NextResponse.json({ apiKey })
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 401 })
  }
  const keys = await getUserApiKeys(userId)
  return NextResponse.json({ apiKeys: keys })
}

export async function DELETE(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 401 })
  }
  const { apiKey } = await request.json()
  const keys = await getUserApiKeys(userId)
  if (!keys.some(k => k.key === apiKey)) {
    return NextResponse.json({ error: '指定されたAPIキーが見つかりません' }, { status: 404 })
  }
  const result = await deleteApiKey(apiKey, true)
  if (!result) {
    return NextResponse.json({ error: 'APIキーの削除に失敗しました' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 401 })
  }
  const { apiKey, revoke } = await request.json()
  const keys = await getUserApiKeys(userId)
  if (!keys.some(k => k.key === apiKey)) {
    return NextResponse.json({ error: '指定されたAPIキーが見つかりません' }, { status: 404 })
  }
  let result = false
  if (revoke) {
    result = await revokeApiKey(apiKey, true)
  } else {
    result = await unrevokeApiKey(apiKey, true)
  }
  if (!result) {
    return NextResponse.json({ error: 'APIキーの状態変更に失敗しました' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 