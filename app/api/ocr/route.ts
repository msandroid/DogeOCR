import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// リクエストボディのバリデーション
const ocrRequestSchema = z.object({
  image: z.string().describe("Base64エンコードされた画像データ"),
  prompt: z.string().optional().describe("カスタムプロンプト（オプション）"),
  mimeType: z.string().optional().describe("画像のMIMEタイプ（例: image/jpeg）"),
})

// レスポンスの型定義
const ocrResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    extractedText: z.string().describe("抽出されたテキスト"),
    structuredData: z.any().optional().describe("構造化されたデータ"),
    documentType: z.string().describe("文書種別"),
    processingTime: z.number().describe("処理時間（ミリ秒）"),
    apiVersion: z.string().describe("APIバージョン"),
    confidence: z.number().describe("認識率"),
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
    // 開発用(dev_)のみクライアントからAuthorizationヘッダーを受け付ける
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
      // 本番用はサーバー側でAPIキーを.envから取得
      apiKeyHeader = process.env.FIREWORKS_API_KEY
      if (!apiKeyHeader) {
        return NextResponse.json({
          success: false,
          error: "サーバー側のAPIキーが設定されていません。管理者に連絡してください。",
        }, { status: 500 })
      }
      // 本番用はSupabase認証不要（必要ならここで追加）
      apiKeyInfo = { userId: 'prod_server', role: 'user', devOnly: false }
    }

    // リクエストボディの解析
    const body = await request.json()
    const validationResult = ocrRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "リクエストボディが不正です。",
        details: validationResult.error.flatten(),
      }, { status: 400 })
    }

    const { image, prompt, mimeType } = validationResult.data

    // Base64画像データの検証
    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json({
        success: false,
        error: "有効なBase64画像データが必要です。data:image/... 形式で送信してください。",
      }, { status: 400 })
    }

    // 画像サイズ（4MB）検証
    // data:image/xxx;base64,xxxx... の形式なのでカンマ以降がBase64本体
    const base64Data = image.split(',')[1]
    if (!base64Data) {
      return NextResponse.json({
        success: false,
        error: "Base64画像データが不正です。",
      }, { status: 400 })
    }
    // Base64 -> バイト数計算
    const byteLength = Math.floor(base64Data.length * 3 / 4) - (base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0)
    if (byteLength > 4 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: "画像サイズは4MB以下にしてください。",
      }, { status: 400 })
    }

    // プロンプト（demo.tsと同じ仕様に統一）
    let promptText = `この画像に写っている内容を日本語で簡潔に説明し（content_description）、主要な情報をextracted_dataとしてRFC 8259に準拠した有効なJSONデータで出力してください。例：\n\n{\n  \"content_description\": \"この画像は...\",\n  \"extracted_data\": { ... }\n}\n\n必ずcontent_descriptionとextracted_dataを含めてください。値が不明な場合はnullを使い、全体を有効なJSONとして出力してください。`
    if (prompt && prompt.trim().length > 0) {
      promptText = prompt.trim()
    }

    // Fireworks APIリクエスト（demo.tsと同じモデル・パラメータに統一）
    const requestBody = {
      model: "accounts/fireworks/models/llama4-maverick-instruct-basic",
      max_tokens: 1024,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.60,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptText,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    }

    let ocrResult = null
    try {
      const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKeyHeader}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text())
        return NextResponse.json({
          success: false,
          error: `APIリクエストが失敗しました: ${response.status} ${response.statusText}`,
          details: errorData,
        }, { status: response.status })
      }

      const data = await response.json()
      const rawContent = data.choices?.[0]?.message?.content
      const processingTime = Date.now() - startTime

      if (typeof rawContent === "string") {
        // JSONレスポンスを解析しようとする
        let parsedJson = null
        try {
          // JSONブロックを抽出（```json ... ``` の形式に対応）
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
          // 構造化されたJSONデータが得られた場合
          ocrResult = {
            extractedText: JSON.stringify(parsedJson, null, 2),
            structuredData: parsedJson,
            documentType: parsedJson.document_type || "不明",
            processingTime,
            apiVersion: "v1.0",
            confidence: parsedJson.confidence || 0.85,
          }
        } else {
          // JSON解析に失敗した場合は元のテキストを返す
          ocrResult = {
            extractedText: rawContent,
            documentType: "不明",
            processingTime,
            apiVersion: "v1.0",
            confidence: 0.85,
          }
        }
        return NextResponse.json({ success: true, data: ocrResult })
      } else {
        return NextResponse.json({
          success: false,
          error: "APIからの応答が期待された形式ではありません。",
          details: data,
        }, { status: 500 })
      }
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: `OCR処理中にエラーが発生しました: ${error.message}`,
        processingTime: Date.now() - startTime,
      }, { status: 500 })
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `OCR処理中にエラーが発生しました: ${error.message}`,
      processingTime: Date.now() - startTime,
    }, { status: 500 })
  }
}

// GET リクエストでAPI仕様を返す
export async function GET() {
  return NextResponse.json({
    name: "Doge OCR API",
    version: "v1.0",
    description: "画像からテキストを抽出するOCR API（画像は4MB以下で送信してください）",
    endpoints: {
      "/api/ocr": {
        method: "POST",
        description: "画像をOCR処理してテキストを抽出（画像は4MB以下で送信してください）",
        requestBody: {
          image: "Base64エンコードされた画像データ（data:image/... 形式、4MB以下）",
          prompt: "カスタムプロンプト（オプション）",
          mimeType: "画像のMIMEタイプ（オプション）"
        },
        responseBody: {
          success: "処理成功フラグ",
          data: {
            extractedText: "抽出されたテキスト",
            structuredData: "構造化されたデータ（JSONの場合）",
            documentType: "文書種別",
            processingTime: "処理時間（ミリ秒）",
            apiVersion: "APIバージョン",
            confidence: "認識率"
          },
          error: "エラーメッセージ（エラー時のみ）"
        }
      }
    },
    usage: {
      example: {
        curl: `curl -X POST https://your-domain.com/api/ocr \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...（4MB以下）",\n    "prompt": "この画像から名前と住所を抽出してください"\n  }'`
      }
    }
  })
} 