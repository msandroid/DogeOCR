import { NextRequest, NextResponse } from 'next/server'
import { generateApiKey, getUserApiKeys, revokeApiKey, deleteApiKey } from '../../../../lib/api-key-store'
import { unrevokeApiKey } from '../../../../lib/api-key-store'
import { z } from 'zod'
import { getServerSession } from 'next-auth'

// userIdはヘッダー 'x-user-id' で受け取る（本番は認証セッション推奨）

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  const body = await request.json()
  const schema = z.object({ name: z.string().min(1) })
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'APIキー名が不正です', details: result.error.flatten() }, { status: 400 })
  }
  const { name } = result.data
  const apiKey = await generateApiKey(userId, name)
  return NextResponse.json({ apiKey })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  const keys = await getUserApiKeys(userId)
  return NextResponse.json({ apiKeys: keys })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  const body = await request.json()
  const schema = z.object({ apiKey: z.string().min(1) })
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'APIキーが不正です', details: result.error.flatten() }, { status: 400 })
  }
  const { apiKey } = result.data
  const keys = await getUserApiKeys(userId)
  if (!keys.some(k => k.key === apiKey)) {
    return NextResponse.json({ error: '指定されたAPIキーが見つかりません' }, { status: 404 })
  }
  const resultDelete = await deleteApiKey(apiKey, true)
  if (!resultDelete) {
    return NextResponse.json({ error: 'APIキーの削除に失敗しました' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  const body = await request.json()
  const schema = z.object({ apiKey: z.string().min(1), revoke: z.boolean() })
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'リクエストボディが不正です', details: result.error.flatten() }, { status: 400 })
  }
  const { apiKey, revoke } = result.data
  const keys = await getUserApiKeys(userId)
  if (!keys.some(k => k.key === apiKey)) {
    return NextResponse.json({ error: '指定されたAPIキーが見つかりません' }, { status: 404 })
  }
  let resultOp = false
  if (revoke) {
    resultOp = await revokeApiKey(apiKey, true)
  } else {
    resultOp = await unrevokeApiKey(apiKey, true)
  }
  if (!resultOp) {
    return NextResponse.json({ error: 'APIキーの状態変更に失敗しました' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 