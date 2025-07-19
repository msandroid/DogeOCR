"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  ArrowLeft,
  Download,
  Share2,
  RefreshCw
} from "lucide-react"
import { VerificationResultDisplay } from "@/components/verification-result-display"
import { useToast } from "@/hooks/use-toast"

interface VerificationResult {
  documentType: string
  documentOcr: {
    name?: string
    birthDate?: string
    address?: string
    expirationDate?: string
    documentNumber?: string
    issuingAuthority?: string
  }
  faceMatchScore: number
  faceMatchResult: "PASS" | "FAIL" | "REVIEW"
  faceMatchNotes?: string
  faceQuality?: {
    brightness?: number
    blur?: number
    angle?: number
    occlusion?: number
  }
  documentAuthenticity: "VALID" | "INVALID" | "SUSPICIOUS"
  ageVerification?: {
    isAdult: boolean
    age: number
    birthDate: string
    verificationDate: string
    daysUntil18: number
    reason: string
  }
  finalJudgement: "APPROVED" | "REJECTED" | "REVIEW_REQUIRED"
  reviewType: "AUTO" | "MANUAL"
  processingTime: number
  confidence: number
  sessionId: string
  timestamp: string
  reason?: string
}

export default function VerificationResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const sessionId = searchParams.get('sessionId')
    const resultData = searchParams.get('result')

    if (sessionId && resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData))
        setResult(parsedResult)
        setLoading(false)
      } catch (error) {
        setError("認証結果の読み込みに失敗しました")
        setLoading(false)
      }
    } else if (sessionId) {
      // セッションIDから結果を取得
      fetchResultFromSession(sessionId)
    } else {
      setError("認証結果が見つかりません")
      setLoading(false)
    }
  }, [searchParams])

  const fetchResultFromSession = async (sessionId: string) => {
    try {
      // eKYCセッションから結果を取得
      let response = await fetch(`/api/ekyc/session/${sessionId}`)
      let data = await response.json()

      if (!data.success) {
        // ID verifyセッションから結果を取得
        response = await fetch(`/api/id-verify/session/${sessionId}`)
        data = await response.json()
      }

      if (data.success && data.session?.result) {
        setResult(data.session.result)
      } else {
        setError("認証結果が見つかりません")
      }
    } catch (error) {
      setError("認証結果の取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadResult = () => {
    if (!result) return

    const resultText = `
認証結果レポート
================

最終判定: ${result.finalJudgement}
処理時間: ${result.processingTime}ms
信頼度: ${(result.confidence * 100).toFixed(1)}%
セッションID: ${result.sessionId}
処理日時: ${new Date(result.timestamp).toLocaleString('ja-JP')}

判定理由: ${result.reason || 'なし'}

文書情報:
- 文書種別: ${result.documentType}
${result.documentOcr.name ? `- 氏名: ${result.documentOcr.name}` : ''}
${result.documentOcr.birthDate ? `- 生年月日: ${result.documentOcr.birthDate}` : ''}
${result.documentOcr.address ? `- 住所: ${result.documentOcr.address}` : ''}

認証結果:
- 顔認証: ${result.faceMatchResult} (${(result.faceMatchScore * 100).toFixed(1)}%)
- 文書真贋判定: ${result.documentAuthenticity}
- 審査タイプ: ${result.reviewType}

${result.ageVerification ? `
年齢確認:
- 年齢: ${result.ageVerification.age}歳
- 成年判定: ${result.ageVerification.isAdult ? '成年' : '未成年'}
- 生年月日: ${result.ageVerification.birthDate}
- 確認日: ${result.ageVerification.verificationDate}
- 判定理由: ${result.ageVerification.reason}
` : ''}
    `.trim()

    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `verification-result-${result.sessionId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "ダウンロード完了",
      description: "認証結果をダウンロードしました。",
    })
  }

  const handleShareResult = async () => {
    if (!result) return

    const shareData = {
      title: "認証結果",
      text: `認証結果: ${result.finalJudgement} - 信頼度: ${(result.confidence * 100).toFixed(1)}%`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast({
          title: "共有完了",
          description: "認証結果を共有しました。",
        })
      } catch (error) {
        console.log('共有がキャンセルされました')
      }
    } else {
      // フォールバック: URLをクリップボードにコピー
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "URLをコピーしました",
        description: "認証結果のURLをクリップボードにコピーしました。",
      })
    }
  }

  const handleNewVerification = () => {
    router.push('/ekyc')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">認証結果を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              エラー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "認証結果が見つかりません"}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleBackToHome} variant="outline" className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
              <Button onClick={handleNewVerification} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                新しい認証
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleBackToHome}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadResult}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                ダウンロード
              </Button>
              <Button
                onClick={handleShareResult}
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                共有
              </Button>
            </div>
          </div>

          {/* 認証結果表示 */}
          <VerificationResultDisplay result={result} />

          {/* アクションボタン */}
          <div className="mt-8 flex gap-4 justify-center">
            <Button
              onClick={handleNewVerification}
              className="px-8"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              新しい認証を開始
            </Button>
            <Button
              onClick={handleBackToHome}
              variant="outline"
              className="px-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 