"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, RotateCcw, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  title: string
  description: string
  aspectRatio?: "square" | "portrait" | "landscape"
  maxWidth?: number
  maxHeight?: number
}

// Safari検出関数
const isSafari = () => {
  if (typeof navigator === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  return /safari/.test(userAgent) && !/chrome/.test(userAgent)
}

// iOS Safari検出関数
const isIOSSafari = () => {
  if (typeof navigator === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) && !/chrome/.test(userAgent)
}

export default function CameraCapture({
  onCapture,
  title,
  description,
  aspectRatio = "portrait",
  maxWidth = 640,
  maxHeight = 480
}: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSafariBrowser, setIsSafariBrowser] = useState(false)
  const [isIOSSafariBrowser, setIsIOSSafariBrowser] = useState(false)
  const [currentCamera, setCurrentCamera] = useState<"environment" | "user">("environment")
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const { toast } = useToast()

  // Safari検出
  useEffect(() => {
    const safari = isSafari()
    const iosSafari = isIOSSafari()
    setIsSafariBrowser(safari)
    setIsIOSSafariBrowser(iosSafari)
  }, [])

  // 利用可能なカメラを取得
  const getAvailableCameras = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return []
      }

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setAvailableCameras(videoDevices)
      return videoDevices
    } catch (error) {
      console.error('カメラ一覧の取得に失敗:', error)
      return []
    }
  }

  // カメラストリームの開始
  const startCamera = async (facingMode?: "environment" | "user") => {
    try {
      setIsLoading(true)
      setError("")
      
      // 現在のストリームを停止
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      
      // カメラ権限の確認
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("このブラウザはカメラ機能をサポートしていません")
      }

      // 利用可能なカメラを取得
      const cameras = await getAvailableCameras()
      
      // Safari固有のカメラ設定
      let constraints
      if (isSafariBrowser) {
        // Safariではより基本的な設定を使用
        constraints = {
          video: {
            width: { ideal: Math.min(maxWidth, 1280) },
            height: { ideal: Math.min(maxHeight, 720) },
            // SafariではfacingModeの指定を避ける（iOS Safariの場合）
            ...(isIOSSafariBrowser ? {} : { facingMode: facingMode || currentCamera })
          }
        }
      } else {
        // 通常のブラウザの設定
        constraints = {
          video: {
            width: { ideal: maxWidth },
            height: { ideal: maxHeight },
            facingMode: facingMode || currentCamera
          }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (facingMode) {
        setCurrentCamera(facingMode)
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true)
          setIsLoading(false)
        }
        videoRef.current.onerror = () => {
          setError("ビデオストリームの読み込みに失敗しました")
          setIsLoading(false)
        }
      }
    } catch (err: any) {
      console.error("カメラ起動エラー:", err)
      let errorMessage = "カメラの起動に失敗しました"
      
      if (err.name === "NotAllowedError") {
        errorMessage = "カメラへのアクセスが拒否されました。ブラウザの設定でカメラ権限を許可してください。"
      } else if (err.name === "NotFoundError") {
        errorMessage = "カメラが見つかりません。デバイスにカメラが接続されているか確認してください。"
      } else if (err.name === "NotSupportedError") {
        errorMessage = "このブラウザはカメラ機能をサポートしていません。"
      } else if (err.name === "NotReadableError") {
        errorMessage = "カメラが他のアプリケーションで使用中です。"
      } else if (err.name === "OverconstrainedError") {
        // Safari固有のエラー処理
        if (isSafariBrowser) {
          errorMessage = "Safariでカメラ設定に問題が発生しました。ブラウザを更新するか、別のブラウザをお試しください。"
        } else {
          errorMessage = "カメラの設定に問題が発生しました。"
        }
      }
      
      setError(errorMessage)
      setIsLoading(false)
      
      toast({
        title: "カメラエラー",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  // カメラの切り替え
  const switchCamera = async () => {
    const newCamera = currentCamera === "environment" ? "user" : "environment"
    
    // 利用可能なカメラが2つ以上ある場合のみ切り替え
    if (availableCameras.length >= 2) {
      await startCamera(newCamera)
      toast({
        title: "カメラ切り替え",
        description: `${newCamera === "environment" ? "背面" : "前面"}カメラに切り替えました。`,
      })
    } else {
      toast({
        title: "カメラ切り替え",
        description: "利用可能なカメラが1つしかありません。",
        variant: "destructive"
      })
    }
  }

  // カメラストリームの停止
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }

  // 撮影
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      toast({
        title: "エラー",
        description: "カメラが準備できていません。",
        variant: "destructive"
      })
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) {
      toast({
        title: "エラー",
        description: "キャンバスコンテキストの取得に失敗しました。",
        variant: "destructive"
      })
      return
    }

    try {
      // キャンバスサイズを設定
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // ビデオフレームをキャンバスに描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Safari固有のBase64処理
      let imageData
      if (isSafariBrowser) {
        // Safariではより低い品質でBase64エンコード
        imageData = canvas.toDataURL("image/jpeg", 0.7)
      } else {
        // 通常のブラウザの処理
        imageData = canvas.toDataURL("image/jpeg", 0.8)
      }
      
      setCapturedImage(imageData)
      onCapture(imageData)

      // カメラを停止
      stopCamera()

      toast({
        title: "撮影完了",
        description: "画像が正常に撮影されました。",
      })
    } catch (error) {
      console.error("撮影エラー:", error)
      
      // Safari固有のエラーメッセージ
      let errorMessage = "画像の撮影に失敗しました。"
      if (isSafariBrowser) {
        errorMessage = "Safariで画像の撮影に失敗しました。ブラウザを更新するか、別のブラウザをお試しください。"
      }
      
      toast({
        title: "撮影エラー",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  // リセット
  const resetCapture = () => {
    setCapturedImage("")
    setError("")
    if (!isStreaming) {
      startCamera()
    }
  }

  // コンポーネントのアンマウント時にカメラを停止
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "portrait":
        return "aspect-[4/3]"
      case "landscape":
        return "aspect-[16/9]"
      default:
        return "aspect-[4/3]"
    }
  }

  const getCameraLabel = () => {
    return currentCamera === "environment" ? "背面カメラ" : "前面カメラ"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4" />
          {title}
          {isSafariBrowser && (
            <Badge variant="secondary" className="text-xs">
              Safari
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          {description}
          {isSafariBrowser && (
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!capturedImage && (
            <div className={`relative ${getAspectRatioClass()} bg-gray-100 rounded-lg overflow-hidden`}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
              
              {!isStreaming && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">カメラを起動してください</p>
                  </div>
                </div>
              )}
              
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
              />
              
              <canvas
                ref={canvasRef}
                className="hidden"
              />

              {/* カメラ切り替えボタン */}
              {isStreaming && availableCameras.length >= 2 && (
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={switchCamera}
                    size="sm"
                    variant="secondary"
                    className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {currentCamera === "environment" ? "前面" : "背面"}
                  </Button>
                </div>
              )}

              {/* 現在のカメラ表示 */}
              {isStreaming && (
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-black bg-opacity-50 text-white">
                    {getCameraLabel()}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {capturedImage && (
            <div className={`relative ${getAspectRatioClass()} bg-gray-100 rounded-lg overflow-hidden`}>
              <img
                src={capturedImage}
                alt="撮影された画像"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full p-1" />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!capturedImage && !isStreaming && !isLoading && (
              <Button
                onClick={() => startCamera()}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    起動中...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    カメラ起動
                  </>
                )}
              </Button>
            )}

            {isStreaming && !capturedImage && (
              <>
                <Button
                  onClick={captureImage}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  撮影
                </Button>
                                 {availableCameras.length >= 2 && (
                   <Button
                     onClick={switchCamera}
                     variant="secondary"
                     size="sm"
                   >
                     <RefreshCw className="h-3 w-3 mr-1" />
                     切り替え
                   </Button>
                 )}
              </>
            )}

            {capturedImage && (
              <Button
                onClick={resetCapture}
                variant="secondary"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                再撮影
              </Button>
            )}
          </div>

          {/* カメラ情報 */}
          {availableCameras.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <p>利用可能なカメラ: {availableCameras.length}台</p>
              <p>現在のカメラ: {getCameraLabel()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 