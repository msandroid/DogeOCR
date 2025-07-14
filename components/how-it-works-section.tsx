import { ScanText, Upload, Database, CheckCircle } from "lucide-react"

export default function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="how-it-works">
      {/* Changed from bg-gray-100 */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">Doge OCRの仕組み</h2>
            {/* Changed from text-gray-900 */}
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {/* Changed from text-gray-700 */}
              Doge OCRは、シンプルな3ステップで文書から必要なデータを抽出します。
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-1 text-center">
            <div className="flex justify-center mb-4">
              <Upload className="h-12 w-12 text-primary" /> {/* Changed from text-green-600 */}
            </div>
            <h3 className="text-xl font-bold text-foreground">1. 文書をアップロード</h3>
            {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              請求書、レシート、契約書など、あらゆる種類の文書をアップロードします。画像ファイル（JPG,
              PNG）やPDFに対応しています。
            </p>
          </div>
          <div className="grid gap-1 text-center">
            <div className="flex justify-center mb-4">
              <ScanText className="h-12 w-12 text-primary" /> {/* Changed from text-green-600 */}
            </div>
            <h3 className="text-xl font-bold text-foreground">2. AIがテキストを認識</h3>
            {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              VisonAIとOCRの技術が、文書内のテキストを高精度で認識し、構造化されたデータに変換します。
            </p>
          </div>
          <div className="grid gap-1 text-center">
            <div className="flex justify-center mb-4">
              <Database className="h-12 w-12 text-primary" /> {/* Changed from text-green-600 */}
            </div>
            <h3 className="text-xl font-bold text-foreground">3. データを抽出・活用</h3>
            {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              抽出されたデータは、JSON形式などで提供され、既存のシステムやデータベースに簡単に統合して活用できます。
            </p>
          </div>
          <div className="grid gap-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-primary" /> {/* Changed from text-green-600 */}
            </div>
            <h3 className="text-xl font-bold text-foreground">4. 業務効率化</h3> {/* Changed from text-gray-900 */}
            <p className="text-sm text-muted-foreground">
              {/* Changed from text-gray-700 */}
              手作業によるデータ入力が不要になり、時間とコストを大幅に削減。業務プロセスを自動化し、生産性を向上させます。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
