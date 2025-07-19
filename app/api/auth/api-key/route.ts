import { NextRequest, NextResponse } from 'next/server'
import { generateApiKey, getUserApiKeys, revokeApiKey, deleteApiKey } from '../../../../lib/api-key-store'
import { unrevokeApiKey } from '../../../../lib/api-key-store'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { getUserSubscription, canUseApiKeys } from '../../../../lib/subscription-utils'

// userIdはヘッダー 'x-user-id' で受け取る（本番は認証セッション推奨）

export async function POST(request: NextRequest) {
  // セッションからユーザーIDを取得
  const session = await getServerSession()
  let userId = session?.user?.id
  
  // セッションから取得できない場合はヘッダーから取得
  if (!userId) {
    userId = request.headers.get('x-user-id') || undefined
  }
  
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  
  // サブスクリプション状態をチェック
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    return NextResponse.json({ error: 'サブスクリプション情報が見つかりません' }, { status: 404 })
  }
  
  // APIキー機能の利用権限をチェック
  if (!canUseApiKeys(subscription.planType)) {
    return NextResponse.json({ 
      error: 'APIキー機能はPROプランまたはENTERPRISEプランでのみ利用可能です',
      requiredPlan: 'PRO',
      currentPlan: subscription.planType
    }, { status: 403 })
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
  // セッションからユーザーIDを取得
  const session = await getServerSession()
  let userId = session?.user?.id
  
  // セッションから取得できない場合はヘッダーから取得
  if (!userId) {
    userId = request.headers.get('x-user-id') || undefined
  }
  
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  
  // サブスクリプション状態をチェック
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    return NextResponse.json({ error: 'サブスクリプション情報が見つかりません' }, { status: 404 })
  }
  
  // APIキー機能の利用権限をチェック
  if (!canUseApiKeys(subscription.planType)) {
    return NextResponse.json({ 
      error: 'APIキー機能はPROプランまたはENTERPRISEプランでのみ利用可能です',
      requiredPlan: 'PRO',
      currentPlan: subscription.planType
    }, { status: 403 })
  }
  
  const keys = await getUserApiKeys(userId)
  return NextResponse.json({ apiKeys: keys })
}

export async function DELETE(request: NextRequest) {
  // セッションからユーザーIDを取得
  const session = await getServerSession()
  let userId = session?.user?.id
  
  // セッションから取得できない場合はヘッダーから取得
  if (!userId) {
    userId = request.headers.get('x-user-id') || undefined
  }
  
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  
  // サブスクリプション状態をチェック
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    return NextResponse.json({ error: 'サブスクリプション情報が見つかりません' }, { status: 404 })
  }
  
  // APIキー機能の利用権限をチェック
  if (!canUseApiKeys(subscription.planType)) {
    return NextResponse.json({ 
      error: 'APIキー機能はPROプランまたはENTERPRISEプランでのみ利用可能です',
      requiredPlan: 'PRO',
      currentPlan: subscription.planType
    }, { status: 403 })
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
  // セッションからユーザーIDを取得
  const session = await getServerSession()
  let userId = session?.user?.id
  
  // セッションから取得できない場合はヘッダーから取得
  if (!userId) {
    userId = request.headers.get('x-user-id') || undefined
  }
  
  if (!userId) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }
  
  // サブスクリプション状態をチェック
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    return NextResponse.json({ error: 'サブスクリプション情報が見つかりません' }, { status: 404 })
  }
  
  // APIキー機能の利用権限をチェック
  if (!canUseApiKeys(subscription.planType)) {
    return NextResponse.json({ 
      error: 'APIキー機能はPROプランまたはENTERPRISEプランでのみ利用可能です',
      requiredPlan: 'PRO',
      currentPlan: subscription.planType
    }, { status: 403 })
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