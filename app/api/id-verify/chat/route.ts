import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { 
  loadIdVerifySettings, 
  updateIdVerifySettings,
  IdVerifySettings 
} from "../../../../lib/id-verify-settings"

// チャットメッセージのスキーマ
const chatMessageSchema = z.object({
  message: z.string().describe("チャットメッセージ"),
  sessionId: z.string().optional().describe("セッションID"),
  userId: z.string().describe("ユーザーID"),
})

// チャットレスポンスのスキーマ
const chatResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    response: z.string().describe("チャットレスポンス"),
    settingsChanged: z.boolean().describe("設定が変更されたか"),
    newSettings: z.any().optional().describe("新しい設定（変更された場合）"),
    action: z.string().optional().describe("実行されたアクション"),
  }).optional(),
  error: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // APIキー認証
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: "認証が必要です",
      }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = chatMessageSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "リクエストボディが不正です",
        details: validationResult.error.flatten(),
      }, { status: 400 })
    }

    const { message, sessionId, userId } = validationResult.data

    // チャットメッセージを解析して設定変更を実行
    const result = await processChatMessage(message, userId)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `チャット処理に失敗しました: ${error.message}`,
    }, { status: 500 })
  }
}

// チャットメッセージを処理
async function processChatMessage(message: string, userId: string) {
  const lowerMessage = message.toLowerCase()
  
  // 現在の設定を読み込み
  const currentSettings = await loadIdVerifySettings()
  
  // 設定表示コマンド
  if (lowerMessage.includes('設定') || lowerMessage.includes('settings') || lowerMessage.includes('show')) {
    return {
      response: formatSettingsResponse(currentSettings),
      settingsChanged: false,
      action: "show_settings"
    }
  }
  
  // 顔認証スコアの変更
  if (lowerMessage.includes('顔認証') || lowerMessage.includes('face')) {
    const faceMatch = await updateFaceMatchSettings(lowerMessage, currentSettings, userId)
    if (faceMatch.settingsChanged) {
      return faceMatch
    }
  }
  
  // 年齢制限の変更
  if (lowerMessage.includes('年齢') || lowerMessage.includes('age')) {
    const ageSettings = await updateAgeSettings(lowerMessage, currentSettings, userId)
    if (ageSettings.settingsChanged) {
      return ageSettings
    }
  }
  
  // 文書真贋判定の変更
  if (lowerMessage.includes('文書') || lowerMessage.includes('document') || lowerMessage.includes('真贋')) {
    const documentSettings = await updateDocumentSettings(lowerMessage, currentSettings, userId)
    if (documentSettings.settingsChanged) {
      return documentSettings
    }
  }
  
  // OCR信頼度の変更
  if (lowerMessage.includes('ocr') || lowerMessage.includes('信頼度')) {
    const ocrSettings = await updateOcrSettings(lowerMessage, currentSettings, userId)
    if (ocrSettings.settingsChanged) {
      return ocrSettings
    }
  }
  
  // リセットコマンド
  if (lowerMessage.includes('リセット') || lowerMessage.includes('reset') || lowerMessage.includes('デフォルト')) {
    const resetSettings = await resetToDefault(userId)
    return {
      response: "設定をデフォルトにリセットしました。",
      settingsChanged: true,
      newSettings: resetSettings,
      action: "reset_settings"
    }
  }
  
  // ヘルプコマンド
  if (lowerMessage.includes('ヘルプ') || lowerMessage.includes('help') || lowerMessage.includes('使い方')) {
    return {
      response: getHelpMessage(),
      settingsChanged: false,
      action: "show_help"
    }
  }
  
  // デフォルトレスポンス
  return {
    response: "申し訳ございませんが、そのコマンドは理解できませんでした。'ヘルプ'と入力すると利用可能なコマンドを確認できます。",
    settingsChanged: false,
    action: "unknown_command"
  }
}

// 顔認証設定の更新
async function updateFaceMatchSettings(message: string, currentSettings: IdVerifySettings, userId: string) {
  const approvedMatch = message.match(/承認.*?(\d+(?:\.\d+)?)/)
  const rejectedMatch = message.match(/拒否.*?(\d+(?:\.\d+)?)/)
  const reviewMatch = message.match(/審査.*?(\d+(?:\.\d+)?)/)
  
  if (approvedMatch || rejectedMatch || reviewMatch) {
    const updates: Partial<IdVerifySettings> = {
      faceMatchThresholds: { ...currentSettings.faceMatchThresholds }
    }
    
    if (approvedMatch) {
      updates.faceMatchThresholds!.approved = parseFloat(approvedMatch[1])
    }
    if (rejectedMatch) {
      updates.faceMatchThresholds!.rejected = parseFloat(rejectedMatch[1])
    }
    if (reviewMatch) {
      updates.faceMatchThresholds!.reviewRequired = parseFloat(reviewMatch[1])
    }
    
    const newSettings = await updateIdVerifySettings(updates, userId)
    
    return {
      response: `顔認証設定を更新しました。承認: ${newSettings.faceMatchThresholds.approved}, 拒否: ${newSettings.faceMatchThresholds.rejected}, 審査: ${newSettings.faceMatchThresholds.reviewRequired}`,
      settingsChanged: true,
      newSettings: newSettings,
      action: "update_face_match"
    }
  }
  
  return { settingsChanged: false }
}

// 年齢設定の更新
async function updateAgeSettings(message: string, currentSettings: IdVerifySettings, userId: string) {
  const minAgeMatch = message.match(/最小.*?(\d+)/)
  const maxAgeMatch = message.match(/最大.*?(\d+)/)
  
  if (minAgeMatch || maxAgeMatch) {
    const updates: Partial<IdVerifySettings> = {
      ageRestrictions: { ...currentSettings.ageRestrictions }
    }
    
    if (minAgeMatch) {
      updates.ageRestrictions!.minimumAge = parseInt(minAgeMatch[1])
    }
    if (maxAgeMatch) {
      updates.ageRestrictions!.maximumAge = parseInt(maxAgeMatch[1])
    }
    
    const newSettings = await updateIdVerifySettings(updates, userId)
    
    return {
      response: `年齢制限を更新しました。最小年齢: ${newSettings.ageRestrictions.minimumAge}歳${newSettings.ageRestrictions.maximumAge ? `, 最大年齢: ${newSettings.ageRestrictions.maximumAge}歳` : ''}`,
      settingsChanged: true,
      newSettings: newSettings,
      action: "update_age_restrictions"
    }
  }
  
  return { settingsChanged: false }
}

// 文書真贋判定設定の更新
async function updateDocumentSettings(message: string, currentSettings: IdVerifySettings, userId: string) {
  const validRequired = message.includes('valid') || message.includes('必須')
  const suspiciousAllowed = message.includes('suspicious') || message.includes('疑わしい') || message.includes('許可')
  
  if (validRequired !== undefined || suspiciousAllowed !== undefined) {
    const updates: Partial<IdVerifySettings> = {
      documentAuthenticity: { ...currentSettings.documentAuthenticity }
    }
    
    if (validRequired !== undefined) {
      updates.documentAuthenticity!.validRequired = validRequired
    }
    if (suspiciousAllowed !== undefined) {
      updates.documentAuthenticity!.suspiciousAllowed = suspiciousAllowed
    }
    
    const newSettings = await updateIdVerifySettings(updates, userId)
    
    return {
      response: `文書真贋判定設定を更新しました。VALID必須: ${newSettings.documentAuthenticity.validRequired}, SUSPICIOUS許可: ${newSettings.documentAuthenticity.suspiciousAllowed}`,
      settingsChanged: true,
      newSettings: newSettings,
      action: "update_document_authenticity"
    }
  }
  
  return { settingsChanged: false }
}

// OCR信頼度設定の更新
async function updateOcrSettings(message: string, currentSettings: IdVerifySettings, userId: string) {
  const confidenceMatch = message.match(/信頼度.*?(\d+(?:\.\d+)?)/)
  
  if (confidenceMatch) {
    const updates: Partial<IdVerifySettings> = {
      ocrConfidence: {
        minimumConfidence: parseFloat(confidenceMatch[1])
      }
    }
    
    const newSettings = await updateIdVerifySettings(updates, userId)
    
    return {
      response: `OCR信頼度設定を更新しました。最小信頼度: ${newSettings.ocrConfidence.minimumConfidence}`,
      settingsChanged: true,
      newSettings: newSettings,
      action: "update_ocr_confidence"
    }
  }
  
  return { settingsChanged: false }
}

// デフォルト設定にリセット
async function resetToDefault(userId: string) {
  const { defaultIdVerifySettings, saveIdVerifySettings } = await import('../../../../lib/id-verify-settings')
  
  const resetSettings = {
    ...defaultIdVerifySettings,
    metadata: {
      ...defaultIdVerifySettings.metadata,
      lastUpdated: new Date().toISOString(),
      updatedBy: userId,
      description: "デフォルト設定にリセット",
    },
  }
  
  await saveIdVerifySettings(resetSettings)
  return resetSettings
}

// 設定レスポンスのフォーマット
function formatSettingsResponse(settings: IdVerifySettings): string {
  return `現在の設定:

顔認証閾値:
- 承認: ${settings.faceMatchThresholds.approved}
- 拒否: ${settings.faceMatchThresholds.rejected}
- 審査: ${settings.faceMatchThresholds.reviewRequired}

文書真贋判定:
- VALID必須: ${settings.documentAuthenticity.validRequired}
- SUSPICIOUS許可: ${settings.documentAuthenticity.suspiciousAllowed}

年齢制限:
- 最小年齢: ${settings.ageRestrictions.minimumAge}歳
- 最大年齢: ${settings.ageRestrictions.maximumAge || '制限なし'}

OCR信頼度:
- 最小信頼度: ${settings.ocrConfidence.minimumConfidence}

最終更新: ${settings.metadata.lastUpdated} (${settings.metadata.updatedBy})`
}

// ヘルプメッセージ
function getHelpMessage(): string {
  return `利用可能なコマンド:

1. 設定表示: "設定" または "settings"
2. 顔認証設定変更: "顔認証承認0.8" など
3. 年齢制限変更: "最小年齢20" など
4. 文書真贋判定変更: "文書VALID必須" など
5. OCR信頼度変更: "OCR信頼度0.8" など
6. リセット: "リセット" または "reset"
7. ヘルプ: "ヘルプ" または "help"

例:
- "顔認証承認0.85 拒否0.5"
- "最小年齢20 最大年齢80"
- "文書SUSPICIOUS許可"
- "OCR信頼度0.9"`
} 