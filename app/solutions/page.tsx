"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useScrollReveal } from "@/components/ui/use-scroll-reveal"
import { 
  Lightbulb, 
  Zap, 
  ShieldCheck, 
  Globe, 
  FileText, 
  LayoutGrid, 
  Upload, 
  ScanText, 
  Database, 
  CheckCircle, 
  ArrowRight,
  Code,
  BarChart3,
  Users,
  Building2,
  CreditCard,
  FileCheck,
  Clock,
  Target,
  Sparkles,
  Cpu,
  Lock,
  Globe2,
  Smartphone,
  Server
} from "lucide-react"

export default function SolutionsPage() {
  const header = useScrollReveal<HTMLDivElement>()
  const features = useScrollReveal<HTMLDivElement>()
  const useCases = useScrollReveal<HTMLDivElement>()
  const workflow = useScrollReveal<HTMLDivElement>()
  const example = useScrollReveal<HTMLDivElement>()
  const techSpecs = useScrollReveal<HTMLDivElement>()
  const cta = useScrollReveal<HTMLDivElement>()

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div
          ref={header.ref}
          className={`relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 transition-all duration-700 ease-out ${header.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Document Processing
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
              画像を送るだけ。<br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                世界中のあらゆる文書を、
              </span><br />
              構造化JSONに。
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              DogeOCRは、どんな書式の文書でも画像をアップロードするだけでAIが読み取り、構造化されたJSONデータを提供します。
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground">2秒</div>
                <div className="text-muted-foreground">処理時間</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Globe2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground">100+</div>
                <div className="text-muted-foreground">対応文書形式</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Cpu className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-muted-foreground">認識精度</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        ref={features.ref}
        className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 transition-all duration-700 ease-out ${features.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">なぜDogeOCRなのか？</h2>
          <p className="text-xl text-muted-foreground">従来のOCRを超える革新的な機能</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">形式指定不要</CardTitle>
              <CardDescription className="text-base">
                パスポート、請求書、契約書、身分証明書など、あらゆる文書に柔軟対応。AIが自動で判別し、構造化します。
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-xl">最速2秒で変換</CardTitle>
              <CardDescription className="text-base">
                スキャンからJSON出力まで最短2秒。大量処理にも対応可能な超高速パフォーマンス。
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-xl">あらゆる用途に統合</CardTitle>
              <CardDescription className="text-base">
                eKYC、帳票管理、RPA、ドキュメント検索、業務自動化など、様々なユースケースに対応。
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle className="text-xl">多言語・多国籍対応</CardTitle>
              <CardDescription className="text-base">
                日本語・英語はもちろん、各国の身分証や書類フォーマットに対応。
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle className="text-xl">セキュアな処理</CardTitle>
              <CardDescription className="text-base">
                エンドツーエンド暗号化、GDPR準拠、データプライバシー保護。
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Server className="w-6 h-6 text-red-500" />
              </div>
              <CardTitle className="text-xl">高可用性</CardTitle>
              <CardDescription className="text-base">
                99.9%の稼働率、自動スケーリング、グローバルCDN対応。
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Use Cases Section */}
      <div
        ref={useCases.ref}
        className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 transition-all duration-700 ease-out ${useCases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">ユースケース</h2>
          <p className="text-xl text-muted-foreground">様々な業界で活用されています</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="pt-6">
              <Building2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-lg mb-2">金融・保険</CardTitle>
              <CardDescription>
                eKYC、契約書処理、請求書管理
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-lg mb-2">人事・採用</CardTitle>
              <CardDescription>
                履歴書処理、身分証明書確認
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="pt-6">
              <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <CardTitle className="text-lg mb-2">会計・税務</CardTitle>
              <CardDescription>
                領収書処理、税務申告書管理
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="pt-6">
              <Smartphone className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-lg mb-2">モバイルアプリ</CardTitle>
              <CardDescription>
                リアルタイム文書認識
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Section */}
      <div
        ref={workflow.ref}
        className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 transition-all duration-700 ease-out ${workflow.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">使い方はシンプル</h2>
          <p className="text-xl text-muted-foreground">3ステップで完了</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">1. 画像をアップロード</h3>
            <p className="text-muted-foreground">スマートフォンで撮影した画像やスキャンした文書をアップロード</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ScanText className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4">2. AIが自動解析</h3>
            <p className="text-muted-foreground">AIが文書の種類を自動判別し、重要な情報を抽出</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4">3. JSONで出力</h3>
            <p className="text-muted-foreground">構造化されたJSONデータとして即座に返却</p>
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div
        ref={example.ref}
        className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 transition-all duration-700 ease-out ${example.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">出力例</h2>
          <p className="text-xl text-muted-foreground">RFC8259準拠の構造化データ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                パスポート認識例
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-6 text-sm overflow-x-auto">
{`{
  "document_type": "パスポート",
  "confidence": 0.98,
  "fields": {
    "name": "TARO YAMADA",
    "passport_number": "AB1234567",
    "nationality": "JAPAN",
    "date_of_birth": "1990-01-01",
    "expiration_date": "2030-01-01",
    "issue_date": "2020-01-01"
  }
}`}
              </pre>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                請求書認識例
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-6 text-sm overflow-x-auto">
{`{
  "document_type": "請求書",
  "confidence": 0.95,
  "fields": {
    "invoice_number": "INV-2024-001",
    "total_amount": "50,000",
    "currency": "JPY",
    "due_date": "2024-12-31",
    "vendor_name": "株式会社サンプル",
    "customer_name": "株式会社テスト"
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Technical Specs */}
      <div
        ref={techSpecs.ref}
        className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 transition-all duration-700 ease-out ${techSpecs.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">技術仕様</h2>
          <p className="text-xl text-muted-foreground">開発者向け詳細情報</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                API仕様
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">エンドポイント</span>
                <span className="font-mono text-sm">POST /api/ocr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">認証</span>
                <span className="font-mono text-sm">Bearer Token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">形式</span>
                <span className="font-mono text-sm">JSON</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                パフォーマンス
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">処理時間</span>
                <span className="font-mono text-sm">平均2秒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">画像サイズ</span>
                <span className="font-mono text-sm">最大4MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">レート制限</span>
                <span className="font-mono text-sm">60req/min</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                対応形式
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">画像形式</span>
                <span className="font-mono text-sm">JPEG, PNG, WebP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">出力形式</span>
                <span className="font-mono text-sm">JSON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">言語</span>
                <span className="font-mono text-sm">日本語, 英語</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div
        ref={cta.ref}
        className={`mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center transition-all duration-700 ease-out ${cta.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-foreground mb-6">
              今すぐDogeOCRを体験
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              開発者向けAPIも提供中。あらゆるOCR処理を、より高速・柔軟に。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-lg flex items-center gap-3 group"
                asChild
              >
                <Link href="/auth/signin">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  無料で試す
                </Link>
              </Button>
              <Button
                variant="outDoge"
                className="font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-lg"
                asChild
              >
                <Link href="/demo">
                  <Code className="w-6 h-6 mr-2" />
                  APIデモ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
