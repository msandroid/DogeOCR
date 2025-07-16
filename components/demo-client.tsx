"use client"

import { handleImageUpload } from "@/app/actions/demo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRef, useState, useTransition } from "react"
import { Send, Image as ImageIcon, FileText, CheckCircle, AlertCircle, Plus, Clock, Target, X } from "lucide-react"
import Image from "next/image"

interface OcrResult {
  extractedText: string
  structuredData?: any
  documentType?: string
  processingTime?: number
  apiVersion?: string
  confidence?: number
  error?: string
}

export default function DemoClient() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<{
    imagePreview: string | null
    ocrResult: OcrResult | null
  }>({
    imagePreview: null,
    ocrResult: null,
  })

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [prompt, setPrompt] = useState("")
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
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setLocalPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    console.log('Form submitted', { 
      selectedFile: selectedFile?.name, 
      prompt, 
      isPending 
    })
    
    // ファイルまたはプロンプトがない場合は送信を停止
    if (!selectedFile && !prompt.trim()) {
      console.log('No file or prompt, preventing submission')
      return
    }

    const formData = new FormData(e.currentTarget)
    if (selectedFile) {
      formData.set('image', selectedFile)
    }
    if (prompt.trim()) {
      formData.set('chatPrompt', prompt.trim())
    }

    startTransition(async () => {
      try {
        const result = await handleImageUpload(state, formData)
        setState(result)
      } catch (error) {
        console.error('Upload error:', error)
        setState(prev => ({
          ...prev,
          ocrResult: {
            extractedText: '',
            error: `処理中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`
          }
        }))
      }
    })
  }

  const ocrResult = state.ocrResult as OcrResult | null

  // OCR実行中またはエラー時のdoge画像表示コンポーネント
  const DogeStatusDisplay = ({ isLoading, error }: { isLoading: boolean, error?: string }) => {
    if (!isLoading && !error) return null
    
    return (
      <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
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
          </div>
          <div className="text-foreground">
            {isLoading ? (
              <div className="space-y-2">
                <p className="text-lg font-medium">OCR processing...</p>
              </div>
            ) : error ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-red-500">Much error, such sad</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* メインタイトル */}
      {!state.imagePreview && !ocrResult && !localPreview && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-foreground mb-4">Which document would you like to scan?</h1>
        </div>
      )}

      {/* ファイルプレビュー表示 */}
      {localPreview && (
        <div className="w-full max-w-2xl mb-6">
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">ファイルアップロード完了</span>
                </div>
                {selectedFile && (
                  <div className="text-xs text-muted-foreground">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative bg-muted rounded-lg overflow-hidden">
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
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="relative bg-card rounded-2xl border border-border">
            <div className="flex items-center p-4">
              {/* プラスボタン */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                disabled={isPending}
                className="mr-3 h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Plus className="h-4 w-4" />
              </Button>

              {/* テキスト入力 */}
              <Input
                type="text"
                name="chatPrompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything or describe what you want to extract..."
                className="flex-1 bg-transparent border-none text-foreground placeholder-muted-foreground focus:ring-0 focus-visible:ring-0 text-base"
                disabled={isPending}
              />

              {/* 送信ボタン */}
              <Button
                type="submit"
                disabled={isPending || (!selectedFile && !prompt.trim())}
                size="sm"
                className="ml-3 h-8 w-8 p-0 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg disabled:opacity-50"
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
              <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                  <div className="text-xs text-muted-foreground">
                    画像のみ対応（JPEG, JPG, PNG, GIF, WEBP, HEIC）<br />
                    <span className="text-green-500 font-semibold">※ 4MB以下のみ対応</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 結果表示エリア */}
      <div className="w-full max-w-6xl mt-8 space-y-6">
        {/* 統計情報 */}
        {ocrResult && !ocrResult.error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">信頼度</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {ocrResult.confidence ? `${Math.round(ocrResult.confidence * 100)}%` : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">処理時間</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {ocrResult.processingTime ? `${(ocrResult.processingTime / 1000).toFixed(2)}秒` : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">文書種別</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {ocrResult.documentType || '不明'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* プレビューエリア */}
        {state.imagePreview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <ImageIcon className="h-5 w-5" />
                <span>画像解析結果</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img
                  src={state.imagePreview}
                  alt="Preview"
                  className="w-full max-h-[500px] object-contain rounded-lg border border-border"
                />
                
                {/* エラー時のdoge表示 */}
                {ocrResult?.error && (
                  <DogeStatusDisplay isLoading={false} error={ocrResult.error} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 結果タブ */}
        {ocrResult && (
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">テキスト</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="metadata">詳細情報</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="p-6">
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 border border-border">
                      <div className="text-sm text-foreground overflow-auto whitespace-pre-wrap break-words">
                        {ocrResult.error ? (
                          <span className="text-red-400">{ocrResult.error}</span>
                        ) : (
                          ocrResult.structuredData && ocrResult.structuredData.content_description ? (
                            <span>{ocrResult.structuredData.content_description}</span>
                          ) : (
                            <span className="text-muted-foreground">説明文はありません</span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="json" className="p-6">
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 border border-border">
                      <pre className="text-sm text-foreground overflow-auto whitespace-pre-wrap break-words">
                        {ocrResult.error ? (
                          <span className="text-red-400">{ocrResult.error}</span>
                        ) : ocrResult.structuredData && ocrResult.structuredData.extracted_data ? (
                          JSON.stringify(ocrResult.structuredData.extracted_data, null, 2)
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-400">有効なextracted_dataがありません</span>
                        )}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">処理詳細</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <h4 className="text-foreground font-medium mb-2">認識情報</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">文書種別</span>
                            <Badge className="bg-primary text-primary-foreground">
                              {ocrResult.documentType || '不明'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">信頼度</span>
                            <span className="text-foreground font-medium">
                              {ocrResult.confidence ? `${Math.round(ocrResult.confidence * 100)}%` : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">構造化データ</span>
                            <span className="text-foreground font-medium">
                              {ocrResult.structuredData ? '利用可能' : '利用不可'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-card rounded-lg p-4 border border-border">
                        <h4 className="text-foreground font-medium mb-2">パフォーマンス</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">処理時間</span>
                            <span className="text-foreground font-medium">
                              {ocrResult.processingTime ? `${(ocrResult.processingTime / 1000).toFixed(2)}秒` : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">APIバージョン</span>
                            <span className="text-foreground font-medium">
                              {ocrResult.apiVersion || 'v1.0'}
                            </span>
                          </div>
                        </div>
                      </div>
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
