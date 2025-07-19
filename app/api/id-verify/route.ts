import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// リクエストボディのバリデーション
const idVerifyRequestSchema = z.object({
  documentImage: z.string().describe("身分証明書のBase64エンコードされた画像データ"),
  selfieImage: z.string().describe("セルフィーのBase64エンコードされた画像データ"),
  userInfo: z.object({
    name: z.string().optional().describe("申請者の氏名"),
    birthDate: z.string().optional().describe("生年月日（YYYY-MM-DD形式）"),
    address: z.string().optional().describe("住所"),
  }).optional().describe("申請者の基本情報"),
  sessionId: z.string().optional().describe("セッションID"),
})

// レスポンスの型定義
const idVerifyResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    documentType: z.string().describe("文書種別"),
    documentOcr: z.object({
      name: z.string().optional(),
      birthDate: z.string().optional(),
      address: z.string().optional(),
      expirationDate: z.string().optional(),
      documentNumber: z.string().optional(),
      issuingAuthority: z.string().optional(),
    }).describe("OCRで抽出された文書情報"),
    faceMatchScore: z.number().min(0).max(1).describe("顔照合スコア"),
    faceMatchResult: z.enum(["PASS", "FAIL", "REVIEW"]).describe("顔照合結果"),
    faceMatchNotes: z.string().optional().describe("顔照合の詳細説明"),
    faceQuality: z.object({
      brightness: z.number().optional(),
      blur: z.number().optional(),
      angle: z.number().optional(),
      occlusion: z.number().optional(),
    }).optional().describe("顔画像品質情報"),
    documentAuthenticity: z.enum(["VALID", "INVALID", "SUSPICIOUS"]).describe("文書真贋判定"),
    ageVerification: z.object({
      isAdult: z.boolean().describe("18歳以上かどうか"),
      age: z.number().describe("計算された年齢"),
      birthDate: z.string().describe("生年月日"),
      verificationDate: z.string().describe("確認日"),
      daysUntil18: z.number().describe("18歳になるまでの日数"),
      reason: z.string().describe("年齢確認の理由"),
    }).optional().describe("年齢確認結果"),
    finalJudgement: z.enum(["APPROVED", "REJECTED", "REVIEW_REQUIRED"]).describe("最終判定"),
    reviewType: z.enum(["AUTO", "MANUAL"]).describe("審査タイプ"),
    processingTime: z.number().describe("処理時間（ミリ秒）"),
    confidence: z.number().min(0).max(1).describe("全体の信頼度"),
    sessionId: z.string().describe("セッションID"),
    timestamp: z.string().describe("処理日時"),
  }).optional(),
  error: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // APIキー認証
    let apiKeyHeader = null
    let isDeveloper = false
    let apiKeyInfo = null
    
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer dev_')) {
      apiKeyHeader = authHeader.slice(7)
      const { isValidDevApiKey } = await import('../../../lib/api-key-store')
      const valid = await isValidDevApiKey(apiKeyHeader)
      if (!valid) {
        return NextResponse.json({
          success: false,
          error: "APIキーが無効です。",
        }, { status: 401 })
      }
      apiKeyInfo = { userId: 'dev_local', role: 'developer', devOnly: true, host: require('os').hostname() }
      isDeveloper = true
    } else {
      apiKeyHeader = process.env.FIREWORKS_API_KEY
      if (!apiKeyHeader) {
        return NextResponse.json({
          success: false,
          error: "サーバー側のAPIキーが設定されていません。管理者に連絡してください。",
        }, { status: 500 })
      }
      apiKeyInfo = { userId: 'prod_server', role: 'user', devOnly: false }
    }

    // リクエストの解析（JSONまたはFormData）
    let documentImage: string
    let selfieImage: string
    let userInfo: any
    let sessionId: string

    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      // FormDataの場合（モバイルからのリクエスト）
      const formData = await request.formData()
      const documentFile = formData.get('documentImage') as File
      const faceFile = formData.get('faceImage') as File
      sessionId = formData.get('sessionId') as string

      if (!documentFile || !faceFile) {
        return NextResponse.json({
          success: false,
          error: "身分証明書と顔写真の両方が必要です。",
        }, { status: 400 })
      }

      // FileをBase64に変換
      documentImage = await fileToBase64(documentFile)
      selfieImage = await fileToBase64(faceFile)
      userInfo = undefined
    } else {
      // JSONの場合（従来のAPI）
      const body = await request.json()
      const validationResult = idVerifyRequestSchema.safeParse(body)
      
      if (!validationResult.success) {
        return NextResponse.json({
          success: false,
          error: "リクエストボディが不正です。",
          details: validationResult.error.flatten(),
        }, { status: 400 })
      }

      const validatedData = validationResult.data
      documentImage = validatedData.documentImage
      selfieImage = validatedData.selfieImage
      userInfo = validatedData.userInfo
      sessionId = validatedData.sessionId
    }

    // Base64画像データの検証
    if (!documentImage || !documentImage.startsWith('data:image/')) {
      return NextResponse.json({
        success: false,
        error: "有効な身分証明書のBase64画像データが必要です。",
      }, { status: 400 })
    }

    if (!selfieImage || !selfieImage.startsWith('data:image/')) {
      return NextResponse.json({
        success: false,
        error: "有効なセルフィーのBase64画像データが必要です。",
      }, { status: 400 })
    }

    // 画像サイズ検証（4MB）
    const documentBase64 = documentImage.split(',')[1]
    const selfieBase64 = selfieImage.split(',')[1]
    
    if (!documentBase64 || !selfieBase64) {
      return NextResponse.json({
        success: false,
        error: "Base64画像データが不正です。",
      }, { status: 400 })
    }

    const documentByteLength = Math.floor(documentBase64.length * 3 / 4) - (documentBase64.endsWith('==') ? 2 : documentBase64.endsWith('=') ? 1 : 0)
    const selfieByteLength = Math.floor(selfieBase64.length * 3 / 4) - (selfieBase64.endsWith('==') ? 2 : selfieBase64.endsWith('=') ? 1 : 0)
    
    if (documentByteLength > 4 * 1024 * 1024 || selfieByteLength > 4 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: "画像サイズは4MB以下にしてください。",
      }, { status: 400 })
    }

    // セッションIDの生成
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 1. 身分証明書のOCR処理
    const documentOcrResult = await processDocumentOCR(documentImage, apiKeyHeader)
    if (!documentOcrResult.success) {
      return NextResponse.json({
        success: false,
        error: `身分証明書のOCR処理に失敗しました: ${documentOcrResult.error}`,
      }, { status: 500 })
    }

    // 2. 顔認証処理
    const faceMatchResult = await processFaceMatching(documentImage, selfieImage, apiKeyHeader)
    if (!faceMatchResult.success) {
      return NextResponse.json({
        success: false,
        error: `顔認証処理に失敗しました: ${faceMatchResult.error}`,
      }, { status: 500 })
    }

    // 3. 真贋判定処理
    const authenticityResult = await processDocumentAuthenticity(documentImage, apiKeyHeader)
    if (!authenticityResult.success) {
      return NextResponse.json({
        success: false,
        error: `真贋判定処理に失敗しました: ${authenticityResult.error}`,
      }, { status: 500 })
    }

    // 4. 年齢確認処理
    const { verifyAgeFromOCR } = await import('../../../lib/age-verification')
    const ageVerification = verifyAgeFromOCR(documentOcrResult.data?.extractedData)

    // 5. 最終判定ロジック（年齢確認を含む）
    const finalJudgement = await determineFinalJudgement(
      documentOcrResult.data,
      faceMatchResult.data,
      authenticityResult.data,
      userInfo,
      ageVerification
    )

    const processingTime = Date.now() - startTime

    const result = {
      documentType: documentOcrResult.data?.documentType || "不明",
      documentOcr: documentOcrResult.data?.extractedData || {},
      faceMatchScore: faceMatchResult.data?.score || 0,
      faceMatchResult: faceMatchResult.data?.result || "FAIL",
      faceMatchNotes: faceMatchResult.data?.notes,
      faceQuality: faceMatchResult.data?.faceQuality,
      documentAuthenticity: authenticityResult.data?.result || "INVALID",
      ageVerification: ageVerification ? {
        isAdult: ageVerification.isAdult,
        age: ageVerification.age,
        birthDate: ageVerification.birthDate,
        verificationDate: ageVerification.verificationDate,
        daysUntil18: ageVerification.daysUntil18,
        reason: ageVerification.reason,
      } : undefined,
      finalJudgement: finalJudgement.judgement,
      reviewType: finalJudgement.reviewType,
      reason: finalJudgement.reason,
      processingTime,
      confidence: calculateOverallConfidence(
        documentOcrResult.data?.confidence || 0,
        faceMatchResult.data?.score || 0,
        authenticityResult.data?.confidence || 0
      ),
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
    }

    // セッションIDが指定されている場合、セッション状態を更新
    if (sessionId) {
      try {
        const { updateSession } = await import('../../../lib/session-store')
        updateSession(sessionId, {
          status: "completed",
          result: result
        })
      } catch (error) {
        console.error("セッション更新エラー:", error)
      }
    }

    return NextResponse.json({ success: true, data: result })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `ID認証処理中にエラーが発生しました: ${error.message}`,
      processingTime: Date.now() - startTime,
    }, { status: 500 })
  }
}

// FileをBase64に変換するヘルパー関数
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 身分証明書のOCR処理
async function processDocumentOCR(documentImage: string, apiKey: string) {
  const prompt = `この身分証明書画像から以下の情報を抽出してください：
- 氏名
- 生年月日
- 住所
- 有効期限
- 文書番号
- 発行機関
- 文書種別（運転免許証、マイナンバーカード、パスポート等）

以下のJSON形式で出力してください：
{
  "document_type": "文書種別",
  "name": "氏名",
  "birth_date": "YYYY-MM-DD",
  "address": "住所",
  "expiration_date": "YYYY-MM-DD",
  "document_number": "文書番号",
  "issuing_authority": "発行機関",
  "confidence": 0.95
}`

  const requestBody = {
    model: "accounts/fireworks/models/llama4-maverick-instruct-basic",
    max_tokens: 1024,
    top_p: 1,
    top_k: 40,
    presence_penalty: 0,
    frequency_penalty: 0,
    temperature: 0.30,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: documentImage,
            },
          },
        ],
      },
    ],
  }

  try {
    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      return { success: false, error: `OCR API エラー: ${response.status}` }
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content

    if (typeof rawContent === "string") {
      let parsedJson = null
      try {
        const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                         rawContent.match(/```\s*([\s\S]*?)\s*```/) ||
                         [null, rawContent]
        if (jsonMatch && jsonMatch[1]) {
          parsedJson = JSON.parse(jsonMatch[1].trim())
        } else {
          parsedJson = JSON.parse(rawContent.trim())
        }
      } catch (jsonError) {
        parsedJson = null
      }

      if (parsedJson) {
        return {
          success: true,
          data: {
            documentType: parsedJson.document_type || "不明",
            extractedData: parsedJson,
            confidence: parsedJson.confidence || 0.85,
          }
        }
      } else {
        return { success: false, error: "OCR結果の解析に失敗しました" }
      }
    } else {
      return { success: false, error: "OCR APIからの応答が不正です" }
    }
  } catch (error: any) {
    return { success: false, error: `OCR処理エラー: ${error.message}` }
  }
}

// Vison AI APIを使用した顔認証処理
async function processFaceMatching(documentImage: string, selfieImage: string, apiKey: string) {
  try {
    const { initializeFaceRecognitionService, faceRecognitionService } = await import('../../../lib/face-recognition')
    
    // 顔認証サービスを初期化
    if (!faceRecognitionService) {
      initializeFaceRecognitionService(apiKey)
    }
    
    // Vison AI APIを使用した顔照合実行
    const faceMatchResult = await faceRecognitionService!.compareFaces(documentImage, selfieImage)
    
    return {
      success: true,
      data: {
        score: faceMatchResult.score,
        result: faceMatchResult.result,
        confidence: faceMatchResult.confidence,
        notes: faceMatchResult.notes,
        faceQuality: faceMatchResult.faceQuality
      }
    }
  } catch (error: any) {
    console.error('Face recognition error:', error)
    return { 
      success: false, 
      error: `顔認証処理エラー: ${error.message}` 
    }
  }
}

// 真贋判定処理
async function processDocumentAuthenticity(documentImage: string, apiKey: string) {
  const prompt = `この身分証明書画像の真贋を判定してください。

以下の点をチェックしてください：
- 画像の加工・改ざんの有無
- セキュリティパターンの整合性
- フォントの一貫性
- 背景の歪みや不自然さ
- 色の不自然な変化
- エッジの不自然さ

以下のJSON形式で出力してください：
{
  "result": "VALID",
  "confidence": 0.95,
  "risk_factors": [],
  "notes": "文書は本物と判定"
}

判定基準：
- 明らかに本物: VALID
- 疑わしい要素あり: SUSPICIOUS
- 明らかに偽造: INVALID`

  const requestBody = {
    model: "accounts/fireworks/models/llama4-maverick-instruct-basic",
    max_tokens: 512,
    top_p: 1,
    top_k: 40,
    presence_penalty: 0,
    frequency_penalty: 0,
    temperature: 0.20,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: documentImage,
            },
          },
        ],
      },
    ],
  }

  try {
    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      return { success: false, error: `真贋判定API エラー: ${response.status}` }
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content

    if (typeof rawContent === "string") {
      let parsedJson = null
      try {
        const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                         rawContent.match(/```\s*([\s\S]*?)\s*```/) ||
                         [null, rawContent]
        if (jsonMatch && jsonMatch[1]) {
          parsedJson = JSON.parse(jsonMatch[1].trim())
        } else {
          parsedJson = JSON.parse(rawContent.trim())
        }
      } catch (jsonError) {
        parsedJson = null
      }

      if (parsedJson) {
        return {
          success: true,
          data: {
            result: parsedJson.result || "SUSPICIOUS",
            confidence: parsedJson.confidence || 0.85,
            riskFactors: parsedJson.risk_factors || [],
          }
        }
      } else {
        return { success: false, error: "真贋判定結果の解析に失敗しました" }
      }
    } else {
      return { success: false, error: "真贋判定APIからの応答が不正です" }
    }
  } catch (error: any) {
    return { success: false, error: `真贋判定処理エラー: ${error.message}` }
  }
}

// 最終判定ロジック（動的設定対応）
async function determineFinalJudgement(
  ocrResult: any,
  faceMatchResult: any,
  authenticityResult: any,
  userInfo?: any,
  ageVerification?: any
) {
  const faceScore = faceMatchResult.score
  const authenticityResult_ = authenticityResult.result
  const ocrConfidence = ocrResult.confidence || 0.85

  // 動的設定を読み込み
  const { loadIdVerifySettings, determineApprovalWithSettings } = await import('../../../lib/id-verify-settings')
  const settings = await loadIdVerifySettings()

  // 年齢確認結果を使用
  let age = 0
  let isAdult = false
  if (ageVerification) {
    age = ageVerification.age
    isAdult = ageVerification.isAdult
  } else if (ocrResult.extractedData?.birth_date) {
    // フォールバック: 従来の年齢計算
    const birthDate = new Date(ocrResult.extractedData.birth_date)
    const today = new Date()
    age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age-- // まだ誕生日が来ていない場合
    }
    
    // 18歳以上かどうかを判定
    const eighteenthBirthday = new Date(birthDate)
    eighteenthBirthday.setFullYear(birthDate.getFullYear() + 18)
    isAdult = today >= eighteenthBirthday
  }

  // ユーザー情報との照合
  let nameMatch: boolean | undefined
  let birthDateMatch: boolean | undefined
  let addressMatch: boolean | undefined

  if (userInfo) {
    const ocrName = ocrResult.extractedData?.name
    const ocrBirthDate = ocrResult.extractedData?.birth_date
    const ocrAddress = ocrResult.extractedData?.address
    
    if (userInfo.name && ocrName) {
      nameMatch = namesMatch(userInfo.name, ocrName)
    }
    if (userInfo.birthDate && ocrBirthDate) {
      birthDateMatch = userInfo.birthDate === ocrBirthDate
    }
    if (userInfo.address && ocrAddress) {
      addressMatch = userInfo.address === ocrAddress
    }
  }

  // 年齢確認による判定の調整
  let finalJudgement = determineApprovalWithSettings(
    settings,
    faceScore,
    authenticityResult_,
    ocrConfidence,
    age,
    nameMatch,
    birthDateMatch,
    addressMatch
  )

  // 未成年の場合は自動的にREJECTED
  if (!isAdult) {
    finalJudgement = {
      judgement: "REJECTED" as const,
      reviewType: "AUTO" as const,
      reason: `未成年のため認証を拒否しました。年齢: ${age}歳`
    }
  }

  return { 
    judgement: finalJudgement.judgement, 
    reviewType: finalJudgement.reviewType,
    reason: finalJudgement.reason
  }
}

// 名前の照合（簡易版）
function namesMatch(name1: string, name2: string): boolean {
  const normalize = (name: string) => name.toLowerCase().replace(/\s+/g, '').replace(/[　\s]/g, '')
  return normalize(name1) === normalize(name2)
}

// 全体の信頼度計算
function calculateOverallConfidence(
  ocrConfidence: number,
  faceScore: number,
  authenticityConfidence: number
): number {
  // 重み付き平均（OCR: 40%, 顔認証: 40%, 真贋判定: 20%）
  return (ocrConfidence * 0.4 + faceScore * 0.4 + authenticityConfidence * 0.2)
}

// GET リクエストでAPI仕様を返す
export async function GET() {
  return NextResponse.json({
    name: "Doge ID Verify API",
    version: "v1.0",
    description: "日本の犯罪収益移転防止法に準拠したeKYCホ方式の身分証明書認証API",
    endpoints: {
      "/api/id-verify": {
        method: "POST",
        description: "身分証明書とセルフィーによる本人確認（画像は4MB以下で送信してください）",
        requestBody: {
          documentImage: "身分証明書のBase64エンコードされた画像データ（data:image/... 形式、4MB以下）",
          selfieImage: "セルフィーのBase64エンコードされた画像データ（data:image/... 形式、4MB以下）",
          userInfo: "申請者の基本情報（オプション）",
          sessionId: "セッションID（オプション）"
        },
        responseBody: {
          success: "処理成功フラグ",
          data: {
            documentType: "文書種別",
            documentOcr: "OCRで抽出された文書情報",
            faceMatchScore: "顔照合スコア（0-1）",
            faceMatchResult: "顔照合結果（PASS/FAIL/REVIEW）",
            documentAuthenticity: "文書真贋判定（VALID/INVALID/SUSPICIOUS）",
            finalJudgement: "最終判定（APPROVED/REJECTED/REVIEW_REQUIRED）",
            reviewType: "審査タイプ（AUTO/MANUAL）",
            processingTime: "処理時間（ミリ秒）",
            confidence: "全体の信頼度（0-1）",
            sessionId: "セッションID",
            timestamp: "処理日時"
          },
          error: "エラーメッセージ（エラー時のみ）"
        }
      }
    },
    compliance: {
      standard: "犯罪収益移転防止法",
      country: "日本",
      method: "eKYCホ方式",
      dataRetention: "7年間"
    },
    usage: {
      example: {
        curl: `curl -X POST https://your-domain.com/api/id-verify \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "documentImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",\n    "selfieImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",\n    "userInfo": {\n      "name": "山田 太郎",\n      "birthDate": "1990-01-01",\n      "address": "東京都新宿区..."\n    }\n  }'`
      }
    }
  })
} 