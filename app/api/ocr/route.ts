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
    // APIキーの確認
    const fireworksApiKey = process.env.FIREWORKS_API_KEY
    if (!fireworksApiKey) {
      return NextResponse.json({
        success: false,
        error: "APIキーが設定されていません。環境変数 FIREWORKS_API_KEY を確認してください。",
      }, { status: 500 })
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

    // プロンプトの設定
    let promptText = prompt || `この画像から文字を読み取り、以下の形式で厳密にJSON形式で出力してください：

{
  "document_type": "文書の種類（例：運転免許証、パスポート、身分証明書など）",
  "content_description": "この文書の内容を日本語で簡潔に説明してください",
  "extracted_data": {
    "FN": "名前",
    "LN": "姓",
    "license_number": "免許証番号",
    "address": "住所",
    "date_of_birth": "生年月日",
    "SEX": "性別",
    "issue_date": "発行日",
    "expiration_date": "有効期限",
    "class": "免許の種類",
    "restrictions": "制限事項",
    "state": "発行州",
    "country": "国"
  },
  "confidence": 0.95,
}

必ず有効なJSON形式で出力してください。値が不明な場合は null を使用してください。`

    // Fireworks APIへのリクエスト
    const requestBody = {
      model: "accounts/fireworks/models/firesearch-ocr-v6",
      max_tokens: 1024,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.6,
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

    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${fireworksApiKey}`,
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
      // JSONレスポンスを解析
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
        // 構造化されたJSONデータが得られた場合
        return NextResponse.json({
          success: true,
          data: {
            extractedText: JSON.stringify(parsedJson, null, 2),
            structuredData: parsedJson,
            documentType: parsedJson.document_type || "不明",
            processingTime,
            apiVersion: "v1.0",
            confidence: parsedJson.confidence || 0.85,
          },
        })
      } else {
        // JSON解析に失敗した場合は元のテキストを返す
        return NextResponse.json({
          success: true,
          data: {
            extractedText: rawContent,
            documentType: "不明",
            processingTime,
            apiVersion: "v1.0",
            confidence: 0.85,
          },
        })
      }
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
}

// GET リクエストでAPI仕様を返す
export async function GET() {
  return NextResponse.json({
    name: "Doge OCR API",
    version: "v1.0",
    description: "画像からテキストを抽出するOCR API",
    endpoints: {
      "/api/ocr": {
        method: "POST",
        description: "画像をOCR処理してテキストを抽出",
        requestBody: {
          image: "Base64エンコードされた画像データ（data:image/... 形式）",
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
        curl: `curl -X POST https://your-domain.com/api/ocr \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "prompt": "この画像から名前と住所を抽出してください"
  }'`
      }
    }
  })
} 