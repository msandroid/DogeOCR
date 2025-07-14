import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Changed from bg-gray-50 */}
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Doge Works API ドキュメント</h1>
        {/* Changed from text-gray-900 */}
        <p className="text-lg text-muted-foreground">
          Doge Worksの強力なAPIを活用して、文書処理ワークフローを自動化しましょう。
        </p>
        {/* Changed from text-gray-700 */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-foreground" /> {/* Changed from no color */}
              Doge OCR API
            </CardTitle>
            <CardDescription>高精度なOCR機能を提供するAPI。2つの提供方法でお客様のニーズに対応。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* API提供 */}
              <div className="p-3 border rounded-lg bg-blue-50">
                <h4 className="font-semibold text-sm mb-2 text-blue-800">🌐 API提供（クラウド処理）</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  画像とプロンプトをFireworks.ai APIに送信し、高精度な処理結果を取得
                </p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">特徴:</span> スケーラブル、インフラ管理不要、従量課金
                </div>
              </div>
              
              {/* SDK提供 */}
              <div className="p-3 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-sm mb-2 text-green-800">⚡ SDK提供（ローカル処理）</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  EasyOCRとllama.cppを組み合わせたローカル環境での処理
                </p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">特徴:</span> セキュア、オフライン可能、コスト削減
                </div>
              </div>
            </div>
            <Link href="#" className="text-primary hover:underline block mt-4">
              {/* Changed from text-green-600 */}
              OCR API ドキュメント →
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-foreground" />
              Doge ID Verify API
            </CardTitle>
            <CardDescription>身分証明書の真正性を検証するAPI。運転免許証、パスポート、マイナンバーカードなどの検証に対応。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Doge ID Verify APIは、身分証明書の画像から情報を抽出し、真正性を検証します。
              偽造検出、顔写真の検証、データの整合性チェック機能を提供します。
            </p>
            <Link href="#" className="text-primary hover:underline">
              ID Verify API ドキュメント →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 追加のセクション */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">APIの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-foreground" />
                統合された認証システム
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                両方のAPIは統一されたAPIキーと認証システムを使用し、簡単に統合できます。
                単一のSDKで両方のサービスにアクセス可能です。
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-foreground" />
                リアルタイム処理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                高速な処理速度で、リアルタイムでの文書処理と身分証明書検証を実現します。
                平均応答時間は2秒以下です。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">ご不明な点がありますか？</h2>
        {/* Changed from text-gray-900 */}
        <p className="text-lg text-muted-foreground mb-6">
          {/* Changed from text-gray-700 */}
          よくある質問 (FAQ) を参照するか、サポートチームにお問い合わせください。
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
            asChild
          >
            <Link href="/faq">FAQ</Link>
          </Button>
          <Button
            variant="outline"
            className="border-input text-primary hover:bg-accent hover:text-primary-foreground font-bold py-3 px-6 rounded-lg shadow-md transition-colors bg-transparent"
            asChild
          >
            <Link href="/contact">お問い合わせ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
