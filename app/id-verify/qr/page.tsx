"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Smartphone, ArrowLeft, RefreshCw, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import QRCode from "qrcode"

interface SessionInfo {
  sessionId: string
  status: "pending" | "active" | "completed" | "expired"
  createdAt: string
  expiresAt: string
}

export default function QRCodePage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const generateSession = async () => {
    try {
      const response = await fetch("/api/id-verify/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        const session = data.session
        setSessionInfo(session)
        
        // QRコードを生成
        const mobileUrl = `${window.location.origin}/id-verify/mobile/${session.sessionId}`
        const qrDataUrl = await QRCode.toDataURL(mobileUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          }
        })
        
        setQrCodeDataUrl(qrDataUrl)
        setIsLoading(false)
        
        toast({
          title: "セッション作成完了",
          description: "スマートフォンでQRコードを読み取ってください。",
        })
      } else {
        throw new Error(data.error || "セッションの作成に失敗しました")
      }
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message || "セッション作成中にエラーが発生しました。",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  const refreshSession = async () => {
    if (!sessionInfo) return
    
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/id-verify/session/${sessionInfo.sessionId}`, {
        method: "GET",
      })

      const data = await response.json()

      if (data.success) {
        setSessionInfo(data.session)
        
        if (data.session.status === "completed") {
          toast({
            title: "認証完了",
            description: "スマートフォンでの認証が完了しました。",
          })
        }
      } else {
        throw new Error(data.error || "セッション情報の取得に失敗しました")
      }
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message || "セッション情報の取得中にエラーが発生しました。",
        variant: "destructive"
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    generateSession()
  }, [])

  // 定期的にセッション状態を更新
  useEffect(() => {
    if (!sessionInfo) return

    const interval = setInterval(() => {
      refreshSession()
    }, 5000) // 5秒ごとに更新

    return () => clearInterval(interval)
  }, [sessionInfo])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">待機中</Badge>
      case "active":
        return <Badge variant="default">アクティブ</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">完了</Badge>
      case "expired":
        return <Badge variant="destructive">期限切れ</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">セッションを生成中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Monitor className="h-6 w-6 text-primary" />
            <h1 className="text-4xl text-foreground" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 800 }}>Doge ID Verify API</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            スマートフォンでQRコードを読み取って認証を開始してください
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-sm">
              PC専用ページ
            </Badge>
            <Badge variant="secondary" className="text-sm">
              モバイル認証
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              eKYC認証
            </CardTitle>
            <CardDescription>
              スマートフォンのカメラでQRコードを読み取ってください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {qrCodeDataUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg shadow-sm border">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                </div>
              )}

              {sessionInfo && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">セッション状態</span>
                    </div>
                    {getStatusBadge(sessionInfo.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">セッションID:</span>
                      <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                        {sessionInfo.sessionId}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">有効期限:</span>
                      <p className="mt-1">
                        {new Date(sessionInfo.expiresAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={refreshSession}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? '更新中...' : '状態を更新'}
                  </Button>
                </div>
              )}

              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  スマートフォンでQRコードを読み取ると、専用の認証ページが開きます。
                  認証が完了すると、このページの状態が自動的に更新されます。
                </AlertDescription>
              </Alert>

              <Alert>
                <Monitor className="h-4 w-4" />
                <AlertDescription>
                  <strong>PCでの認証について:</strong><br />
                  ID verify機能はセキュリティ上の理由により、モバイル端末でのみ利用可能です。
                  PCからアクセスされた場合は、スマートフォンでの認証をお願いします。
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            onClick={generateSession}
            variant="outline"
            size="sm"
          >
            新しいセッションを生成
          </Button>
        </div>
      </div>
    </div>
  )
} 