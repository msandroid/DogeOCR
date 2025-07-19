"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  User, 
  FileText, 
  Eye, 
  Calendar,
  Clock,
  Target,
  Info,
  CheckSquare,
  AlertTriangle
} from "lucide-react"
import { AgeVerificationDisplay } from "./age-verification-display"

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

interface VerificationResultDisplayProps {
  result: VerificationResult
  className?: string
  showDetails?: boolean
}

export function VerificationResultDisplay({ 
  result, 
  className = "",
  showDetails = true 
}: VerificationResultDisplayProps) {
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

  const getFinalStatusMessage = () => {
    switch (result.finalJudgement) {
      case "APPROVED":
        return {
          title: "認証完了",
          message: "本人確認が正常に完了しました。",
          variant: "default" as const
        }
      case "REJECTED":
        return {
          title: "認証失敗",
          message: "認証に失敗しました。画像の品質や情報を確認して再度お試しください。",
          variant: "destructive" as const
        }
      case "REVIEW_REQUIRED":
        return {
          title: "審査が必要",
          message: "手動審査が必要です。審査結果は後日メールでお知らせします。",
          variant: "default" as const
        }
      default:
        return {
          title: "処理中",
          message: "認証処理中です。",
          variant: "default" as const
        }
    }
  }

  const statusMessage = getFinalStatusMessage()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 最終判定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(result.finalJudgement)}
            認証結果
            <Badge className={getStatusColor(result.finalJudgement)}>
              {result.finalJudgement}
            </Badge>
          </CardTitle>
          <CardDescription className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              処理時間: {result.processingTime}ms
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              信頼度: {(result.confidence * 100).toFixed(1)}%
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={statusMessage.variant}>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>{statusMessage.title}:</strong> {statusMessage.message}
            </AlertDescription>
          </Alert>

          {result.reason && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium">判定理由:</span>
                  <span className="ml-2">{result.reason}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showDetails && (
        <>
          {/* 認証に使用した情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                認証に使用した情報
              </CardTitle>
              <CardDescription>
                身分証明書から抽出された情報
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 文書情報 */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    文書情報
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">文書種別:</span>
                      <span className="font-medium">{result.documentType}</span>
                    </div>
                    {result.documentOcr.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">氏名:</span>
                        <span className="font-medium">{result.documentOcr.name}</span>
                      </div>
                    )}
                    {result.documentOcr.birthDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">生年月日:</span>
                        <span className="font-medium">{result.documentOcr.birthDate}</span>
                      </div>
                    )}
                    {result.documentOcr.address && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">住所:</span>
                        <span className="font-medium text-right">{result.documentOcr.address}</span>
                      </div>
                    )}
                    {result.documentOcr.expirationDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">有効期限:</span>
                        <span className="font-medium">{result.documentOcr.expirationDate}</span>
                      </div>
                    )}
                    {result.documentOcr.documentNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">文書番号:</span>
                        <span className="font-medium">{result.documentOcr.documentNumber}</span>
                      </div>
                    )}
                    {result.documentOcr.issuingAuthority && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">発行機関:</span>
                        <span className="font-medium">{result.documentOcr.issuingAuthority}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* 認証結果詳細 */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    認証結果詳細
                  </h4>
                  <div className="space-y-3">
                    {/* 顔認証結果 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">顔認証</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(result.faceMatchResult)}>
                          {result.faceMatchResult}
                        </Badge>
                        <span className="text-sm font-medium">
                          {(result.faceMatchScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* 文書真贋判定 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">文書真贋判定</span>
                      </div>
                      <Badge className={getStatusColor(result.documentAuthenticity)}>
                        {result.documentAuthenticity}
                      </Badge>
                    </div>

                    {/* 年齢確認結果 */}
                    {result.ageVerification && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">年齢確認</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={result.ageVerification.isAdult ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {result.ageVerification.isAdult ? "成年" : "未成年"}
                          </Badge>
                          <span className="text-sm font-medium">
                            {result.ageVerification.age}歳
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 審査タイプ */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">審査タイプ</span>
                      </div>
                      <span className="text-sm font-medium">{result.reviewType}</span>
                    </div>
                  </div>
                </div>

                {/* 顔画像品質情報 */}
                {result.faceQuality && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">顔画像品質</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">明度:</span>
                          <span className="font-medium">{(result.faceQuality.brightness * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">鮮明度:</span>
                          <span className="font-medium">{((1 - result.faceQuality.blur) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">角度:</span>
                          <span className="font-medium">{(result.faceQuality.angle * 180 / Math.PI).toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">遮蔽:</span>
                          <span className="font-medium">{(result.faceQuality.occlusion * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 年齢確認詳細表示 */}
          {result.ageVerification && (
            <AgeVerificationDisplay ageVerification={result.ageVerification} />
          )}

          {/* セッション情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">セッション情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">セッションID:</span>
                  <span className="font-mono text-xs">{result.sessionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">処理日時:</span>
                  <span className="font-medium">{new Date(result.timestamp).toLocaleString('ja-JP')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 