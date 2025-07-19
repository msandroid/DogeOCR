"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Shield, 
  Smartphone, 
  QrCode,
  Camera,
  User,
  FileText,
  Eye,
  Calendar,
  Lock,
  CheckSquare,
  Clock
} from "lucide-react"
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

interface UserInfo {
  name: string
  birthDate: string
  address: string
}

type EKYCStep = 
  | "loading"
  | "document-capture"
  | "ocr-processing"
  | "selfie-capture"
  | "face-verification"
  | "age-verification"
  | "security-check"
  | "final-judgement"
  | "result"

interface StepInfo {
  id: EKYCStep
  title: string
  description: string
  icon: React.ReactNode
  status: "pending" | "active" | "completed" | "failed"
}

export default function EKYCPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState<EKYCStep>("loading")
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
  const [stepProgress, setStepProgress] = useState<Record<EKYCStep, number>>({
    loading: 0,
    "document-capture": 0,
    "ocr-processing": 0,
    "selfie-capture": 0,
    "face-verification": 0,
    "age-verification": 0,
    "security-check": 0,
    "final-judgement": 0,
    result: 0
  })
  
  const { toast } = useToast()

  // デバイス判定とリダイレクト
  useEffect(() => {
    if (isMobile === false) {
      // PCの場合はQRコードページにリダイレクト
      router.push('/ekyc/qr')
    } else if (isMobile === true) {
      // モバイルの場合は認証ページを表示
      setCurrentStep("document-capture")
    }
  }, [isMobile, router])

  const steps: StepInfo[] = [
    {
      id: "document-capture",
      title: "身分証撮影",
      description: "カメラ起動・身分証撮影",
      icon: <Camera className="h-5 w-5" />,
      status: currentStep === "document-capture" ? "active" : 
              currentStep === "loading" ? "pending" : "completed"
    },
    {
      id: "ocr-processing",
      title: "OCR処理",
      description: "Fireworks.aiによる統合OCR+LLM処理",
      icon: <FileText className="h-5 w-5" />,
      status: currentStep === "ocr-processing" ? "active" : 
              ["loading", "document-capture"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "selfie-capture",
      title: "セルフィー撮影",
      description: "顔認識ガイド表示・生体検知",
      icon: <User className="h-5 w-5" />,
      status: currentStep === "selfie-capture" ? "active" : 
              ["loading", "document-capture", "ocr-processing"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "face-verification",
      title: "顔認証処理",
      description: "身分証の顔写真とセルフィーを照合",
      icon: <Eye className="h-5 w-5" />,
      status: currentStep === "face-verification" ? "active" : 
              ["loading", "document-capture", "ocr-processing", "selfie-capture"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "age-verification",
      title: "年齢確認",
      description: "実年齢計算・成年判定",
      icon: <Calendar className="h-5 w-5" />,
      status: currentStep === "age-verification" ? "active" : 
              ["loading", "document-capture", "ocr-processing", "selfie-capture", "face-verification"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "security-check",
      title: "セキュリティ処理",
      description: "TLS暗号化・画像削除・認証トークン",
      icon: <Lock className="h-5 w-5" />,
      status: currentStep === "security-check" ? "active" : 
              ["loading", "document-capture", "ocr-processing", "selfie-capture", "face-verification", "age-verification"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "final-judgement",
      title: "総合判定",
      description: "OCR信頼度・顔認証・年齢確認の総合判定",
      icon: <CheckSquare className="h-5 w-5" />,
      status: currentStep === "final-judgement" ? "active" : 
              ["loading", "document-capture", "ocr-processing", "selfie-capture", "face-verification", "age-verification", "security-check"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "result",
      title: "結果表示",
      description: "成功/失敗の明確な表示・年齢確認結果",
      icon: <CheckCircle className="h-5 w-5" />,
      status: currentStep === "result" ? "active" : 
              currentStep === "result" ? "completed" : "pending"
    }
  ]

  const handleDocumentCapture = (imageData: string) => {
    setDocumentImage(imageData)
    setStepProgress(prev => ({ ...prev, "document-capture": 100 }))
    setCurrentStep("ocr-processing")
    
    toast({
      title: "身分証撮影完了",
      description: "身分証明書の撮影が完了しました。OCR処理を開始します。",
    })

    // OCR処理のシミュレーション
    simulateOCRProcessing()
  }

  const simulateOCRProcessing = async () => {
    setStepProgress(prev => ({ ...prev, "ocr-processing": 0 }))
    
    const interval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev["ocr-processing"] + 20
        if (newProgress >= 100) {
          clearInterval(interval)
          setCurrentStep("selfie-capture")
          return { ...prev, "ocr-processing": 100 }
        }
        return { ...prev, "ocr-processing": newProgress }
      })
    }, 500)

    toast({
      title: "OCR処理完了",
      description: "身分証明書の情報を抽出しました。セルフィー撮影に進みます。",
    })
  }

  const handleSelfieCapture = (imageData: string) => {
    setSelfieImage(imageData)
    setStepProgress(prev => ({ ...prev, "selfie-capture": 100 }))
    setCurrentStep("face-verification")
    
    toast({
      title: "セルフィー撮影完了",
      description: "セルフィーの撮影が完了しました。顔認証処理を開始します。",
    })

    // 顔認証処理のシミュレーション
    simulateFaceVerification()
  }

  const simulateFaceVerification = async () => {
    setStepProgress(prev => ({ ...prev, "face-verification": 0 }))
    
    const interval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev["face-verification"] + 25
        if (newProgress >= 100) {
          clearInterval(interval)
          setCurrentStep("age-verification")
          return { ...prev, "face-verification": 100 }
        }
        return { ...prev, "face-verification": newProgress }
      })
    }, 400)

    toast({
      title: "顔認証完了",
      description: "顔認証処理が完了しました。年齢確認に進みます。",
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
    setCurrentStep("security-check")
    setStepProgress(prev => ({ ...prev, "age-verification": 100 }))

    // セキュリティ処理のシミュレーション
    const securityInterval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev["security-check"] + 33
        if (newProgress >= 100) {
          clearInterval(securityInterval)
          setCurrentStep("final-judgement")
          return { ...prev, "security-check": 100 }
        }
        return { ...prev, "security-check": newProgress }
      })
    }, 300)

    // 最終判定のシミュレーション
    setTimeout(() => {
      setStepProgress(prev => ({ ...prev, "final-judgement": 100 }))
      setCurrentStep("result")
      
      // 実際のAPI呼び出し
      performVerification()
    }, 1500)
  }

  const performVerification = async () => {
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
        toast({
          title: "認証完了",
          description: "eKYC認証が完了しました。",
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
      setCurrentStep("document-capture")
    } finally {
      setIsProcessing(false)
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

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "active":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  // ローディング中は何も表示しない
  if (isMobile === undefined || currentStep === "loading") {
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

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-light text-foreground mb-2">Doge eKYC</h1>
          <p className="text-sm text-muted-foreground">
            包括的電子本人確認
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              8段階認証フロー
            </Badge>
          </div>
        </div>

        {/* プログレスステップ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">認証プロセス</CardTitle>
            <CardDescription>
              現在の進行状況: {steps.find(s => s.id === currentStep)?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getStepStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{step.title}</span>
                      {step.id === currentStep && stepProgress[step.id] > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {stepProgress[step.id]}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    {step.id === currentStep && stepProgress[step.id] > 0 && (
                      <Progress value={stepProgress[step.id]} className="mt-1 h-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {currentStep === "document-capture" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  身分証撮影
                </CardTitle>
                <CardDescription>
                  運転免許証、マイナンバーカード、パスポート等を撮影してください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CameraCapture
                  onCapture={handleDocumentCapture}
                  title="身分証明書撮影"
                  description="身分証明書全体がはっきり見えるように撮影してください"
                  aspectRatio="landscape"
                  maxWidth={640}
                  maxHeight={480}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "ocr-processing" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                OCR処理中
              </CardTitle>
              <CardDescription>
                Fireworks.aiによる統合OCR+LLM処理を実行中
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">
                  身分証明書の情報を抽出中...
                </p>
                <Progress value={stepProgress["ocr-processing"]} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "selfie-capture" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  セルフィー撮影
                </CardTitle>
                <CardDescription>
                  顔認識ガイド表示・生体検知によるリアルタイム撮影確認
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CameraCapture
                  onCapture={handleSelfieCapture}
                  title="セルフィー撮影"
                  description="本人確認のため、顔がはっきり見えるセルフィーを撮影してください"
                  aspectRatio="portrait"
                  maxWidth={480}
                  maxHeight={640}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "face-verification" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                顔認証処理中
              </CardTitle>
              <CardDescription>
                身分証の顔写真とセルフィーを照合中
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">
                  同一人物判定を実行中...
                </p>
                <Progress value={stepProgress["face-verification"]} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "age-verification" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                年齢確認
              </CardTitle>
              <CardDescription>
                実年齢計算・成年判定（18歳以上）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">
                  年齢確認を実行中...
                </p>
                <Button 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    "認証を完了"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(currentStep === "security-check" || currentStep === "final-judgement") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === "security-check" ? <Lock className="h-5 w-5" /> : <CheckSquare className="h-5 w-5" />}
                {currentStep === "security-check" ? "セキュリティ処理" : "総合判定"}
              </CardTitle>
              <CardDescription>
                {currentStep === "security-check" 
                  ? "TLS暗号化・画像削除・認証トークン処理中"
                  : "OCR信頼度・顔認証・年齢確認の総合判定中"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">
                  {currentStep === "security-check" 
                    ? "セキュリティ処理を実行中..."
                    : "最終判定を実行中..."
                  }
                </p>
                <Progress 
                  value={stepProgress[currentStep]} 
                  className="w-full" 
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "result" && result && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  認証結果
                </CardTitle>
                <CardDescription>
                  成功/失敗の明確な表示・年齢確認結果
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 最終判定 */}
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">最終判定</span>
                    </div>
                    <Badge className={getStatusColor(result.finalJudgement)}>
                      {result.finalJudgement}
                    </Badge>
                  </div>

                  {/* 年齢確認結果 */}
                  {result.ageVerification && (
                    <div className="space-y-2">
                      <h4 className="font-medium">年齢確認結果</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">年齢:</span>
                          <p className="font-medium">{result.ageVerification.age}歳</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">成年判定:</span>
                          <p className="font-medium">
                            {result.ageVerification.isAdult ? "成年" : "未成年"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 顔認証結果 */}
                  <div className="space-y-2">
                    <h4 className="font-medium">顔認証結果</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">スコア:</span>
                        <p className="font-medium">{(result.faceMatchScore * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">結果:</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(result.faceMatchResult)}
                          <span className="font-medium">{result.faceMatchResult}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 文書真贋判定 */}
                  <div className="space-y-2">
                    <h4 className="font-medium">文書真贋判定</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.documentAuthenticity)}
                      <span className="font-medium">{result.documentAuthenticity}</span>
                    </div>
                  </div>

                  {/* 処理時間 */}
                  <div className="text-sm text-muted-foreground">
                    処理時間: {result.processingTime}ms
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setCurrentStep("document-capture")}
              variant="outline"
              className="w-full"
            >
              新しい認証を開始
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 