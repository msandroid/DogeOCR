"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle, Loader2, Shield, User, FileText, Smartphone, QrCode } from "lucide-react"
import { AgeVerificationDisplay } from "./age-verification-display"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import CameraCapture from "./camera-capture"

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
  reason?: string // 追加: 判定理由
}

export default function IDVerifyDemo() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [step, setStep] = useState<"loading" | "capture" | "processing" | "result">("loading")
  const [documentImage, setDocumentImage] = useState<string>("")
  const [selfieImage, setSelfieImage] = useState<string>("")
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
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">デバイスを確認中...</p>
      </div>
    )
  }

  // PCの場合はリダイレクト中
  if (isMobile === false) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">QRコードページにリダイレクト中...</p>
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
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "FAIL":
      case "INVALID":
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
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
    <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
          <Smartphone className="h-4 w-4 text-primary" />
          <Badge variant="secondary" className="text-xs">
            モバイル専用
          </Badge>
        </div>

      {step === "capture" && (
        <div className="space-y-4">
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

          {/* 認証ボタン */}
          <Button
            onClick={handleSubmit}
            disabled={!documentImage || !selfieImage || isProcessing}
            className="w-full"
            size="sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                認証中...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                認証開始
              </>
            )}
          </Button>
        </div>
      )}

      {step === "processing" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              認証処理中
            </CardTitle>
            <CardDescription className="text-xs">
              身分証明書のOCR、顔認証、真贋判定を実行中
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={progress} className="w-full" />
              <div className="text-center text-xs text-muted-foreground">
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
              <CardTitle className="flex items-center gap-2 text-sm">
                {getStatusIcon(result.finalJudgement)}
                認証結果
              </CardTitle>
              <CardDescription className="text-xs">
                処理時間: {result.processingTime}ms | 信頼度: {(result.confidence * 100).toFixed(1)}%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">最終判定:</span>
                <Badge className={`text-xs ${getStatusColor(result.finalJudgement)}`}>
                  {result.finalJudgement}
                </Badge>
              </div>
              
              {result.reason && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>判定理由:</strong> {result.reason}
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h3 className="text-xs font-medium mb-2">文書情報</h3>
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
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-medium mb-2">認証結果</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span>顔照合:</span>
                      <Badge className={`text-xs ${getStatusColor(result.faceMatchResult)}`}>
                        {result.faceMatchResult} ({(result.faceMatchScore * 100).toFixed(1)}%)
                      </Badge>
                    </div>
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
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    手動審査が必要です。審査結果は後日メールでお知らせします。
                  </AlertDescription>
                </Alert>
              )}

              {result.finalJudgement === "REJECTED" && (
                <Alert variant="destructive">
                  <XCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    認証に失敗しました。画像の品質や情報を確認して再度お試しください。
                  </AlertDescription>
                </Alert>
              )}

              {result.finalJudgement === "APPROVED" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <AlertDescription className="text-xs text-green-800">
                    認証が完了しました。本人確認が完了しています。
                  </AlertDescription>
                </Alert>
              )}

              {/* 年齢確認結果表示 */}
              {result.ageVerification && (
                <div className="mt-4">
                  <AgeVerificationDisplay ageVerification={result.ageVerification} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
                         <Button
               onClick={() => {
                 setStep("capture")
                 setDocumentImage("")
                 setSelfieImage("")
                 setResult(null)
               }}
               variant="secondary"
               size="sm"
             >
               新規認証
             </Button>
          </div>
        </div>
      )}
    </div>
  )
} 