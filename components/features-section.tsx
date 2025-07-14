import { Lightbulb, Zap, ShieldCheck, Globe, FileText, LayoutGrid } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background" id="features">
      {/* Changed from bg-white */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">Doge OCRの主な機能</h2>
            {/* Changed from text-gray-900 */}
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {/* Changed from text-gray-700 */}
              Doge OCRは、お客様の文書処理ニーズに対応するための強力な機能を提供します。
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary mb-4">
              {/* Changed from bg-green-100 text-green-600 */}
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">高精度OCR</h3> {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              Doge OCR APIを基盤とした最先端のAI技術により、手書きや多様なフォントのテキストも高精度で認識します。
            </p>
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary mb-4">
              {/* Changed from bg-green-100 text-green-600 */}
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">高速処理</h3> {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              大量の文書も迅速に処理し、リアルタイムでのデータ抽出を可能にします。業務のボトルネックを解消します。
            </p>
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary mb-4">
              {/* Changed from bg-green-100 text-green-600 */}
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">堅牢なセキュリティ</h3> {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              お客様のデータは厳重に保護され、業界標準のセキュリティプロトコルに準拠しています。安心してご利用いただけます。
            </p>
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary mb-4">
              {/* Changed from bg-green-100 text-green-600 */}
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">多言語対応</h3> {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              日本語、英語、中国語など、複数の言語に対応しており、グローバルなビジネスニーズをサポートします。
            </p>
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary mb-4">
              {/* Changed from bg-green-100 text-green-600 */}
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">多様なファイル形式</h3> {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              画像ファイル（JPG, PNG）だけでなく、PDFドキュメントからのテキスト抽出もサポートしています。
            </p>
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary mb-4">
              {/* Changed from bg-green-100 text-green-600 */}
              <LayoutGrid className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">API連携</h3> {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              既存のシステムやワークフローに簡単に統合できるRESTful APIを提供。開発者の負担を軽減します。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
