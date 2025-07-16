import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, FileText, Zap, Shield, Globe } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Doge OCR API ドキュメント</h1>
          <p className="text-xl text-muted-foreground">画像からテキストを抽出するOCR API</p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline">v1.0</Badge>
            <Badge variant="outline">REST API</Badge>
            <Badge variant="outline">JSON</Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="endpoints">エンドポイント</TabsTrigger>
            <TabsTrigger value="examples">使用例</TabsTrigger>
            <TabsTrigger value="types">型定義</TabsTrigger>
            <TabsTrigger value="errors">エラー</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  API概要
                </CardTitle>
                <CardDescription>
                  Doge OCR APIの基本情報と機能
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">高速処理</h3>
                      <p className="text-sm text-gray-600">最新のAI技術による高速OCR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">高精度</h3>
                      <p className="text-sm text-gray-600">日本語文書に最適化</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <Globe className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">多言語対応</h3>
                      <p className="text-sm text-gray-600">日本語・英語・その他</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">対応画像形式</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">JPEG</Badge>
                    <Badge variant="secondary">PNG</Badge>
                    <Badge variant="secondary">GIF</Badge>
                    <Badge variant="secondary">WEBP</Badge>
                    <Badge variant="secondary">HEIC</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">対応文書種別</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">身分証明書</Badge>
                    <Badge variant="outline">運転免許証</Badge>
                    <Badge variant="outline">パスポート</Badge>
                    <Badge variant="outline">請求書</Badge>
                    <Badge variant="outline">レシート</Badge>
                    <Badge variant="outline">名刺</Badge>
                    <Badge variant="outline">その他</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>POST /api/ocr</CardTitle>
                <CardDescription>画像をOCR処理してテキストを抽出</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">リクエスト</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm">
{`{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  "prompt": "この画像から名前と住所を抽出してください", // オプション
  "mimeType": "image/jpeg" // オプション
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">レスポンス（成功時）</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm">
{`{
  "success": true,
  "data": {
    "extractedText": "抽出されたテキスト",
    "structuredData": {
      "document_type": "運転免許証",
      "extracted_data": {
        "name": "山田太郎",
        "address": "東京都新宿区..."
      }
    },
    "documentType": "運転免許証",
    "processingTime": 1234,
    "apiVersion": "v1.0",
    "confidence": 0.95
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">レスポンス（エラー時）</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <pre className="text-sm">
{`{
  "success": false,
  "error": "エラーメッセージ",
  "details": "詳細情報（オプション）"
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /api/ocr</CardTitle>
                <CardDescription>API仕様情報を取得</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  このエンドポイントはAPI仕様書とサンプルコードを返します。
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  使用例
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">cURL</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
                    <pre className="text-sm">
{`curl -X POST https://your-domain.com/api/ocr \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "prompt": "この画像から名前と住所を抽出してください"
  }'`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">JavaScript (fetch)</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
                    <pre className="text-sm">
{`const response = await fetch('/api/ocr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
    prompt: 'この画像から名前と住所を抽出してください'
  })
});

const result = await response.json();
if (result.success) {
  console.log('抽出されたテキスト:', result.data.extractedText);
  console.log('文書種別:', result.data.documentType);
  console.log('処理時間:', result.data.processingTime, 'ms');
} else {
  console.error('エラー:', result.error);
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Python</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
                    <pre className="text-sm">
{`import requests
import base64

# 画像をBase64エンコード
with open('image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode()

response = requests.post('https://your-domain.com/api/ocr', 
    json={
        'image': f'data:image/jpeg;base64,{image_data}',
        'prompt': 'この画像から名前と住所を抽出してください'
    }
)

result = response.json()
if result['success']:
    print('抽出されたテキスト:', result['data']['extractedText'])
    print('文書種別:', result['data']['documentType'])
    print('処理時間:', result['data']['processingTime'], 'ms')
else:
    print('エラー:', result['error'])`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>型定義</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">OCRRequest</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm">
{`interface OCRRequest {
  image: string;        // Base64エンコードされた画像データ
  prompt?: string;      // カスタムプロンプト（オプション）
  mimeType?: string;    // 画像のMIMEタイプ（オプション）
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">OCRResponse</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm">
{`interface OCRResponse {
  success: boolean;
  data?: {
    extractedText: string;      // 抽出されたテキスト
    structuredData?: any;       // 構造化されたデータ
    documentType: string;       // 文書種別
    processingTime: number;     // 処理時間（ミリ秒）
    apiVersion: string;         // APIバージョン
    confidence: number;         // 認識率（0-1）
  };
  error?: string;              // エラーメッセージ
  details?: any;               // 詳細情報
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>エラーコード</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-red-700">400 Bad Request</h3>
                    <p className="text-sm text-gray-600">リクエストボディが不正、または画像データが無効</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-yellow-700">500 Internal Server Error</h3>
                    <p className="text-sm text-gray-600">APIキーが設定されていない、またはサーバー内部エラー</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-blue-700">502 Bad Gateway</h3>
                    <p className="text-sm text-gray-600">外部OCR APIとの通信エラー</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>制限事項</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 画像ファイルサイズ: 最大10MB</li>
                  <li>• 対応形式: JPEG, PNG, GIF, WEBP, HEIC</li>
                  <li>• Base64エンコードが必要</li>
                  <li>• 処理時間: 通常1-5秒</li>
                  <li>• レート制限: 実装予定</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
