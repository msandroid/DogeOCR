export interface FaceMatchResult {
  score: number
  result: 'PASS' | 'FAIL' | 'REVIEW'
  confidence: number
  notes?: string
  faceQuality?: {
    brightness?: number
    blur?: number
    angle?: number
    occlusion?: number
  }
}

export interface FaceDetectionResult {
  success: boolean
  faces: Array<{
    bbox: [number, number, number, number]
    confidence: number
    landmarks?: Array<[number, number]>
  }>
  error?: string
}

/**
 * Vison AI APIを使用した顔照合機能
 */
export class FaceRecognitionService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * 身分証明書とセルフィーの顔照合を実行
   */
  async compareFaces(
    documentImage: string,
    selfieImage: string
  ): Promise<FaceMatchResult> {
    try {
      const prompt = `以下の2つの画像を比較して顔認証を行ってください：

1. 身分証明書内の顔写真
2. セルフィー画像

以下の点を評価してください：
- 顔の類似度（0.0-1.0のスコア）
- 同一人物かどうかの判定
- 顔の角度、表情、照明条件の違いを考慮
- 画像品質の評価（明度、鮮明度、角度、遮蔽）

以下のJSON形式で出力してください：
{
  "score": 0.92,
  "result": "PASS",
  "confidence": 0.95,
  "notes": "同一人物と判定",
  "face_quality": {
    "brightness": 0.7,
    "blur": 0.2,
    "angle": 0.1,
    "occlusion": 0.1
  }
}

判定基準：
- スコア >= 0.8: PASS
- スコア 0.6-0.8: REVIEW
- スコア < 0.6: FAIL

画像品質評価：
- brightness: 0-1（明度）
- blur: 0-1（ぼやけ、低いほど鮮明）
- angle: 0-1（顔の角度）
- occlusion: 0-1（遮蔽、低いほど顔が見えている）`

      const requestBody = {
        model: "accounts/fireworks/models/llama4-maverick-instruct-basic",
        max_tokens: 1024,
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
              {
                type: "image_url",
                image_url: {
                  url: selfieImage,
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
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Face recognition API error: ${response.status}`)
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
            score: parsedJson.score || 0.0,
            result: parsedJson.result || "FAIL",
            confidence: parsedJson.confidence || 0.85,
            notes: parsedJson.notes,
            faceQuality: parsedJson.face_quality
          }
        } else {
          return {
            score: 0,
            result: "FAIL",
            confidence: 0,
            notes: "顔認証結果の解析に失敗しました"
          }
        }
      } else {
        return {
          score: 0,
          result: "FAIL",
          confidence: 0,
          notes: "顔認証APIからの応答が不正です"
        }
      }

    } catch (error: any) {
      console.error('Face recognition error:', error)
      return {
        score: 0,
        result: "FAIL",
        confidence: 0,
        notes: `顔認証処理エラー: ${error.message}`
      }
    }
  }

  /**
   * 顔検出を実行（簡易版）
   */
  private async detectFaces(imagePath: string): Promise<FaceDetectionResult> {
    // 実際の実装では、より詳細な顔検出が必要
    // ここでは簡易的な実装
    return {
      success: true,
      faces: [{
        bbox: [0, 0, 100, 100],
        confidence: 0.9
      }]
    }
  }

  /**
   * 顔画像品質の評価（簡易版）
   */
  private async assessFaceQuality(
    documentPath: string,
    selfiePath: string
  ): Promise<FaceMatchResult['faceQuality']> {
    // 実際の実装では、OpenCVやTensorFlow.jsを使用した詳細な分析
    // ここでは簡易的な推定値を返す
    return {
      brightness: 0.7, // 0-1の範囲
      blur: 0.2, // 0-1の範囲（低いほど鮮明）
      angle: 0.1, // ラジアン単位
      occlusion: 0.1 // 0-1の範囲（低いほど顔が隠れていない）
    }
  }
}

// シングルトンインスタンス（APIキーは後で設定）
export let faceRecognitionService: FaceRecognitionService | null = null

export function initializeFaceRecognitionService(apiKey: string) {
  faceRecognitionService = new FaceRecognitionService(apiKey)
} 