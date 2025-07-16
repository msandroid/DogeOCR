import { ScanText, Upload, Database, CheckCircle } from "lucide-react"
import Image from "next/image"

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
        
        {/* 画像表示 */}
        <div className="mx-auto max-w-5xl py-12 flex justify-center">
          <Image
            src="/images/doge-ocr-api.png"
            alt="Doge OCR APIの仕組み"
            width={800}
            height={600}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  )
}
