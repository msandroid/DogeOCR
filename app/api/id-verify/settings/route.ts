import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { 
  loadIdVerifySettings, 
  updateIdVerifySettings, 
  saveIdVerifySettings,
  defaultIdVerifySettings,
  idVerifySettingsSchema 
} from "../../../../lib/id-verify-settings"

// 設定更新リクエストのスキーマ
const updateSettingsSchema = z.object({
  settings: z.object({
    faceMatchThresholds: z.object({
      approved: z.number().min(0).max(1).optional(),
      rejected: z.number().min(0).max(1).optional(),
      reviewRequired: z.number().min(0).max(1).optional(),
    }).optional(),
    documentAuthenticity: z.object({
      validRequired: z.boolean().optional(),
      suspiciousAllowed: z.boolean().optional(),
    }).optional(),
    ageRestrictions: z.object({
      minimumAge: z.number().min(0).optional(),
      maximumAge: z.number().min(0).optional(),
    }).optional(),
    ocrConfidence: z.object({
      minimumConfidence: z.number().min(0).max(1).optional(),
    }).optional(),
    additionalConditions: z.object({
      requireNameMatch: z.boolean().optional(),
      requireBirthDateMatch: z.boolean().optional(),
      requireAddressMatch: z.boolean().optional(),
      allowManualReview: z.boolean().optional(),
    }).optional(),
  }),
  updatedBy: z.string(),
  description: z.string().optional(),
})

// GET: 現在の設定を取得
export async function GET() {
  try {
    const settings = await loadIdVerifySettings()
    
    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `設定の取得に失敗しました: ${error.message}`,
    }, { status: 500 })
  }
}

// PUT: 設定を更新
export async function PUT(request: NextRequest) {
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
    const validationResult = updateSettingsSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "リクエストボディが不正です",
        details: validationResult.error.flatten(),
      }, { status: 400 })
    }

    const { settings: updates, updatedBy, description } = validationResult.data

    // 設定を更新
    const updatedSettings = await updateIdVerifySettings(updates, updatedBy)
    
    // 説明を更新
    if (description) {
      updatedSettings.metadata.description = description
      await saveIdVerifySettings(updatedSettings)
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: "設定が正常に更新されました",
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `設定の更新に失敗しました: ${error.message}`,
    }, { status: 500 })
  }
}

// POST: 設定をリセット
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
    const { reset = false, updatedBy } = body

    if (reset) {
      // デフォルト設定にリセット
      const resetSettings = {
        ...defaultIdVerifySettings,
        metadata: {
          ...defaultIdVerifySettings.metadata,
          lastUpdated: new Date().toISOString(),
          updatedBy: updatedBy || "system",
          description: "デフォルト設定にリセット",
        },
      }
      
      await saveIdVerifySettings(resetSettings)

      return NextResponse.json({
        success: true,
        data: resetSettings,
        message: "設定がデフォルトにリセットされました",
      })
    }

    return NextResponse.json({
      success: false,
      error: "無効なリクエストです",
    }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `設定のリセットに失敗しました: ${error.message}`,
    }, { status: 500 })
  }
} 