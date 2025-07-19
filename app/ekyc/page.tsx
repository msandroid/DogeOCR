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
import { useIsMobile, useSafariInfo } from "@/hooks/use-mobile"
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
  const safariInfo = useSafariInfo()
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
  const [error, setError] = useState<string>("")
  const [isInitialized, setIsInitialized] = useState(false)
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

  // Safari検出とデバイス判定
  useEffect(() => {
    const initializeEKYC = async () => {
      try {
        console.log("eKYC初期化開始")
        
        // Safari固有の処理
        if (safariInfo?.isSafari) {
          console.log("Safari検出:", safariInfo)
          
          // Safariでカメラがサポートされていない場合の処理
          if (!safariInfo.supportsCamera) {
            setError("Safariでカメラ機能がサポートされていません。ChromeまたはFirefoxをお試しください。")
            setCurrentStep("loading")
            return
          }
        }

        // デバイス判定とリダイレクト
        if (isMobile === false) {
          // PCの場合はQRコードページにリダイレクト
          console.log("PC検出 - QRコードページにリダイレクト")
          router.push('/ekyc/qr')
        } else if (isMobile === true) {
          // モバイルの場合は認証ページを表示
          console.log("モバイル検出 - 認証ページを表示")
          setCurrentStep("document-capture")
        } else {
          // 判定が不明な場合はフォールバック
          console.log("デバイス判定不明 - フォールバック")
          setCurrentStep("document-capture")
        }
        
        setIsInitialized(true)
      } catch (error) {
        console.error("eKYC初期化エラー:", error)
        // エラーが発生した場合はフォールバック
        setCurrentStep("document-capture")
        setIsInitialized(true)
      }
    }

    // 初期化を遅延実行（Safariでの問題を回避）
    const timer = setTimeout(() => {
      initializeEKYC()
    }, 100)

    return () => clearTimeout(timer)
  }, [isMobile, safariInfo, router])

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
      status: currentStep === "result" ? "active" : "pending"
    }
  ]

  const handleDocumentCapture = (imageData: string) => {
    try {
      setDocumentImage(imageData)
      setCurrentStep("ocr-processing")
      simulateOCRProcessing()
    } catch (error) {
      console.error("身分証撮影エラー:", error)
      toast({
        title: "撮影エラー",
        description: "身分証の撮影中にエラーが発生しました。",
        variant: "destructive"
      })
    }
  }

  const simulateOCRProcessing = async () => {
    try {
      setStepProgress(prev => ({ ...prev, "ocr-processing": 0 }))
      
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setStepProgress(prev => ({ ...prev, "ocr-processing": i }))
      }
      
      setCurrentStep("selfie-capture")
    } catch (error) {
      console.error("OCR処理エラー:", error)
      setCurrentStep("selfie-capture")
    }
  }

  const handleSelfieCapture = (imageData: string) => {
    try {
      setSelfieImage(imageData)
      setCurrentStep("face-verification")
      simulateFaceVerification()
    } catch (error) {
      console.error("セルフィー撮影エラー:", error)
      toast({
        title: "撮影エラー",
        description: "セルフィーの撮影中にエラーが発生しました。",
        variant: "destructive"
      })
    }
  }

  const simulateFaceVerification = async () => {
    try {
      setStepProgress(prev => ({ ...prev, "face-verification": 0 }))
      
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150))
        setStepProgress(prev => ({ ...prev, "face-verification": i }))
      }
      
      setCurrentStep("age-verification")
      await performVerification()
    } catch (error) {
      console.error("顔認証エラー:", error)
      setCurrentStep("age-verification")
      await performVerification()
    }
  }

  const handleSubmit = async () => {
    if (!documentImage || !selfieImage) {
      toast({
        title: "エラー",
        description: "身分証とセルフィーの両方が必要です。",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    setCurrentStep("final-judgement")
    
    try {
      await performVerification()
    } catch (error) {
      console.error("認証エラー:", error)
      toast({
        title: "認証エラー",
        description: "認証処理中にエラーが発生しました。",
        variant: "destructive"
      })
      setIsProcessing(false)
    }
  }

  const performVerification = async () => {
    try {
      const formData = new FormData()
      formData.append('documentImage', dataURLtoFile(documentImage, 'document.jpg'))
      formData.append('faceImage', dataURLtoFile(selfieImage, 'selfie.jpg'))

      const response = await fetch('/api/id-verify', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        setCurrentStep("result")
        toast({
          title: "認証完了",
          description: "eKYC認証が正常に完了しました。",
        })
      } else {
        throw new Error(data.error || "認証に失敗しました")
      }
    } catch (error: any) {
      console.error("API呼び出しエラー:", error)
      
      // Safari固有のエラーメッセージ
      let errorMessage = error.message || "認証処理中にエラーが発生しました。"
      if (safariInfo?.isSafari) {
        errorMessage = "Safariで認証処理に問題が発生しました。ChromeまたはFirefoxをお試しください。"
      }
      
      toast({
        title: "認証エラー",
        description: errorMessage,
        variant: "destructive"
      })
      
      setError(errorMessage)
      setCurrentStep("result")
    } finally {
      setIsProcessing(false)
    }
  }

  // Base64データURLをFileオブジェクトに変換
  const dataURLtoFile = (dataURL: string, filename: string): File => {
    try {
      const arr = dataURL.split(',')
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    } catch (error) {
      console.error("Base64変換エラー:", error)
      throw new Error("画像データの変換に失敗しました")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "active":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "active":
        return "text-blue-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "active":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  if (currentStep === "loading" || !isInitialized) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">eKYCシステムを初期化中...</p>
            {safariInfo?.isSafari && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700">
                  Safari互換モードで動作中
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()}>
              ページを再読み込み
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-4xl font-light text-foreground">Doge eKYC</h1>
            {safariInfo?.isSafari && (
              <Badge variant="secondary" className="text-xs">
                Safari
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            包括的電子本人確認システム
          </p>
          {safariInfo?.isSafari && (
            <div className="mt-2 p-2 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700">
                Safari互換モードで動作中 - 一部機能が制限される場合があります
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 現在のステップ */}
            {currentStep !== "result" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStepStatusIcon(steps.find(s => s.id === currentStep)?.status || "pending")}
                    {steps.find(s => s.id === currentStep)?.title}
                  </CardTitle>
                  <CardDescription>
                    {steps.find(s => s.id === currentStep)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStep === "document-capture" && (
                    <CameraCapture
                      onCapture={handleDocumentCapture}
                      title="身分証明書の撮影"
                      description="身分証明書をカメラで撮影してください"
                      aspectRatio="landscape"
                      facingMode="environment"
                    />
                  )}
                  
                  {currentStep === "selfie-capture" && (
                    <CameraCapture
                      onCapture={handleSelfieCapture}
                      title="セルフィーの撮影"
                      description="顔をカメラで撮影してください"
                      aspectRatio="portrait"
                      facingMode="user"
                    />
                  )}
                  
                  {(currentStep === "ocr-processing" || currentStep === "face-verification" || 
                    currentStep === "age-verification" || currentStep === "security-check" || 
                    currentStep === "final-judgement") && (
                    <div className="space-y-4">
                      <Progress value={stepProgress[currentStep]} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        処理中... {stepProgress[currentStep]}%
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 結果表示 */}
            {currentStep === "result" && result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.finalJudgement === "APPROVED" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    認証結果
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">文書情報</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">文書種別:</span> {result.documentType}</p>
                        {result.documentOcr.name && (
                          <p><span className="font-medium">氏名:</span> {result.documentOcr.name}</p>
                        )}
                        {result.documentOcr.birthDate && (
                          <p><span className="font-medium">生年月日:</span> {result.documentOcr.birthDate}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">認証結果</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">顔認証:</span> {result.faceMatchResult}</p>
                        <p><span className="font-medium">顔認証スコア:</span> {(result.faceMatchScore * 100).toFixed(1)}%</p>
                        <p><span className="font-medium">最終判定:</span> {result.finalJudgement}</p>
                      </div>
                    </div>
                  </div>
                  
                  {result.ageVerification && (
                    <div>
                      <h4 className="font-medium mb-2">年齢確認</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">年齢:</span> {result.ageVerification.age}歳</p>
                        <p><span className="font-medium">成年判定:</span> {result.ageVerification.isAdult ? "成年" : "未成年"}</p>
                        <p><span className="font-medium">理由:</span> {result.ageVerification.reason}</p>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="text-center">
                    <Button onClick={() => window.location.reload()}>
                      新しい認証を開始
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* サイドバー - 進捗 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">認証進捗</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safari情報 */}
            {safariInfo?.isSafari && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Safari情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">バージョン:</span> {safariInfo.version}</p>
                    <p><span className="font-medium">カメラサポート:</span> {safariInfo.supportsCamera ? "対応" : "非対応"}</p>
                    <p><span className="font-medium">タッチサポート:</span> {safariInfo.supportsTouch ? "対応" : "非対応"}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 