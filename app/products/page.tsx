import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Eye, Zap, Users, Globe, ArrowRight, CheckCircle } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mx-auto max-w-5xl text-center mb-16">
        <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          プロダクト
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Doge Worksが提供するAI技術を活用した文書処理と身分証明書検証のAPIサービス
        </p>
      </div>

      {/* Main Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto">
        {/* Doge OCR API */}
        <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group h-full">
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground animate-pulse">人気</Badge>
          </div>
          <CardHeader className="p-8 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Doge OCR API</CardTitle>
                <CardDescription className="text-lg">高精度な文書処理API</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex flex-col h-full">
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              AIを活用した高精度なOCR機能で、請求書、レシート、各種帳票からデータを自動抽出。
              クラウド処理とローカル処理の2つの提供方法でお客様のニーズに合わせた選択が可能です。
            </p>
            
            {/* API提供 */}
            <div className="mb-6 p-5 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-base">
                <Globe className="h-5 w-5 text-blue-600" />
                API提供（クラウド処理）
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                画像とプロンプトをVison AI APIに送信し、クラウドで高精度な処理結果を取得
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  高精度なAI処理（Fireworks.ai使用）
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  スケーラブルなクラウド処理
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  インフラ管理不要
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  従量課金制
                </li>
              </ul>
            </div>

            {/* SDK提供 */}
            <div className="mb-8 p-5 border border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-green-600" />
                SDK提供（ローカル処理）開発予定
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                EasyOCRとllama.cppを組み合わせたローカル環境での処理
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  データがローカルに留まりセキュア
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  ネットワーク接続不要
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  ランニングコスト削減
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  カスタマイズ可能
                </li>
              </ul>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-foreground text-lg">このような文書に対応できます</h4>
              <div className="grid grid-cols-2 gap-3">
                {["請求書", "レシート", "申込書", "注文書", "身分証", "領収書"].map((doc) => (
                  <div
                    key={doc}
                    className="bg-secondary/50 text-foreground py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-secondary transition-colors duration-200"
                  >
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <Button variant="outDoge" asChild className="w-full group-hover:scale-105 transition-transform duration-200 text-base py-3">
                <Link href="/demo" className="flex items-center justify-center gap-2">
                  デモを試す
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Doge ID Verify API */}
        <Card className="relative overflow-hidden border-2 border-blue-200/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-xl group h-full">
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="animate-pulse">新機能</Badge>
          </div>
          <CardHeader className="p-8 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Doge ID Verify API</CardTitle>
                <CardDescription className="text-lg">身分証明書検証API</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex flex-col h-full">
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              身分証明書の真正性を自動検証するAPI。運転免許証、パスポート、マイナンバーカードなどの
              偽造検出と情報抽出により、本人確認プロセスを安全かつ効率的に実行します。
            </p>
            
            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-foreground text-lg">主な機能</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>偽造検出・真正性検証</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                  <Eye className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>顔写真の品質チェック</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>個人情報の自動抽出</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                  <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>データ整合性チェック</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-foreground text-lg">対応身分証</h4>
              <div className="grid grid-cols-2 gap-3">
                {["運転免許証", "パスポート", "マイナンバー", "在留カード", "健康保険証", "学生証"].map((doc) => (
                  <div
                    key={doc}
                    className="bg-blue-50 text-blue-800 py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                  >
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-base py-3 group-hover:scale-105 transition-transform duration-200">
                <Link href="/docs" className="flex items-center justify-center gap-2">
                  ドキュメント
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
              <Button variant="outDoge" asChild className="flex-1 text-base py-3 group-hover:scale-105 transition-transform duration-200">
                <Link href="/contact" className="flex items-center justify-center gap-2">
                  お問い合わせ
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Benefits */}
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          統合のメリット
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300 group border-2 border-green-200/20 hover:border-green-400/40">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold">統一されたAPI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                単一のAPIキーで両方のサービスにアクセス。統合された認証システムで開発が簡単。
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 group border-2 border-blue-200/20 hover:border-blue-400/40">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold">完全な文書処理</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                文書からのデータ抽出と身分証明書検証を組み合わせた包括的なソリューション。
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 group border-2 border-purple-200/20 hover:border-purple-400/40">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold">スケーラブル</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                高可用性とスケーラビリティを備えたクラウドインフラで安定したサービスを提供。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 