"use server"

import { z } from "zod"

// 座標情報の型定義
const coordinateSchema = z.object({
  x: z.number().describe("左上角のX座標"),
  y: z.number().describe("左上角のY座標"),
  width: z.number().describe("幅"),
  height: z.number().describe("高さ"),
})

// テキストブロックの型定義
const textBlockSchema = z.object({
  text: z.string().describe("抽出されたテキスト"),
  coordinates: coordinateSchema.describe("テキストブロックの座標情報"),
  confidence: z.number().min(0).max(100).describe("認識信頼度スコア（0-100）"),
  language: z.string().optional().describe("検出された言語"),
  fontSize: z.number().optional().describe("推定フォントサイズ"),
  fontStyle: z.string().optional().describe("フォントスタイル（bold, italic等）"),
})

// 拡張されたOCR結果の型定義
const enhancedOcrOutputSchema = z.object({
  language: z.string().optional().describe("検出された主要言語"),
  type: z.string().optional().describe("文書の種類"),
  extractedText: z.string().describe("抽出された全テキスト"),
  textBlocks: z.array(textBlockSchema).optional().describe("座標付きテキストブロック"),
  structuredData: z.any().optional().describe("構造化されたデータ"),
  result: z.enum(["success", "uncertain"]).optional().describe("抽出結果の信頼性"),
  overallConfidence: z.number().min(0).max(100).optional().describe("全体の認識信頼度"),
  imageInfo: z.object({
    width: z.number().optional().describe("画像の幅"),
    height: z.number().optional().describe("画像の高さ"),
    rotation: z.number().optional().describe("推定回転角度"),
    skew: z.number().optional().describe("スキュー角度"),
  }).optional(),
  processingTime: z.number().optional().describe("処理時間（ミリ秒）"),
})

const ENHANCED_MULTILINGUAL_OCR_PROMPT = `あなたはOCR結果からテキスト情報を構造化するAIです。

この画像は、何らかの文書または帳票の写真です。
以下のルールに従って、文書内容を解析・分類し、必要情報をJSON形式で出力してください。

【1】ステップ1：文書種別を自動で推定する
以下のカテゴリからもっとも近い文書種別を自動で1つ選んでください。
可能な種別：
- 身分証（例：運転免許証、マイナンバーカード、在留カードなど）
- 請求書
- 注文書
- 納品書
- 領収書／レシート
- 申込書
- 報告書
- アンケート
- 勤怠表
- 名簿
- 点検表
- 書籍のページ（文章主体）
- 不明（分類できない場合）

【2】ステップ2：文書構造を分析し、適切に構造化する
- 可能な限り、名前、日付、金額、住所、会社名、商品名、数量などの意味を特定し、それぞれのkeyに分けてJSON出力してください。
- 表が含まれる場合、各セルのテキストをそのまま配列形式で格納してください。
- 丸囲み、チェックマークも読み取って反映してください（例："consent": true）。

【3】ステップ3：出力形式
以下のテンプレート形式を参考に、該当情報のみ埋めてください。不要なkeyは省略可能です。

\`\`\`json
{
  "type": "請求書",
  "date": "2024-07-01",
  "vendor": "株式会社〇〇",
  "items": [
    { "name": "商品A", "qty": 2, "price": 1200 },
    { "name": "商品B", "qty": 1, "price": 980 }
  ],
  "total": 3380,
  "tax": 10,
  "address": "東京都新宿区...",
  "name": "山田 太郎",
  "dob": "1990-01-01",
  "consent": true,
  "extractedText": "抽出された全テキスト",
  "textBlocks": [
    {
      "text": "抽出されたテキスト",
      "coordinates": {"x": 100, "y": 50, "width": 200, "height": 30},
      "confidence": 95
    }
  ],
  "result": "success",
  "overallConfidence": 96
}
\`\`\``

export async function handleImageUpload(
  prevState: { imagePreview: string | null; ocrResult: object | null },
  formData: FormData,
) {
  const startTime = Date.now()
  
  const fireworksApiKey = process.env.FIREWORKS_API_KEY
  if (!fireworksApiKey) {
    return {
      imagePreview: null,
      ocrResult: {
        error: "APIキーが設定されていません。環境変数 FIREWORKS_API_KEY を確認してください。",
      },
    }
  }

  const file = formData.get("image") as File
  const userPrompt = formData.get("chatPrompt") as string | null

  if (!file || file.size === 0) {
    return { imagePreview: null, ocrResult: { error: "画像ファイルが提供されていません。" } }
  }

  // 画像ファイルのみを受け付ける
  if (!file.type.startsWith('image/')) {
    return { 
      imagePreview: null, 
      ocrResult: { error: "画像ファイルのみ対応しています。JPG、PNG、GIF、WEBP形式の画像をアップロードしてください。" } 
    }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const imagePreview = `data:${file.type};base64,${buffer.toString("base64")}`
  const imageUrl = imagePreview

  // 拡張された多言語OCRプロンプトを使用
  let promptText = ENHANCED_MULTILINGUAL_OCR_PROMPT
  
  if (userPrompt && userPrompt.trim().length > 0) {
    promptText += `\n\n【追加の指示】\n${userPrompt.trim()}\n\n上記の追加指示も考慮して、詳細な座標情報と認識率を含む分析を実行してください。`
  }

  const requestBody = {
    model: "accounts/fireworks/models/firesearch-ocr-v6",
    max_tokens: 8192, // より多くのトークンで詳細な結果を取得
    temperature: 0.1, // より一貫した結果のため低めに設定
    top_p: 1,
    top_k: 40,
    presence_penalty: 0,
    frequency_penalty: 0,
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
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
  }

  let ocrResult: object | null = null

  try {
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
      throw new Error(`APIリクエストが失敗しました: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content
    let extractedTextString = ""
    let structuredData = null

    if (typeof rawContent === "string") {
      extractedTextString = rawContent
      
      // JSONブロックを抽出して構造化データとして解析を試行
      const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/i) || 
                       rawContent.match(/\{[\s\S]*\}/i)
      
      if (jsonMatch) {
        try {
          structuredData = JSON.parse(jsonMatch[1] || jsonMatch[0])
          
          // 処理時間を追加
          if (structuredData && typeof structuredData === 'object') {
            structuredData.processingTime = Date.now() - startTime
          }
        } catch (parseError) {
          console.log("JSON解析に失敗しました:", parseError)
        }
      }
    } else if (typeof rawContent === "object" && rawContent !== null) {
      extractedTextString = JSON.stringify(rawContent, null, 2)
      structuredData = rawContent
      if (structuredData && typeof structuredData === 'object') {
        structuredData.processingTime = Date.now() - startTime
      }
    } else {
      extractedTextString = String(rawContent)
    }

    const finalOcrResult = {
      extractedText: extractedTextString,
      ...(structuredData && { structuredData }),
      ...(structuredData?.language && { language: structuredData.language }),
      ...(structuredData?.type && { type: structuredData.type }),
      ...(structuredData?.result && { result: structuredData.result }),
      ...(structuredData?.textBlocks && { textBlocks: structuredData.textBlocks }),
      ...(structuredData?.overallConfidence && { overallConfidence: structuredData.overallConfidence }),
      ...(structuredData?.imageInfo && { imageInfo: structuredData.imageInfo }),
      processingTime: Date.now() - startTime,
    }

    const validationResult = enhancedOcrOutputSchema.safeParse(finalOcrResult)

    ocrResult = validationResult.success
      ? validationResult.data
      : {
          error: "OCR結果の形式が期待と異なります。",
          details: validationResult.error.flatten(),
          rawApiResponse: data,
          extractedText: extractedTextString,
          processingTime: Date.now() - startTime,
        }

  } catch (error: any) {
    ocrResult = {
      error: `OCR処理中にエラーが発生しました。詳細: ${
        error instanceof Error ? error.message : String(error)
      }`,
      processingTime: Date.now() - startTime,
    }
  }

  return { imagePreview, ocrResult }
}
