import { z } from "zod"

// 身分証明書の種類
export const ID_DOCUMENT_TYPES = {
  DRIVERS_LICENSE: "運転免許証",
  MYNUMBER_CARD: "マイナンバーカード",
  PASSPORT: "パスポート",
  RESIDENCE_CARD: "在留カード",
  BASIC_RESIDENCE_CARD: "住民基本台帳カード",
  SPECIAL_PERMANENT_RESIDENT_CARD: "特別永住者証明書",
  ALIEN_REGISTRATION_CARD: "外国人登録証明書",
  NATIONAL_ID: "国民IDカード",
  MILITARY_ID: "軍人ID",
  POLICE_ID: "警察官身分証",
  EMPLOYEE_ID: "職員証",
  STUDENT_ID: "学生証",
  OTHER: "その他"
} as const

// 顔認証結果
export const FACE_MATCH_RESULTS = {
  PASS: "PASS",
  FAIL: "FAIL", 
  REVIEW: "REVIEW"
} as const

// 真贋判定結果
export const AUTHENTICITY_RESULTS = {
  VALID: "VALID",
  INVALID: "INVALID",
  SUSPICIOUS: "SUSPICIOUS"
} as const

// 最終判定結果
export const FINAL_JUDGEMENTS = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REVIEW_REQUIRED: "REVIEW_REQUIRED"
} as const

// 審査タイプ
export const REVIEW_TYPES = {
  AUTO: "AUTO",
  MANUAL: "MANUAL"
} as const

// セッション状態
export const SESSION_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED"
} as const

// リスクレベル
export const RISK_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
} as const

// 基本情報スキーマ
export const UserInfoSchema = z.object({
  name: z.string().optional().describe("申請者の氏名"),
  birthDate: z.string().optional().describe("生年月日（YYYY-MM-DD形式）"),
  address: z.string().optional().describe("住所"),
  phoneNumber: z.string().optional().describe("電話番号"),
  email: z.string().email().optional().describe("メールアドレス"),
})

// OCR結果スキーマ
export const OCRResultSchema = z.object({
  documentType: z.string().describe("文書種別"),
  name: z.string().optional().describe("氏名"),
  birthDate: z.string().optional().describe("生年月日"),
  address: z.string().optional().describe("住所"),
  expirationDate: z.string().optional().describe("有効期限"),
  documentNumber: z.string().optional().describe("文書番号"),
  issuingAuthority: z.string().optional().describe("発行機関"),
  confidence: z.number().min(0).max(1).describe("OCR信頼度"),
  boundingBoxes: z.array(z.object({
    field: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    confidence: z.number().min(0).max(1)
  })).optional().describe("バウンディングボックス情報")
})

// 顔認証結果スキーマ
export const FaceMatchResultSchema = z.object({
  score: z.number().min(0).max(1).describe("顔照合スコア"),
  result: z.enum(["PASS", "FAIL", "REVIEW"]).describe("顔照合結果"),
  confidence: z.number().min(0).max(1).describe("顔認証信頼度"),
  notes: z.string().optional().describe("備考"),
  faceQuality: z.object({
    brightness: z.number().optional(),
    blur: z.number().optional(),
    angle: z.number().optional(),
    occlusion: z.number().optional()
  }).optional().describe("顔画像品質情報")
})

// 真贋判定結果スキーマ
export const AuthenticityResultSchema = z.object({
  result: z.enum(["VALID", "INVALID", "SUSPICIOUS"]).describe("真贋判定結果"),
  confidence: z.number().min(0).max(1).describe("真贋判定信頼度"),
  riskFactors: z.array(z.string()).describe("リスク要因"),
  notes: z.string().optional().describe("備考"),
  securityFeatures: z.object({
    hologram: z.boolean().optional(),
    watermark: z.boolean().optional(),
    uvPattern: z.boolean().optional(),
    microtext: z.boolean().optional()
  }).optional().describe("セキュリティ機能チェック")
})

// 最終判定スキーマ
export const FinalJudgementSchema = z.object({
  judgement: z.enum(["APPROVED", "REJECTED", "REVIEW_REQUIRED"]).describe("最終判定"),
  reviewType: z.enum(["AUTO", "MANUAL"]).describe("審査タイプ"),
  confidence: z.number().min(0).max(1).describe("全体の信頼度"),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).describe("リスクレベル"),
  reasons: z.array(z.string()).describe("判定理由"),
  recommendations: z.array(z.string()).optional().describe("推奨事項")
})

// セッション情報スキーマ
export const SessionInfoSchema = z.object({
  sessionId: z.string().describe("セッションID"),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "EXPIRED"]).describe("セッション状態"),
  createdAt: z.string().describe("作成日時"),
  updatedAt: z.string().describe("更新日時"),
  expiresAt: z.string().describe("有効期限"),
  ipAddress: z.string().optional().describe("IPアドレス"),
  userAgent: z.string().optional().describe("ユーザーエージェント"),
  deviceInfo: z.object({
    type: z.string().optional(),
    os: z.string().optional(),
    browser: z.string().optional()
  }).optional().describe("デバイス情報")
})

// 画像情報スキーマ
export const ImageInfoSchema = z.object({
  documentImage: z.string().describe("身分証明書画像のBase64データ"),
  selfieImage: z.string().describe("セルフィー画像のBase64データ"),
  documentImageHash: z.string().optional().describe("身分証明書画像のハッシュ値"),
  selfieImageHash: z.string().optional().describe("セルフィー画像のハッシュ値"),
  documentImageSize: z.number().describe("身分証明書画像サイズ（バイト）"),
  selfieImageSize: z.number().describe("セルフィー画像サイズ（バイト）"),
  documentImageType: z.string().describe("身分証明書画像のMIMEタイプ"),
  selfieImageType: z.string().describe("セルフィー画像のMIMEタイプ")
})

// 処理結果スキーマ
export const ProcessingResultSchema = z.object({
  processingTime: z.number().describe("処理時間（ミリ秒）"),
  apiVersion: z.string().describe("APIバージョン"),
  modelVersion: z.string().describe("使用モデルバージョン"),
  errors: z.array(z.string()).optional().describe("エラー情報"),
  warnings: z.array(z.string()).optional().describe("警告情報")
})

// 完全なID認証結果スキーマ
export const IDVerificationResultSchema = z.object({
  sessionInfo: SessionInfoSchema,
  userInfo: UserInfoSchema.optional(),
  imageInfo: ImageInfoSchema,
  ocrResult: OCRResultSchema,
  faceMatchResult: FaceMatchResultSchema,
  authenticityResult: AuthenticityResultSchema,
  finalJudgement: FinalJudgementSchema,
  processingResult: ProcessingResultSchema,
  compliance: z.object({
    standard: z.string().describe("準拠規格"),
    country: z.string().describe("対象国"),
    method: z.string().describe("認証方式"),
    dataRetention: z.string().describe("データ保存期間")
  }).describe("コンプライアンス情報")
})

// リクエストスキーマ
export const IDVerifyRequestSchema = z.object({
  documentImage: z.string().describe("身分証明書のBase64エンコードされた画像データ"),
  selfieImage: z.string().describe("セルフィーのBase64エンコードされた画像データ"),
  userInfo: UserInfoSchema.optional().describe("申請者の基本情報"),
  sessionId: z.string().optional().describe("セッションID"),
  complianceLevel: z.enum(["BASIC", "STANDARD", "PREMIUM"]).optional().describe("コンプライアンスレベル")
})

// レスポンススキーマ
export const IDVerifyResponseSchema = z.object({
  success: z.boolean(),
  data: IDVerificationResultSchema.optional(),
  error: z.string().optional(),
  errorCode: z.string().optional(),
  errorDetails: z.any().optional()
})

// 統計情報スキーマ
export const VerificationStatsSchema = z.object({
  totalVerifications: z.number().describe("総認証数"),
  approvedCount: z.number().describe("承認数"),
  rejectedCount: z.number().describe("拒否数"),
  reviewRequiredCount: z.number().describe("要審査数"),
  averageProcessingTime: z.number().describe("平均処理時間（ミリ秒）"),
  successRate: z.number().describe("成功率（%）"),
  averageConfidence: z.number().describe("平均信頼度"),
  documentTypeStats: z.record(z.number()).describe("文書種別別統計"),
  riskLevelStats: z.record(z.number()).describe("リスクレベル別統計")
})

// 監査ログスキーマ
export const AuditLogSchema = z.object({
  id: z.string().describe("ログID"),
  sessionId: z.string().describe("セッションID"),
  timestamp: z.string().describe("タイムスタンプ"),
  action: z.string().describe("アクション"),
  userId: z.string().optional().describe("ユーザーID"),
  ipAddress: z.string().optional().describe("IPアドレス"),
  userAgent: z.string().optional().describe("ユーザーエージェント"),
  details: z.any().describe("詳細情報"),
  result: z.string().describe("結果"),
  errorMessage: z.string().optional().describe("エラーメッセージ")
})

// 型定義
export type UserInfo = z.infer<typeof UserInfoSchema>
export type OCRResult = z.infer<typeof OCRResultSchema>
export type FaceMatchResult = z.infer<typeof FaceMatchResultSchema>
export type AuthenticityResult = z.infer<typeof AuthenticityResultSchema>
export type FinalJudgement = z.infer<typeof FinalJudgementSchema>
export type SessionInfo = z.infer<typeof SessionInfoSchema>
export type ImageInfo = z.infer<typeof ImageInfoSchema>
export type ProcessingResult = z.infer<typeof ProcessingResultSchema>
export type IDVerificationResult = z.infer<typeof IDVerificationResultSchema>
export type IDVerifyRequest = z.infer<typeof IDVerifyRequestSchema>
export type IDVerifyResponse = z.infer<typeof IDVerifyResponseSchema>
export type VerificationStats = z.infer<typeof VerificationStatsSchema>
export type AuditLog = z.infer<typeof AuditLogSchema>

// 定数
export const COMPLIANCE_STANDARDS = {
  JAPAN_AML: {
    name: "犯罪収益移転防止法",
    country: "日本",
    method: "eKYCホ方式",
    dataRetention: "7年間",
    requirements: [
      "身分証明書の確認",
      "本人確認（顔認証）",
      "真贋判定",
      "記録の保存",
      "監査ログの維持"
    ]
  }
} as const

export const RISK_FACTORS = {
  DOCUMENT: {
    EXPIRED: "文書の有効期限切れ",
    DAMAGED: "文書の損傷",
    POOR_QUALITY: "画像品質不良",
    SUSPICIOUS_PATTERN: "疑わしいパターン",
    INCONSISTENT_FONT: "フォントの不整合",
    MANIPULATION_SIGNS: "改ざんの兆候"
  },
  FACE: {
    LOW_SCORE: "顔照合スコアが低い",
    POOR_LIGHTING: "照明条件不良",
    BLUR: "画像のぼやけ",
    ANGLE: "顔の角度が不適切",
    OCCLUSION: "顔の一部が隠れている",
    EXPRESSION: "表情が不自然"
  },
  SESSION: {
    MULTIPLE_ATTEMPTS: "複数回の試行",
    SUSPICIOUS_IP: "疑わしいIPアドレス",
    DEVICE_MISMATCH: "デバイス情報の不整合",
    TIME_ANOMALY: "時間的な異常",
    GEOGRAPHIC_ANOMALY: "地理的な異常"
  }
} as const

export const ERROR_CODES = {
  INVALID_IMAGE: "INVALID_IMAGE",
  IMAGE_TOO_LARGE: "IMAGE_TOO_LARGE",
  OCR_FAILED: "OCR_FAILED",
  FACE_MATCH_FAILED: "FACE_MATCH_FAILED",
  AUTHENTICITY_CHECK_FAILED: "AUTHENTICITY_CHECK_FAILED",
  API_KEY_INVALID: "API_KEY_INVALID",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  COMPLIANCE_VIOLATION: "COMPLIANCE_VIOLATION"
} as const

// ユーティリティ関数
export const calculateRiskLevel = (
  faceScore: number,
  authenticityResult: string,
  riskFactors: string[]
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" => {
  let riskScore = 0

  // 顔認証スコアによるリスク評価
  if (faceScore < 0.6) riskScore += 3
  else if (faceScore < 0.8) riskScore += 1

  // 真贋判定によるリスク評価
  if (authenticityResult === "INVALID") riskScore += 3
  else if (authenticityResult === "SUSPICIOUS") riskScore += 2

  // リスク要因による評価
  riskScore += riskFactors.length

  if (riskScore >= 5) return "CRITICAL"
  if (riskScore >= 3) return "HIGH"
  if (riskScore >= 1) return "MEDIUM"
  return "LOW"
}

export const validateAge = (birthDate: string, minimumAge: number = 18): boolean => {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age >= minimumAge
  }
  return age >= minimumAge
}

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const calculateConfidence = (
  ocrConfidence: number,
  faceScore: number,
  authenticityConfidence: number
): number => {
  // 重み付き平均（OCR: 40%, 顔認証: 40%, 真贋判定: 20%）
  return (ocrConfidence * 0.4 + faceScore * 0.4 + authenticityConfidence * 0.2)
} 