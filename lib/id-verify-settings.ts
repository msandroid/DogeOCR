import { z } from "zod"

// 合格条件の設定スキーマ
export const idVerifySettingsSchema = z.object({
  // 顔認証の閾値
  faceMatchThresholds: z.object({
    approved: z.number().min(0).max(1).describe("承認される顔認証スコアの最小値"),
    rejected: z.number().min(0).max(1).describe("拒否される顔認証スコアの最大値"),
    reviewRequired: z.number().min(0).max(1).describe("審査が必要な顔認証スコアの閾値"),
  }),
  
  // 文書真贋判定の条件
  documentAuthenticity: z.object({
    validRequired: z.boolean().describe("文書がVALIDである必要があるか"),
    suspiciousAllowed: z.boolean().describe("SUSPICIOUSを許可するか"),
  }),
  
  // 年齢制限
  ageRestrictions: z.object({
    minimumAge: z.number().min(0).describe("最小年齢"),
    maximumAge: z.number().min(0).optional().describe("最大年齢（オプション）"),
  }),
  
  // OCR信頼度の閾値
  ocrConfidence: z.object({
    minimumConfidence: z.number().min(0).max(1).describe("OCR信頼度の最小値"),
  }),
  
  // その他の条件
  additionalConditions: z.object({
    requireNameMatch: z.boolean().describe("名前の一致を要求するか"),
    requireBirthDateMatch: z.boolean().describe("生年月日の一致を要求するか"),
    requireAddressMatch: z.boolean().describe("住所の一致を要求するか"),
    allowManualReview: z.boolean().describe("手動審査を許可するか"),
  }),
  
  // 設定のメタデータ
  metadata: z.object({
    version: z.string().describe("設定バージョン"),
    lastUpdated: z.string().describe("最終更新日時"),
    updatedBy: z.string().describe("更新者"),
    description: z.string().optional().describe("設定の説明"),
  }),
})

export type IdVerifySettings = z.infer<typeof idVerifySettingsSchema>

// デフォルト設定
export const defaultIdVerifySettings: IdVerifySettings = {
  faceMatchThresholds: {
    approved: 0.8,
    rejected: 0.6,
    reviewRequired: 0.7,
  },
  documentAuthenticity: {
    validRequired: true,
    suspiciousAllowed: false,
  },
  ageRestrictions: {
    minimumAge: 18,
    maximumAge: undefined,
  },
  ocrConfidence: {
    minimumConfidence: 0.7,
  },
  additionalConditions: {
    requireNameMatch: false,
    requireBirthDateMatch: false,
    requireAddressMatch: false,
    allowManualReview: true,
  },
  metadata: {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    updatedBy: "system",
    description: "デフォルト設定",
  },
}

// 設定ファイルのパス
export const SETTINGS_FILE_PATH = "./id-verify-settings.json"

// 設定の読み込み
export async function loadIdVerifySettings(): Promise<IdVerifySettings> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const settingsPath = path.join(process.cwd(), SETTINGS_FILE_PATH)
    const settingsData = await fs.readFile(settingsPath, 'utf-8')
    const settings = JSON.parse(settingsData)
    
    // スキーマでバリデーション
    const validatedSettings = idVerifySettingsSchema.parse(settings)
    return validatedSettings
  } catch (error) {
    console.warn("設定ファイルの読み込みに失敗しました。デフォルト設定を使用します:", error)
    return defaultIdVerifySettings
  }
}

// 設定の保存
export async function saveIdVerifySettings(settings: IdVerifySettings): Promise<void> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const settingsPath = path.join(process.cwd(), SETTINGS_FILE_PATH)
    const settingsData = JSON.stringify(settings, null, 2)
    await fs.writeFile(settingsPath, settingsData, 'utf-8')
  } catch (error) {
    console.error("設定ファイルの保存に失敗しました:", error)
    throw new Error("設定の保存に失敗しました")
  }
}

// 設定の更新
export async function updateIdVerifySettings(
  updates: Partial<IdVerifySettings>,
  updatedBy: string
): Promise<IdVerifySettings> {
  const currentSettings = await loadIdVerifySettings()
  
  const updatedSettings: IdVerifySettings = {
    ...currentSettings,
    ...updates,
    metadata: {
      ...currentSettings.metadata,
      lastUpdated: new Date().toISOString(),
      updatedBy,
    },
  }
  
  await saveIdVerifySettings(updatedSettings)
  return updatedSettings
}

// 合格判定ロジック（動的設定対応）
export function determineApprovalWithSettings(
  settings: IdVerifySettings,
  faceScore: number,
  authenticityResult: string,
  ocrConfidence: number,
  age: number,
  nameMatch?: boolean,
  birthDateMatch?: boolean,
  addressMatch?: boolean
): { judgement: string; reviewType: string; reason: string } {
  const reasons: string[] = []
  
  // 顔認証スコアチェック
  if (faceScore < settings.faceMatchThresholds.rejected) {
    return {
      judgement: "REJECTED",
      reviewType: "AUTO",
      reason: `顔認証スコアが低すぎます: ${faceScore} (最小: ${settings.faceMatchThresholds.rejected})`
    }
  }
  
  if (faceScore < settings.faceMatchThresholds.approved) {
    reasons.push(`顔認証スコアが承認基準を満たしていません: ${faceScore} (最小: ${settings.faceMatchThresholds.approved})`)
  }
  
  // 文書真贋判定チェック
  if (settings.documentAuthenticity.validRequired && authenticityResult !== "VALID") {
    return {
      judgement: "REJECTED",
      reviewType: "AUTO",
      reason: `文書真贋判定が不正です: ${authenticityResult}`
    }
  }
  
  if (!settings.documentAuthenticity.suspiciousAllowed && authenticityResult === "SUSPICIOUS") {
    reasons.push("文書が疑わしいと判定されました")
  }
  
  // 年齢チェック
  if (age < settings.ageRestrictions.minimumAge) {
    return {
      judgement: "REJECTED",
      reviewType: "AUTO",
      reason: `年齢が不足しています: ${age}歳 (最小: ${settings.ageRestrictions.minimumAge}歳)`
    }
  }
  
  if (settings.ageRestrictions.maximumAge && age > settings.ageRestrictions.maximumAge) {
    return {
      judgement: "REJECTED",
      reviewType: "AUTO",
      reason: `年齢が上限を超えています: ${age}歳 (最大: ${settings.ageRestrictions.maximumAge}歳)`
    }
  }
  
  // OCR信頼度チェック
  if (ocrConfidence < settings.ocrConfidence.minimumConfidence) {
    reasons.push(`OCR信頼度が低すぎます: ${ocrConfidence} (最小: ${settings.ocrConfidence.minimumConfidence})`)
  }
  
  // 追加条件チェック
  if (settings.additionalConditions.requireNameMatch && nameMatch === false) {
    reasons.push("名前の一致が必要です")
  }
  
  if (settings.additionalConditions.requireBirthDateMatch && birthDateMatch === false) {
    reasons.push("生年月日の一致が必要です")
  }
  
  if (settings.additionalConditions.requireAddressMatch && addressMatch === false) {
    reasons.push("住所の一致が必要です")
  }
  
  // 最終判定
  if (reasons.length === 0 && faceScore >= settings.faceMatchThresholds.approved) {
    return {
      judgement: "APPROVED",
      reviewType: "AUTO",
      reason: "すべての条件を満たしています"
    }
  }
  
  if (settings.additionalConditions.allowManualReview) {
    return {
      judgement: "REVIEW_REQUIRED",
      reviewType: "MANUAL",
      reason: reasons.join(", ")
    }
  } else {
    return {
      judgement: "REJECTED",
      reviewType: "AUTO",
      reason: reasons.join(", ")
    }
  }
} 