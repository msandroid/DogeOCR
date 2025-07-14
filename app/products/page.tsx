import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Eye, Zap, Users, Globe } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">プロダクト</h1>
        <p className="text-lg text-muted-foreground">
          Doge Worksが提供するAI技術を活用した文書処理と身分証明書検証のAPIサービス
        </p>
      </div>

      {/* Main Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Doge OCR API */}
        <Card className="relative overflow-hidden border-2 border-primary">
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground">人気</Badge>
          </div>
          <CardHeader className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Doge OCR API</CardTitle>
                <CardDescription className="text-base">高精度な文書処理API</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <p className="text-muted-foreground mb-6">
              AIを活用した高精度なOCR機能で、請求書、レシート、各種帳票からデータを自動抽出。
              2つの提供方法でお客様のニーズに合わせた選択が可能です。
            </p>
            
            {/* API提供 */}
            <div className="mb-8 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                API提供（クラウド処理）
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                画像とプロンプトをFireworks.ai APIに送信し、クラウドで高精度な処理結果を取得
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• 高精度なAI処理（Fireworks.ai使用）</li>
                <li>• スケーラブルなクラウド処理</li>
                <li>• インフラ管理不要</li>
                <li>• 従量課金制</li>
              </ul>
            </div>

            {/* SDK提供 */}
            <div className="mb-6 p-4 border rounded-lg bg-green-50">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                SDK提供（ローカル処理）
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                EasyOCRとllama.cppを組み合わせたローカル環境での処理
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• データがローカルに留まりセキュア</li>
                <li>• ネットワーク接続不要</li>
                <li>• ランニングコスト削減</li>
                <li>• カスタマイズ可能</li>
              </ul>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-foreground">対応文書</h4>
              <div className="grid grid-cols-2 gap-2">
                {["請求書", "レシート", "申込書", "注文書", "身分証", "領収書"].map((doc) => (
                  <div
                    key={doc}
                    className="bg-secondary text-foreground py-1 px-3 rounded-md text-center text-xs"
                  >
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/docs">ドキュメント</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/demo">デモを試す</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Doge ID Verify API */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Badge variant="secondary">新機能</Badge>
          </div>
          <CardHeader className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Doge ID Verify API</CardTitle>
                <CardDescription className="text-base">身分証明書検証API</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <p className="text-muted-foreground mb-6">
              身分証明書の真正性を自動検証するAPI。運転免許証、パスポート、マイナンバーカードなどの
              偽造検出と情報抽出により、本人確認プロセスを安全かつ効率的に実行します。
            </p>
            
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-foreground">主な機能</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-blue-600" />
                  偽造検出・真正性検証
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 text-blue-600" />
                  顔写真の品質チェック
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 text-blue-600" />
                  個人情報の自動抽出
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-blue-600" />
                  データ整合性チェック
                </li>
              </ul>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-foreground">対応身分証</h4>
              <div className="grid grid-cols-2 gap-2">
                {["運転免許証", "パスポート", "マイナンバー", "在留カード", "健康保険証", "学生証"].map((doc) => (
                  <div
                    key={doc}
                    className="bg-blue-50 text-blue-800 py-1 px-3 rounded-md text-center text-xs"
                  >
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href="/docs">ドキュメント</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/contact">お問い合わせ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Benefits */}
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">統合のメリット</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-600 mx-auto mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">統一されたAPI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                単一のAPIキーで両方のサービスにアクセス。統合された認証システムで開発が簡単。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">完全な文書処理</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                文書からのデータ抽出と身分証明書検証を組み合わせた包括的なソリューション。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-600 mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">スケーラブル</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                高可用性とスケーラビリティを備えたクラウドインフラで安定したサービスを提供。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 