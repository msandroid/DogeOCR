"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle, Loader2, Shield, Smartphone, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
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

interface UserInfo {
  name: string
  birthDate: string
  address: string
}

export default function IDVerifyPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [step, setStep] = useState<"loading" | "capture" | "processing" | "result">("loading")
  const [documentImage, setDocumentImage] = useState<string>("")
  const [selfieImage, setSelfieImage] = useState<string>("")
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    birthDate: "",
    address: ""
  })
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const { toast } = useToast()

  // デバイス判定とリダイレクト
  useEffect(() => {
    if (isMobile === false) {
      // PCの場合はQRコードページにリダイレクト
      router.push('/id-verify/qr')
    } else if (isMobile === true) {
      // モバイルの場合は認証ページを表示
      setStep("capture")
    }
  }, [isMobile, router])

  // ローディング中は何も表示しない
  if (isMobile === undefined || step === "loading") {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">デバイスを確認中...</p>
          </div>
        </div>
      </div>
    )
  }

  // PCの場合はリダイレクト中
  if (isMobile === false) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">QRコードページにリダイレクト中...</p>
          </div>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Smartphone className="h-6 w-6 text-primary" />
            <h1 className="text-4xl font-light text-foreground">Doge ID Verify</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            日本の犯罪収益移転防止法に準拠したeKYC認証システム
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-sm">
              モバイル専用
            </Badge>
          </div>
        </div>

        {step === "capture" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 身分証明書撮影 */}
              <CameraCapture
                onCapture={handleDocumentCapture}
                title="身分証明書撮影"
                description="運転免許証、マイナンバーカード、パスポート等を撮影してください"
                aspectRatio="landscape"
                maxWidth={1280}
                maxHeight={720}
              />

              {/* セルフィー撮影 */}
              <CameraCapture
                onCapture={handleSelfieCapture}
                title="セルフィー撮影"
                description="本人確認のため、顔がはっきり見えるセルフィーを撮影してください"
                aspectRatio="portrait"
                maxWidth={640}
                maxHeight={960}
              />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!documentImage || !selfieImage || isProcessing}
                size="lg"
                className="px-8"
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
          </div>
        )}

        {step === "processing" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                認証処理中
              </CardTitle>
              <CardDescription>
                身分証明書のOCR、顔認証、真贋判定を実行中です
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="text-center text-sm text-gray-600">
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(result.finalJudgement)}
                  認証結果
                </CardTitle>
                <CardDescription>
                  処理時間: {result.processingTime}ms | 信頼度: {(result.confidence * 100).toFixed(1)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">最終判定:</span>
                    <Badge className={getStatusColor(result.finalJudgement)}>
                      {result.finalJudgement}
                    </Badge>
                  </div>
                  
                  {result.reason && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <strong>判定理由:</strong> {result.reason}
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">文書情報</h3>
                      <div className="space-y-2 text-sm">
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
                      <h3 className="font-medium mb-2">認証結果</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>顔照合:</span>
                          <Badge className={getStatusColor(result.faceMatchResult)}>
                            {result.faceMatchResult} ({(result.faceMatchScore * 100).toFixed(1)}%)
                          </Badge>
                        </div>
                        {result.faceMatchNotes && (
                          <div className="text-xs text-gray-600 mt-1">
                            {result.faceMatchNotes}
                          </div>
                        )}
                        {result.faceQuality && (
                          <div className="text-xs text-gray-500 mt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>明度: {(result.faceQuality.brightness * 100).toFixed(0)}%</div>
                              <div>鮮明度: {((1 - result.faceQuality.blur) * 100).toFixed(0)}%</div>
                              <div>角度: {(result.faceQuality.angle * 180 / Math.PI).toFixed(1)}°</div>
                              <div>遮蔽: {(result.faceQuality.occlusion * 100).toFixed(0)}%</div>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span>真贋判定:</span>
                          <Badge className={getStatusColor(result.documentAuthenticity)}>
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
                      <AlertDescription>
                        手動審査が必要です。審査結果は後日メールでお知らせします。
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.finalJudgement === "REJECTED" && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        認証に失敗しました。画像の品質や情報を確認して再度お試しください。
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.finalJudgement === "APPROVED" && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        認証が完了しました。本人確認が完了しています。
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setStep("capture")
                  setDocumentImage("")
                  setSelfieImage("")
                  setUserInfo({ name: "", birthDate: "", address: "" })
                  setResult(null)
                }}
                variant="outline"
              >
                新規認証
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 