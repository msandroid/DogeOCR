import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image" // Imageコンポーネントをインポート

export default function SolutionsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">対応書類</h1> {/* タイトルを「対応書類」に変更 */}
        <p className="text-lg text-muted-foreground">
          Doge Worksは、お客様の多様な文書処理ニーズに対応するOCRソリューションを提供します。
        </p>
      </div>

      {/* OCR Solution Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* 定型書類OCR Card (Template) */}
        <Card className="relative overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-2">Template</h2>
              <CardTitle className="text-xl font-semibold">定型書類OCR</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-card flex flex-col h-full">
            <CardDescription className="text-muted-foreground mb-4 text-center">
              事前にレイアウト設定し、帳票内の読み取りたい箇所だけをデータ化
            </CardDescription>
            <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
              {["申込書", "注文書", "報告書", "アンケート", "納品書", "身分証"].map((doc) => (
                <div
                  key={doc}
                  className="bg-secondary text-foreground py-2 px-4 rounded-md text-center text-sm font-medium"
                >
                  {doc}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-auto">※各種定型書類すべて</p>
          </CardContent>
        </Card>

        {/* 特化型OCR Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
            <div className="absolute top-2 right-2 bg-primary-foreground text-primary text-xs font-bold px-3 py-1 rounded-full">
              事前設定不要
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-2">特化型</h2>
              <CardTitle className="text-xl font-semibold">特化型OCR</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-card flex flex-col h-full">
            <CardDescription className="text-muted-foreground mb-4 text-center">
              読み取るだけで、必要情報を自動解析・認識をしてデータ化
            </CardDescription>
            <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
              {["請求書", "レシート／領収書", "注文書"].map((doc) => (
                <div
                  key={doc}
                  className="bg-secondary text-foreground py-2 px-4 rounded-md text-center text-sm font-medium"
                >
                  {doc}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-auto"></p> {/* 空のまま */}
          </CardContent>
        </Card>

        {/* 全文認識/表抽出OCR Card (General) */}
        <Card className="relative overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
            <div className="absolute top-2 right-2 bg-primary-foreground text-primary text-xs font-bold px-3 py-1 rounded-full">
              事前設定不要
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-2">General</h2>
              <CardTitle className="text-xl font-semibold">全文認識/表抽出OCR</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-card flex flex-col h-full">
            <CardDescription className="text-muted-foreground mb-4 text-center">
              帳票内にあるすべての文字をデータ化。表を表のそのまま抽出も可能
            </CardDescription>
            <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
              {["納品書", "見積書", "勤怠管理表", "書籍", "点検表", "名簿"].map((doc) => (
                <div
                  key={doc}
                  className="bg-secondary text-foreground py-2 px-4 rounded-md text-center text-sm font-medium"
                >
                  {doc}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-auto">※書類や画像のすべての文字・表をデータ化</p>
          </CardContent>
        </Card>
      </div>

      {/* Challenging Documents Section */}
      <div className="w-full py-12 md:py-24 lg:py-32 bg-muted rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">こんな帳票も読み取り可能</h2>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 py-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                src: "/placeholder.svg?height=120&width=180",
                alt: "手書きやシワの寄った紙",
                text: "手書きやシワの寄った紙",
              },
              {
                src: "/placeholder.svg?height=120&width=180",
                alt: "汚れた文字・レシート",
                text: "汚れた文字・レシート",
              },
              { src: "/placeholder.svg?height=120&width=180", alt: "表形式", text: "表形式" },
              { src: "/placeholder.svg?height=120&width=180", alt: "チェックボックス", text: "チェックボックス" },
              { src: "/placeholder.svg?height=120&width=180", alt: "丸囲み", text: "丸囲み" },
              {
                src: "/placeholder.svg?height=120&width=180",
                alt: "スマートフォンで撮影した文字",
                text: "スマートフォンで撮影した文字",
              },
            ].map((item, index) => (
              <div key={index} className="grid gap-2 text-center bg-card p-4 rounded-lg shadow-sm">
                <Image
                  alt={item.alt}
                  className="mx-auto aspect-[3/2] overflow-hidden rounded-md object-cover object-center"
                  height="120"
                  src={item.src || "/placeholder.svg"}
                  width="180"
                />
                <p className="text-sm text-muted-foreground mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">お客様のビジネスに合わせたソリューションを</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Doge OCRがどのように貴社の業務を効率化できるか、お気軽にご相談ください。
        </p>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
          asChild
        >
          <Link href="/contact">お問い合わせ</Link>
        </Button>
      </div>
    </div>
  )
}
