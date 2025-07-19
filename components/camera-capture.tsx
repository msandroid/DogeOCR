"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, RotateCcw, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  title: string
  description: string
  aspectRatio?: "square" | "portrait" | "landscape"
  maxWidth?: number
  maxHeight?: number
  useFrontCamera?: boolean
}

export default function CameraCapture({
  onCapture,
  title,
  description,
  aspectRatio = "portrait",
  maxWidth = 640,
  maxHeight = 480,
  useFrontCamera = false
}: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const { toast } = useToast()

  // カメラストリームの開始
  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // カメラ権限の確認
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("このブラウザはカメラ機能をサポートしていません")
      }

      const constraints = {
        video: {
          width: { ideal: maxWidth },
          height: { ideal: maxHeight },
          facingMode: useFrontCamera ? "user" : "environment" // フロントカメラまたは背面カメラ
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
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

      // 画像データを取得
      const imageData = canvas.toDataURL("image/jpeg", 0.8)
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
      toast({
        title: "撮影エラー",
        description: "画像の撮影に失敗しました。",
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4" />
          {title}
        </CardTitle>
        <CardDescription className="text-xs">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* カメラプレビュー */}
          {!capturedImage && (
            <div className={`relative ${getAspectRatioClass()} bg-black rounded-lg overflow-hidden`}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-sm">カメラ起動中...</div>
                </div>
              )}
              
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                    <div className="text-sm">{error}</div>
                    <Button
                      onClick={startCamera}
                      size="sm"
                      className="mt-2"
                      variant="secondary"
                    >
                      再試行
                    </Button>
                  </div>
                </div>
              )}
              
              {!isLoading && !error && !isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">カメラを起動してください</div>
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
              
              {/* 隠しキャンバス要素（撮影用） */}
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* 撮影された画像 */}
          {capturedImage && (
            <div className={`relative ${getAspectRatioClass()} bg-black rounded-lg overflow-hidden`}>
              <img
                src={capturedImage}
                alt="撮影された画像"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  撮影完了
                </Badge>
              </div>
            </div>
          )}

          {/* 操作ボタン */}
          <div className="flex items-center gap-2">
            {!capturedImage && !isStreaming && !isLoading && (
              <Button
                onClick={startCamera}
                size="sm"
                className="flex items-center gap-2"
              >
                <Camera className="h-3 w-3" />
                カメラ起動
              </Button>
            )}
            
            {isStreaming && (
              <Button
                onClick={captureImage}
                size="sm"
                className="flex items-center gap-2"
              >
                <Camera className="h-3 w-3" />
                撮影
              </Button>
            )}
            
            {capturedImage && (
              <Button
                onClick={resetCapture}
                variant="outDoge"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-3 w-3" />
                再撮影
              </Button>
            )}
            
            {isStreaming && (
              <Button
                onClick={stopCamera}
                variant="outDoge"
                size="sm"
                className="flex items-center gap-2"
              >
                停止
              </Button>
            )}
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 