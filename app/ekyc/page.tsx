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
  Clock,
  CreditCard,
  UserCheck
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
  | "document-face-capture"
  | "selfie-capture"
  | "ocr-processing"
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
  const [documentFaceImage, setDocumentFaceImage] = useState<string>("")
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
    "document-face-capture": 0,
    "selfie-capture": 0,
    "ocr-processing": 0,
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
      title: "身分証表面撮影",
      description: "身分証の表面を撮影してください",
      icon: <CreditCard className="h-5 w-5" />,
      status: currentStep === "document-capture" ? "active" : 
              currentStep === "loading" ? "pending" : "completed"
    },
    {
      id: "document-face-capture",
      title: "身分証顔撮影",
      description: "身分証の顔写真部分を撮影してください",
      icon: <UserCheck className="h-5 w-5" />,
      status: currentStep === "document-face-capture" ? "active" : 
              ["loading", "document-capture"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "selfie-capture",
      title: "セルフィー撮影",
      description: "顔認識ガイド表示・生体検知",
      icon: <User className="h-5 w-5" />,
      status: currentStep === "selfie-capture" ? "active" : 
              ["loading", "document-capture", "document-face-capture"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "ocr-processing",
      title: "OCR処理",
      description: "DogeOCR APIによる統合OCR+LLM処理",
      icon: <FileText className="h-5 w-5" />,
      status: currentStep === "ocr-processing" ? "active" : 
              ["loading", "document-capture", "document-face-capture", "selfie-capture"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "face-verification",
      title: "顔認証処理",
      description: "身分証の顔写真とセルフィーを照合",
      icon: <Eye className="h-5 w-5" />,
      status: currentStep === "face-verification" ? "active" : 
              ["loading", "document-capture", "document-face-capture", "selfie-capture", "ocr-processing"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "age-verification",
      title: "年齢確認",
      description: "実年齢計算・成年判定",
      icon: <Calendar className="h-5 w-5" />,
      status: currentStep === "age-verification" ? "active" : 
              ["loading", "document-capture", "document-face-capture", "selfie-capture", "ocr-processing", "face-verification"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "security-check",
      title: "セキュリティ処理",
      description: "TLS暗号化・画像削除・認証トークン",
      icon: <Lock className="h-5 w-5" />,
      status: currentStep === "security-check" ? "active" : 
              ["loading", "document-capture", "document-face-capture", "selfie-capture", "ocr-processing", "face-verification", "age-verification"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "final-judgement",
      title: "総合判定",
      description: "OCR信頼度・顔認証・年齢確認の総合判定",
      icon: <CheckSquare className="h-5 w-5" />,
      status: currentStep === "final-judgement" ? "active" : 
              ["loading", "document-capture", "document-face-capture", "selfie-capture", "ocr-processing", "face-verification", "age-verification", "security-check"].includes(currentStep) ? "pending" : "completed"
    },
    {
      id: "result",
      title: "結果表示",
      description: "成功/失敗の明確な表示・年齢確認結果",
      icon: <CheckCircle className="h-5 w-5" />,
      status: currentStep === "result" ? "active" : 
              ["loading", "document-capture", "document-face-capture", "selfie-capture", "ocr-processing", "face-verification", "age-verification", "security-check", "final-judgement"].includes(currentStep) ? "pending" : "completed"
    }
  ]

  const handleDocumentCapture = (imageData: string) => {
    setDocumentImage(imageData)
    setStepProgress(prev => ({ ...prev, "document-capture": 100 }))
    setCurrentStep("document-face-capture")
    toast({
      title: "身分証表面撮影完了",
      description: "次に身分証の顔写真部分を撮影してください。",
    })
  }

  const handleDocumentFaceCapture = (imageData: string) => {
    setDocumentFaceImage(imageData)
    setStepProgress(prev => ({ ...prev, "document-face-capture": 100 }))
    setCurrentStep("selfie-capture")
    toast({
      title: "身分証顔撮影完了",
      description: "次にセルフィーを撮影してください。",
    })
  }

  const handleSelfieCapture = (imageData: string) => {
    setSelfieImage(imageData)
    setStepProgress(prev => ({ ...prev, "selfie-capture": 100 }))
    setCurrentStep("ocr-processing")
    
    // OCR処理のシミュレーション
    simulateOCRProcessing()
  }

  const simulateOCRProcessing = async () => {
    const ocrInterval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev["ocr-processing"] + 25
        if (newProgress >= 100) {
          clearInterval(ocrInterval)
          setCurrentStep("face-verification")
          return { ...prev, "ocr-processing": 100 }
        }
        return { ...prev, "ocr-processing": newProgress }
      })
    }, 200)

    // 顔認証処理のシミュレーション
    setTimeout(() => {
      simulateFaceVerification()
    }, 1000)
  }

  const simulateFaceVerification = async () => {
    const faceInterval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev["face-verification"] + 33
        if (newProgress >= 100) {
          clearInterval(faceInterval)
          setCurrentStep("age-verification")
          return { ...prev, "face-verification": 100 }
        }
        return { ...prev, "face-verification": newProgress }
      })
    }, 300)

    // 年齢確認のシミュレーション
    setTimeout(() => {
      setStepProgress(prev => ({ ...prev, "age-verification": 100 }))
      setCurrentStep("security-check")
      
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
    }, 1000)
  }

  const handleSubmit = async () => {
    if (!documentImage || !documentFaceImage || !selfieImage) {
      toast({
        title: "エラー",
        description: "身分証明書表面、身分証明書顔、セルフィーの全ての撮影が必要です。",
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
      const response = await fetch("/api/ekyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentImage,
          documentFaceImage,
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

  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isMobile === false) {
    return null // QRコードページにリダイレクトされる
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">eKYC認証</h1>
          </div>
          <p className="text-sm text-gray-600">
            包括的電子本人確認システム
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>認証進捗</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* ステップ表示 */}
        <div className="mb-6">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  step.status === "active"
                    ? "border-blue-200 bg-blue-50"
                    : step.status === "completed"
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex-shrink-0">
                  {getStepStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {step.title}
                    </span>
                    {step.status === "active" && (
                      <Badge variant="secondary" className="text-xs">
                        進行中
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>
                {step.status === "active" && (
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4">
                      <div className="w-full h-full border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* メインコンテンツ */}
        {currentStep === "document-capture" && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                身分証明書の表面を撮影してください。運転免許証、マイナンバーカード、パスポート等に対応しています。
              </AlertDescription>
            </Alert>
            
            <CameraCapture
              onCapture={handleDocumentCapture}
              title="身分証表面撮影"
              description="身分証の表面全体が映るように撮影してください"
              aspectRatio="landscape"
              maxWidth={1280}
              maxHeight={720}
            />
          </div>
        )}

        {currentStep === "document-face-capture" && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                身分証明書の顔写真部分を撮影してください。顔がはっきりと見えるように撮影してください。
              </AlertDescription>
            </Alert>
            
            <CameraCapture
              onCapture={handleDocumentFaceCapture}
              title="身分証顔撮影"
              description="身分証の顔写真部分を撮影してください"
              aspectRatio="square"
              maxWidth={800}
              maxHeight={800}
            />
          </div>
        )}

        {currentStep === "selfie-capture" && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                セルフィーを撮影してください。顔がはっきりと見えるように撮影してください。
              </AlertDescription>
            </Alert>
            
            <CameraCapture
              onCapture={handleSelfieCapture}
              title="セルフィー撮影"
              description="顔がはっきりと見えるように撮影してください"
              aspectRatio="square"
              maxWidth={800}
              maxHeight={800}
              useFrontCamera={true}
            />
          </div>
        )}

        {/* 処理中表示 */}
        {["ocr-processing", "face-verification", "age-verification", "security-check", "final-judgement"].includes(currentStep) && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentStep === "ocr-processing" && "OCR処理中..."}
                {currentStep === "face-verification" && "顔認証処理中..."}
                {currentStep === "age-verification" && "年齢確認中..."}
                {currentStep === "security-check" && "セキュリティ処理中..."}
                {currentStep === "final-judgement" && "最終判定中..."}
              </h3>
              <p className="text-sm text-gray-600">
                しばらくお待ちください...
              </p>
            </div>
          </div>
        )}

        {/* 結果表示 */}
        {currentStep === "result" && result && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(result.finalJudgement)}
                  認証結果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 最終判定 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">最終判定</span>
                  <Badge className={getStatusColor(result.finalJudgement)}>
                    {result.finalJudgement}
                  </Badge>
                </div>

                {/* OCR結果 */}
                {result.documentOcr && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">文書情報</h4>
                    <div className="text-xs space-y-1">
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
                          <span>{result.documentOcr.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 顔認証結果 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">顔認証</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">マッチスコア</span>
                    <span className="text-xs font-medium">
                      {(result.faceMatchScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">判定結果</span>
                    <Badge className={getStatusColor(result.faceMatchResult)}>
                      {result.faceMatchResult}
                    </Badge>
                  </div>
                </div>

                {/* 年齢確認結果 */}
                {result.ageVerification && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">年齢確認</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">年齢</span>
                      <span className="text-xs font-medium">
                        {result.ageVerification.age}歳
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">成年判定</span>
                      <Badge className={result.ageVerification.isAdult ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {result.ageVerification.isAdult ? "成年" : "未成年"}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* 処理時間 */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>処理時間</span>
                  <span>{result.processingTime}ms</span>
                </div>
              </CardContent>
            </Card>

            {/* 再試行ボタン */}
            <Button
              onClick={() => {
                setCurrentStep("document-capture")
                setDocumentImage("")
                setDocumentFaceImage("")
                setSelfieImage("")
                setResult(null)
                setProgress(0)
                setStepProgress({
                  loading: 0,
                  "document-capture": 0,
                  "document-face-capture": 0,
                  "selfie-capture": 0,
                  "ocr-processing": 0,
                  "face-verification": 0,
                  "age-verification": 0,
                  "security-check": 0,
                  "final-judgement": 0,
                  result: 0
                })
              }}
              className="w-full"
                             variant="secondary"
            >
              再試行
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 