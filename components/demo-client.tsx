"use client"

import { useActionState } from "react"
import { handleImageUpload } from "@/app/actions/demo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRef, useState } from "react"
import { Send, Image as ImageIcon, Globe, FileText, CheckCircle, AlertCircle, Plus, Clock, Target, Layers, X, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface Coordinate {
  x: number
  y: number
  width: number
  height: number
}

interface TextBlock {
  text: string
  coordinates: Coordinate
  confidence: number
  language?: string
  fontSize?: number
  fontStyle?: string
}

interface ImageInfo {
  width?: number
  height?: number
  rotation?: number
  skew?: number
}

interface OcrResult {
  language?: string
  type?: string
  extractedText: string
  textBlocks?: TextBlock[]
  structuredData?: any
  result?: "success" | "uncertain"
  overallConfidence?: number
  imageInfo?: ImageInfo
  processingTime?: number
  error?: string
}

export default function DemoClient() {
  const [state, sendAction, isPending] = useActionState(handleImageUpload, {
    imagePreview: null,
    ocrResult: null,
  })

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [prompt, setPrompt] = useState("")
  const [showOverlay, setShowOverlay] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ファイル形式チェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
      const fileExtension = file.name.toLowerCase().split('.').pop()
      const isHEIC = fileExtension === 'heic' || fileExtension === 'heif'
      
      if (!allowedTypes.includes(file.type) && !isHEIC) {
        alert('サポートされていないファイル形式です。JPEG、PNG、GIF、WEBP、またはHEIC形式の画像ファイルを選択してください。')
        return
      }

      // ファイルサイズチェック (10MB制限)
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズが大きすぎます。10MB以下のファイルを選択してください。')
        return
      }

      setSelectedFile(file)
      
      // ローカルプレビューを作成
      const reader = new FileReader()
      reader.onload = (event) => {
        setLocalPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // 画像選択後は自動送信しない（送信ボタンを押してもらう）
      // formRef.current?.requestSubmit()
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setLocalPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Server Actionが正常に動作するかデバッグ
    console.log('Form submitted', { 
      selectedFile: selectedFile?.name, 
      prompt, 
      isPending 
    })
    
    // ファイルまたはプロンプトがない場合は送信を停止
    if (!selectedFile && !prompt.trim()) {
      e.preventDefault()
      console.log('No file or prompt, preventing submission')
      return
    }
  }

  const ocrResult = state.ocrResult as OcrResult | null

  // 座標オーバーレイコンポーネント
  const CoordinateOverlay = ({ textBlocks, imageElement }: { textBlocks: TextBlock[], imageElement: HTMLImageElement | null }) => {
    if (!textBlocks || !imageElement) return null

    const imageRect = imageElement.getBoundingClientRect()
    const imageNaturalWidth = imageElement.naturalWidth
    const imageNaturalHeight = imageElement.naturalHeight
    const imageDisplayWidth = imageElement.clientWidth
    const imageDisplayHeight = imageElement.clientHeight

    const scaleX = imageDisplayWidth / imageNaturalWidth
    const scaleY = imageDisplayHeight / imageNaturalHeight

    return (
      <div className="absolute inset-0 pointer-events-none">
        {textBlocks.map((block, index) => (
          <div
            key={index}
            className="absolute border-2 border-blue-400 bg-blue-400/10 backdrop-blur-sm"
            style={{
              left: `${block.coordinates.x * scaleX}px`,
              top: `${block.coordinates.y * scaleY}px`,
              width: `${block.coordinates.width * scaleX}px`,
              height: `${block.coordinates.height * scaleY}px`,
            }}
          >
            <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-1 rounded">
              {block.confidence}%
            </div>
          </div>
        ))}
      </div>
    )
  }

  // OCR実行中またはエラー時のdoge画像表示コンポーネント
  const DogeStatusDisplay = ({ isLoading, error }: { isLoading: boolean, error?: string }) => {
    if (!isLoading && !error) return null
    
    return (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-lg">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative">
            <Image
              src="/images/doge.webp"
              alt="Doge"
              width={120}
              height={120}
              className={`rounded-full ${isLoading ? 'animate-pulse' : ''}`}
              priority
            />
            {isLoading && (
              <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
          </div>
          <div className="text-white">
            {isLoading ? (
              <div className="space-y-2">
                <p className="text-lg font-medium">Such OCR processing...</p>
                <p className="text-sm text-gray-300">Much analyze, very text recognition</p>
              </div>
            ) : error ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-red-400">Much error, such sad</p>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* メインタイトル */}
      {!state.imagePreview && !ocrResult && !localPreview && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-white mb-4">Which document would you like to scan?</h1>
        </div>
      )}

      {/* ファイルプレビュー表示 */}
      {localPreview && (
        <div className="w-full max-w-2xl mb-6">
          <div className="bg-gray-950 rounded-2xl border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">ファイルアップロード完了</span>
                </div>
                {selectedFile && (
                  <div className="text-xs text-gray-400">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={localPreview} 
                alt="アップロードされた画像" 
                className="w-full h-auto max-h-60 object-contain"
              />
              <DogeStatusDisplay isLoading={isPending} />
            </div>
          </div>
        </div>
      )}

      {/* チャット風入力フォーム */}
      <div className="w-full max-w-2xl">
        <form ref={formRef} action={sendAction} onSubmit={handleSubmit}>
          <div className="relative bg-gray-950 rounded-2xl border border-gray-800">
            <div className="flex items-center p-4">
              {/* プラスボタン */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                disabled={isPending}
                className="mr-3 h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
              </Button>

              {/* テキスト入力 */}
              <Input
                type="text"
                name="chatPrompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 bg-transparent border-none text-gray-300 placeholder-gray-500 focus:ring-0 focus-visible:ring-0 text-base"
                disabled={isPending}
              />

              {/* 送信ボタン */}
              <Button
                type="submit"
                disabled={isPending || (!selectedFile && !prompt.trim())}
                size="sm"
                className="ml-3 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50"
              >
                {isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>

              {/* 隠されたファイル入力 */}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*,.heic,.heif"
                className="hidden"
                disabled={isPending}
                onChange={handleFileChange}
              />
            </div>

            {/* ツールバー */}
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  {selectedFile && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">
                        {selectedFile.type.split('/')[1]?.toUpperCase() || 
                         selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'} • {(selectedFile.size / 1024).toFixed(1)}KB
                      </span>
                    </div>
                  )}
                </div>
                {(localPreview || state.imagePreview) && (
                  <div className="text-xs text-gray-500">
                    画像のみ対応（JPEG, PNG, GIF, WEBP, HEIC）
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 結果表示エリア */}
      <div className="w-full max-w-6xl mt-8 space-y-6">
        {/* 総合統計情報 */}
        {ocrResult && !ocrResult.error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-black border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-400">全体信頼度</span>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-white">
                    {ocrResult.overallConfidence ? `${ocrResult.overallConfidence}%` : 'N/A'}
                  </p>
                  {ocrResult.overallConfidence && (
                    <Progress value={ocrResult.overallConfidence} className="h-2" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-400">検出言語</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {ocrResult.language || 'Unknown'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* プレビューエリア（座標オーバーレイ付き） */}
        {state.imagePreview && (
          <Card className="bg-gray-800 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>画像解析結果</span>
                </div>
                {ocrResult?.textBlocks && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverlay(!showOverlay)}
                    className="text-gray-300 border-gray-600"
                  >
                    {showOverlay ? '座標を非表示' : '座標を表示'}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img
                  ref={imageRef}
                  src={state.imagePreview}
                  alt="Preview"
                  className="w-full max-h-[500px] object-contain rounded-lg border border-gray-600"
                  onLoad={() => {
                    // 画像読み込み後に座標オーバーレイを更新
                    if (imageRef.current && ocrResult?.textBlocks && showOverlay) {
                      // フォースリレンダリング
                      setShowOverlay(false)
                      setTimeout(() => setShowOverlay(true), 10)
                    }
                  }}
                />
                {showOverlay && ocrResult?.textBlocks && (
                  <CoordinateOverlay 
                    textBlocks={ocrResult.textBlocks} 
                    imageElement={imageRef.current}
                  />
                )}
                {/* エラー時のdoge表示 */}
                {ocrResult?.error && (
                  <DogeStatusDisplay isLoading={false} error={ocrResult.error} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 詳細結果タブ */}
        {ocrResult && (
          <Card className="bg-black border-gray-800">
            <CardContent className="p-0">
              <Tabs defaultValue="structured" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="structured" className="text-gray-300">構造化データ</TabsTrigger>
                  <TabsTrigger value="textblocks" className="text-gray-300">座標付きテキスト</TabsTrigger>
                  <TabsTrigger value="raw" className="text-gray-300">生テキスト</TabsTrigger>
                  <TabsTrigger value="metadata" className="text-gray-300">メタデータ</TabsTrigger>
                </TabsList>

                <TabsContent value="structured" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-white" />
                      <h3 className="text-lg font-semibold text-white">構造化データ</h3>
                      {ocrResult.result && (
                        <Badge className={ocrResult.result === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                          {ocrResult.result === "success" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {ocrResult.result}
                        </Badge>
                      )}
                    </div>
                    <div className="bg-black rounded-lg p-4">
                      <pre className="text-sm text-gray-300 overflow-auto whitespace-pre-wrap break-words">
                        {ocrResult.structuredData ? 
                          JSON.stringify(ocrResult.structuredData, null, 2) : 
                          'No structured data available'
                        }
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="textblocks" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">座標付きテキストブロック</h3>
                    {ocrResult.textBlocks ? (
                      <div className="space-y-3">
                        {ocrResult.textBlocks.map((block, index) => (
                          <div key={index} className="bg-black rounded-lg p-4 border border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">Block {index + 1}</span>
                              <div className="flex space-x-2">
                                <Badge className="bg-blue-600 text-white">
                                  信頼度: {block.confidence}%
                                </Badge>
                                {block.language && (
                                  <Badge className="bg-purple-600 text-white">
                                    {block.language}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-300 mb-2">"{block.text}"</p>
                            <div className="text-sm text-gray-400">
                              座標: ({block.coordinates.x}, {block.coordinates.y}) 
                              サイズ: {block.coordinates.width} × {block.coordinates.height}
                              {block.fontSize && ` | フォントサイズ: ${block.fontSize}px`}
                              {block.fontStyle && ` | スタイル: ${block.fontStyle}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">座標情報が利用できません</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">抽出テキスト</h3>
                    <div className="bg-black rounded-lg p-4">
                      <pre className="text-sm text-gray-300 overflow-auto whitespace-pre-wrap break-words">
                        {ocrResult.error ? (
                          <span className="text-red-400">{ocrResult.error}</span>
                        ) : (
                          ocrResult.extractedText
                        )}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">画像メタデータ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ocrResult.imageInfo && (
                        <>
                          <div className="bg-black rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2">画像サイズ</h4>
                            <p className="text-gray-300">
                              {ocrResult.imageInfo.width} × {ocrResult.imageInfo.height} px
                            </p>
                          </div>
                          <div className="bg-black rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2">回転角度</h4>
                            <p className="text-gray-300">{ocrResult.imageInfo.rotation || 0}°</p>
                          </div>
                          <div className="bg-black rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2">スキュー角度</h4>
                            <p className="text-gray-300">{ocrResult.imageInfo.skew || 0}°</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
