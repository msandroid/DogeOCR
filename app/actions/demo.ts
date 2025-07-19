"use server"

import { z } from "zod"

// 基本的なOCR結果の型定義
const basicOcrOutputSchema = z.object({
  extractedText: z.string().describe("抽出されたテキスト"),
  processingTime: z.number().describe("処理時間（ミリ秒）"),
  apiVersion: z.string().default("v1.0"),
  confidence: z.number().min(0).max(1).optional().describe("認識率"),
})

export async function handleImageUpload(
  prevState: { imagePreview: string | null; ocrResult: any },
  formData: FormData,
): Promise<{ imagePreview: string | null; ocrResult: any }> {
  const startTime = Date.now()
  
  const fireworksApiKey = process.env.FIREWORKS_API_KEY
  if (!fireworksApiKey) {
    return {
      imagePreview: null,
      ocrResult: {
        error: "APIキーが設定されていません。環境変数 FIREWORKS_API_KEY を確認してください。",
        processingTime: Date.now() - startTime,
      },
    }
  }

  const file = formData.get("image") as File
  const userPrompt = formData.get("chatPrompt") as string | null

  if (!file || file.size === 0) {
    return { 
      imagePreview: null, 
      ocrResult: { 
        error: "画像ファイルが提供されていません。",
        processingTime: Date.now() - startTime,
      } 
    }
  }

  // 画像ファイルのみを受け付ける
  if (!file.type.startsWith('image/')) {
    return { 
      imagePreview: null, 
      ocrResult: { 
        error: "画像ファイルのみ対応しています。JPG、PNG、GIF、WEBP形式の画像をアップロードしてください。",
        processingTime: Date.now() - startTime,
      } 
    }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const imagePreview = `data:${file.type};base64,${buffer.toString("base64")}`

  // プロンプト
  let promptText = `この画像に写っている内容を説明し（content_description）、主要な情報をextracted_dataとしてRFC 8259に準拠した有効なJSONデータで出力してください。例：\n\n{\n  \"content_description\": \"この画像は...\",\n  \"extracted_data\": { ... }\n}\n\n必ずcontent_descriptionとextracted_dataを含めてください。値が不明な場合はnullを使い、全体を有効なJSONとして出力してください。`

  // チャット欄の入力があれば追加プロンプトとして使用
  if (userPrompt && userPrompt.trim().length > 0) {
    promptText = userPrompt.trim()
  }

  // 公式APIの仕様に合わせたリクエストボディ
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
              url: imagePreview,
            },
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
        // JSON解析に失敗した場合は元のテキストを返す
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
        const finalOcrResult = {
          extractedText: rawContent,
          documentType: "不明",
          processingTime,
          apiVersion: "v1.0",
          confidence: 0.85,
        }

        const validationResult = basicOcrOutputSchema.safeParse(finalOcrResult)
        
        ocrResult = validationResult.success
          ? validationResult.data
          : {
              error: "OCR結果の形式が期待と異なります。",
              details: validationResult.error.flatten(),
              extractedText: rawContent,
              processingTime,
            }
      }
    } else {
      ocrResult = {
        error: "APIからの応答が期待された形式ではありません。",
        processingTime,
        rawApiResponse: data,
      }
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
