"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image" // Imageコンポーネントをインポート
import { useScrollReveal } from "@/components/ui/use-scroll-reveal"
import { Lightbulb, Zap, ShieldCheck, Globe, FileText, LayoutGrid, Upload, ScanText, Database, CheckCircle, ArrowRight } from "lucide-react"

export default function SolutionsPage() {
  const header = useScrollReveal<HTMLDivElement>()
  const features = useScrollReveal<HTMLDivElement>()
  const usage = useScrollReveal<HTMLDivElement>()
  const example = useScrollReveal<HTMLDivElement>()
  const cta = useScrollReveal<HTMLDivElement>()

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div
        ref={header.ref}
        className={`mx-auto max-w-4xl text-left mb-24 transition-all duration-700 ease-out ${header.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h1 className="text-5xl font-bold text-foreground mb-6 text-left flex items-center gap-4">
          <FileText className="w-12 h-12 text-primary animate-bounce" />
          画像を送るだけ。<br />世界中のあらゆる文書を、構造化JSONに。
        </h1>
        <p className="text-2xl text-muted-foreground text-left mb-2">
          DogeOCRは、どんな文書・画像もアップロードするだけでAIが自動判別し、構造化されたJSONデータに変換します。
        </p>
      </div>

      {/* 特徴 */}
      <div
        ref={features.ref}
        className={`mx-auto max-w-4xl mb-24 transition-all duration-700 ease-out ${features.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <ul className="space-y-12 text-2xl text-left">
          <li className="flex items-center gap-4"><Lightbulb className="w-10 h-10 text-yellow-400 animate-fade-in" /><b>形式の指定不要</b> パスポート、請求書、契約書、身分証明書など、あらゆる文書に柔軟対応。AIが自動で判別し、構造化します。</li>
          <li className="flex items-center gap-4"><Zap className="w-10 h-10 text-blue-500 animate-bounce" /><b>最速2秒で変換</b> スキャンからJSON出力まで最短2秒。大量処理にも対応可能な超高速パフォーマンス。</li>
          <li className="flex items-center gap-4"><LayoutGrid className="w-10 h-10 text-green-500 animate-fade-in" /><b>あらゆる用途に統合可能</b> eKYC、帳票管理、RPA、ドキュメント検索、業務自動化など、様々なユースケースに対応。</li>
          <li className="flex items-center gap-4"><Globe className="w-10 h-10 text-purple-500 animate-bounce" /><b>多言語・多国籍文書対応</b> 日本語・英語はもちろん、各国の身分証や書類フォーマットに対応。</li>
        </ul>
      </div>

      {/* 使い方 */}
      <div
        ref={usage.ref}
        className={`mx-auto max-w-3xl mb-24 transition-all duration-700 ease-out ${usage.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl font-bold text-foreground mb-8 text-left flex items-center gap-3">
          <ScanText className="w-8 h-8 text-primary animate-bounce" />使い方はシンプル
        </h2>
        <ol className="list-decimal list-inside space-y-8 text-2xl text-muted-foreground text-left">
          <li className="flex items-center gap-4"><Upload className="w-8 h-8 text-blue-500 animate-bounce" />画像をアップロード</li>
          <li className="flex items-center gap-4"><ScanText className="w-8 h-8 text-green-500 animate-fade-in" />AIが文書を自動判別＆解析</li>
          <li className="flex items-center gap-4"><Database className="w-8 h-8 text-purple-500 animate-bounce" />JSON形式で構造化データを返却</li>
        </ol>
      </div>

      {/* 出力例 */}
      <div
        ref={example.ref}
        className={`mx-auto max-w-3xl mb-24 transition-all duration-700 ease-out ${example.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-3xl font-bold text-foreground mb-8 text-left flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary animate-fade-in" />出力例（RFC8259準拠）
        </h2>
        <pre className="bg-muted rounded-lg p-8 text-left text-xl overflow-x-auto">
{`{
  "document_type": "パスポート",
  "fields": {
    "name": "TARO YAMADA",
    "passport_number": "AB1234567",
    "nationality": "JAPAN",
    "expiration_date": "2030-01-01"
  }
}`}
        </pre>
      </div>

      {/* CTA */}
      <div
        ref={cta.ref}
        className={`mx-auto max-w-3xl text-left mt-24 transition-all duration-700 ease-out ${cta.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="text-4xl font-bold text-foreground mb-8 text-left flex items-center gap-3">
          <CheckCircle className="w-10 h-10 text-green-500 animate-bounce" />今すぐDogeOCRを体験
        </h2>
        <p className="text-2xl text-muted-foreground mb-12 text-left">
          開発者向けAPIも提供中。あらゆるOCR処理を、より高速・柔軟に。
        </p>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-10 rounded-lg shadow-md transition-colors text-2xl flex items-center gap-3"
          asChild
        >
          <Link href="/auth/signin">
            <ArrowRight className="w-8 h-8 animate-bounce" />無料で試す
          </Link>
        </Button>
      </div>
    </div>
  )
}
