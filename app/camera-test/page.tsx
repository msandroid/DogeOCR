"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, AlertCircle, CheckCircle } from "lucide-react"
import CameraCapture from "@/components/camera-capture"

export default function CameraTestPage() {
  const [documentImage, setDocumentImage] = useState<string>("")
  const [selfieImage, setSelfieImage] = useState<string>("")
  const [browserInfo, setBrowserInfo] = useState<any>({})

  const handleDocumentCapture = (imageData: string) => {
    setDocumentImage(imageData)
    console.log("Document captured:", imageData.substring(0, 100) + "...")
  }

  const handleSelfieCapture = (imageData: string) => {
    setSelfieImage(imageData)
    console.log("Selfie captured:", imageData.substring(0, 100) + "...")
  }

  const checkBrowserSupport = () => {
    const info = {
      userAgent: navigator.userAgent,
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      enumerateDevices: !!navigator.mediaDevices?.enumerateDevices,
      permissions: !!navigator.permissions,
      secureContext: window.isSecureContext,
    }
    setBrowserInfo(info)
    console.log("Browser info:", info)
  }

  const testCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      console.log("Camera permission:", permission.state)
      alert(`カメラ権限: ${permission.state}`)
    } catch (error) {
      console.error("Permission check error:", error)
      alert("権限チェックに失敗しました")
    }
  }

  const listCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(device => device.kind === 'videoinput')
      console.log("Available cameras:", cameras)
      alert(`利用可能なカメラ: ${cameras.length}個\n${cameras.map(c => c.label || 'Unknown').join('\n')}`)
    } catch (error) {
      console.error("Camera enumeration error:", error)
      alert("カメラ列挙に失敗しました")
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-foreground mb-4">カメラ機能テスト</h1>
          <p className="text-lg text-muted-foreground">
            ID verifyのカメラ機能をテストします
          </p>
        </div>

        {/* ブラウザ情報 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ブラウザ情報</CardTitle>
            <CardDescription>カメラ機能のサポート状況を確認</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">機能サポート</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>MediaDevices:</span>
                    <Badge variant={browserInfo.mediaDevices ? "default" : "destructive"}>
                      {browserInfo.mediaDevices ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>getUserMedia:</span>
                    <Badge variant={browserInfo.getUserMedia ? "default" : "destructive"}>
                      {browserInfo.getUserMedia ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Permissions API:</span>
                    <Badge variant={browserInfo.permissions ? "default" : "destructive"}>
                      {browserInfo.permissions ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Secure Context:</span>
                    <Badge variant={browserInfo.secureContext ? "default" : "destructive"}>
                      {browserInfo.secureContext ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">デバッグツール</h3>
                <div className="space-y-2">
                  <Button onClick={checkBrowserSupport} size="sm" variant="outline">
                    ブラウザ情報取得
                  </Button>
                  <Button onClick={testCameraPermission} size="sm" variant="outline">
                    カメラ権限確認
                  </Button>
                  <Button onClick={listCameras} size="sm" variant="outline">
                    カメラ一覧表示
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* カメラテスト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 身分証明書撮影テスト */}
          <CameraCapture
            onCapture={handleDocumentCapture}
            title="身分証明書撮影テスト"
            description="身分証明書の撮影をテストします"
            aspectRatio="landscape"
            maxWidth={1280}
            maxHeight={720}
          />

          {/* セルフィー撮影テスト */}
          <CameraCapture
            onCapture={handleSelfieCapture}
            title="セルフィー撮影テスト"
            description="セルフィーの撮影をテストします"
            aspectRatio="portrait"
            maxWidth={640}
            maxHeight={960}
          />
        </div>

        {/* 撮影結果 */}
        {(documentImage || selfieImage) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>撮影結果</CardTitle>
              <CardDescription>撮影された画像の情報</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentImage && (
                  <div>
                    <h3 className="font-medium mb-2">身分証明書</h3>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">サイズ:</span> {Math.round(documentImage.length / 1024)}KB
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">形式:</span> {documentImage.substring(0, 30)}...
                      </div>
                      <img
                        src={documentImage}
                        alt="身分証明書"
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  </div>
                )}
                {selfieImage && (
                  <div>
                    <h3 className="font-medium mb-2">セルフィー</h3>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">サイズ:</span> {Math.round(selfieImage.length / 1024)}KB
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">形式:</span> {selfieImage.substring(0, 30)}...
                      </div>
                      <img
                        src={selfieImage}
                        alt="セルフィー"
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* トラブルシューティング */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>トラブルシューティング</CardTitle>
            <CardDescription>よくある問題と解決方法</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>カメラが起動しない場合:</strong><br />
                  • ブラウザのカメラ権限を確認してください<br />
                  • HTTPS接続でアクセスしているか確認してください<br />
                  • 他のアプリケーションでカメラを使用していないか確認してください
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>撮影ができない場合:</strong><br />
                  • カメラが正常に起動しているか確認してください<br />
                  • ブラウザのコンソールでエラーメッセージを確認してください<br />
                  • 別のブラウザで試してみてください
                </AlertDescription>
              </Alert>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>推奨ブラウザ:</strong><br />
                  • Chrome (最新版)<br />
                  • Firefox (最新版)<br />
                  • Safari (最新版)<br />
                  • Edge (最新版)
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 