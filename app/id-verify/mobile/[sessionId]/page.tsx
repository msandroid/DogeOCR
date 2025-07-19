"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle, Loader2, Shield, Camera, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CameraCapture from "@/components/camera-capture"

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
  finalJudgement: "APPROVED" | "REJECTED" | "REVIEW_REQUIRED"
  reviewType: "AUTO" | "MANUAL"
  processingTime: number
  confidence: number
  sessionId: string
  timestamp: string
  reason?: string
}

interface SessionInfo {
  sessionId: string
  status: "pending" | "active" | "completed" | "expired"
  createdAt: string
  expiresAt: string
}

interface UserInfo {
  name: string
  birthDate: string
  address: string
}

export default function MobileIDVerifyPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter()
  const [step, setStep] = useState<"loading" | "capture" | "processing" | "result">("loading")
  const [documentImage, setDocumentImage] = useState<string>("")
  const [selfieImage, setSelfieImage] = useState<string>("")
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    birthDate: "",
    address: ""
  })
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>("")
  
  const { toast } = useToast()

  // セッション情報を取得
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`/api/id-verify/session/${params.sessionId}`, {
          method: "GET",
        })

        const data = await response.json()

        if (data.success) {
          const session = data.session
          setSessionInfo(session)
          
          if (session.status === "expired") {
            setError("セッションが期限切れです")
            setStep("loading")
          } else if (session.status === "completed") {
            setResult(session.result)
            setStep("result")
          } else {
            setStep("capture")
          }
        } else {
          setError(data.error || "セッションが見つかりません")
          setStep("loading")
        }
      } catch (error: any) {
        setError("セッション情報の取得に失敗しました")
        setStep("loading")
      }
    }

    checkSession()
  }, [params.sessionId])

  const handleDocumentCapture = (imageData: string) => {
    setDocumentImage(imageData)
    toast({
      title: "身分証明書撮影完了",
      description: "身分証明書の撮影が完了しました。",
    })
  }

  const handleSelfieCapture = (imageData: string) => {
    setSelfieImage(imageData)
    toast({
      title: "セルフィー撮影完了",
      description: "セルフィーの撮影が完了しました。",
    })
  }

  const handleSubmit = async () => {
    if (!documentImage || !selfieImage) {
      toast({
        title: "エラー",
        description: "身分証明書とセルフィーの両方の撮影が必要です。",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    setStep("processing")
    setProgress(0)

    // プログレスバーのシミュレーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      const response = await fetch("/api/id-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentImage,
          selfieImage,
          sessionId: params.sessionId,
          userInfo: userInfo.name || userInfo.birthDate || userInfo.address ? userInfo : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        setProgress(100)
        setStep("result")
        toast({
          title: "認証完了",
          description: "身分証明書の認証が完了しました。",
        })
        
        // 認証完了後に結果ページに遷移
        const resultData = encodeURIComponent(JSON.stringify(data.data))
        const resultUrl = `/verification-result?sessionId=${data.data.sessionId}&result=${resultData}`
        router.push(resultUrl)
      } else {
        throw new Error(data.error || "認証に失敗しました")
      }
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message || "認証処理中にエラーが発生しました。",
        variant: "destructive"
      })
      setStep("capture")
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
      case "VALID":
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "FAIL":
      case "INVALID":
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS":
      case "VALID":
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "FAIL":
      case "INVALID":
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            {error ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button
                  onClick={() => window.close()}
                  variant="outline"
                >
                  閉じる
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">セッションを確認中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.close()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            閉じる
          </Button>
          
          <h1 className="text-2xl text-foreground mb-2" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 800 }}>
            Doge ID Verify
          </h1>
          <p className="text-sm text-muted-foreground">
            スマートフォン認証
          </p>
          {sessionInfo && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                セッション: {sessionInfo.sessionId.slice(0, 8)}...
              </Badge>
            </div>
          )}
        </div>

        {step === "capture" && (
          <div className="space-y-4">
            <div className="space-y-4">
              {/* 身分証明書撮影 */}
              <CameraCapture
                onCapture={handleDocumentCapture}
                title="身分証明書撮影"
                description="運転免許証、マイナンバーカード、パスポート等を撮影してください"
                aspectRatio="landscape"
                maxWidth={640}
                maxHeight={480}
              />

              {/* セルフィー撮影 */}
              <CameraCapture
                onCapture={handleSelfieCapture}
                title="セルフィー撮影"
                description="顔がはっきりと見えるように撮影してください"
                aspectRatio="square"
                maxWidth={800}
                maxHeight={800}
                useFrontCamera={true}  // ← 既に設定済み
              />
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">基本情報（オプション）</CardTitle>
                <CardDescription className="text-xs">
                  申請時の情報と照合するため、基本情報を入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">氏名</label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    placeholder="山田 太郎"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">生年月日</label>
                  <input
                    type="date"
                    value={userInfo.birthDate}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">住所</label>
                  <input
                    type="text"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border rounded-md"
                    placeholder="東京都新宿区..."
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              disabled={!documentImage || !selfieImage || isProcessing}
              size="lg"
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  認証中...
                </>
              ) : (
                "認証開始"
              )}
            </Button>
          </div>
        )}

        {step === "processing" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Loader2 className="h-4 w-4 animate-spin" />
                認証処理中
              </CardTitle>
              <CardDescription className="text-xs">
                身分証明書のOCR、顔認証、真贋判定を実行中です
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="text-center text-xs text-gray-600">
                  {progress < 30 && "身分証明書のOCR処理中..."}
                  {progress >= 30 && progress < 60 && "顔認証処理中..."}
                  {progress >= 60 && progress < 90 && "真贋判定処理中..."}
                  {progress >= 90 && "最終判定中..."}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "result" && result && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {getStatusIcon(result.finalJudgement)}
                  認証結果
                </CardTitle>
                <CardDescription className="text-xs">
                  処理時間: {result.processingTime}ms | 信頼度: {(result.confidence * 100).toFixed(1)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">最終判定:</span>
                    <Badge className={`text-xs ${getStatusColor(result.finalJudgement)}`}>
                      {result.finalJudgement}
                    </Badge>
                  </div>
                  
                  {result.reason && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                      <strong>判定理由:</strong> {result.reason}
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium mb-2">文書情報</h3>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>文書種別:</span>
                          <span>{result.documentType}</span>
                        </div>
                        {result.documentOcr.name && (
                          <div className="flex justify-between">
                            <span>氏名:</span>
                            <span>{result.documentOcr.name}</span>
                          </div>
                        )}
                        {result.documentOcr.birthDate && (
                          <div className="flex justify-between">
                            <span>生年月日:</span>
                            <span>{result.documentOcr.birthDate}</span>
                          </div>
                        )}
                        {result.documentOcr.address && (
                          <div className="flex justify-between">
                            <span>住所:</span>
                            <span className="text-right">{result.documentOcr.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">認証結果</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span>顔照合:</span>
                          <Badge className={`text-xs ${getStatusColor(result.faceMatchResult)}`}>
                            {result.faceMatchResult} ({(result.faceMatchScore * 100).toFixed(1)}%)
                          </Badge>
                        </div>
                        {result.faceMatchNotes && (
                          <div className="text-xs text-gray-600 mt-1">
                            {result.faceMatchNotes}
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span>真贋判定:</span>
                          <Badge className={`text-xs ${getStatusColor(result.documentAuthenticity)}`}>
                            {result.documentAuthenticity}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>審査タイプ:</span>
                          <span>{result.reviewType}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.finalJudgement === "REVIEW_REQUIRED" && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        手動審査が必要です。審査結果は後日メールでお知らせします。
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.finalJudgement === "REJECTED" && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        認証に失敗しました。画像の品質や情報を確認して再度お試しください。
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.finalJudgement === "APPROVED" && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-xs text-green-800">
                        認証が完了しました。本人確認が完了しています。
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={() => window.close()}
                variant="outline"
                size="sm"
              >
                完了
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 