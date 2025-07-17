import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      {/* Changed from bg-gradient-to-r from-green-50 to-white */}
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                {/* Changed from text-gray-900 */}
                Doge Works: AIで文書処理と本人確認を自動化
              </h1>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                className="inDoge-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outDoge-none focus-visible:ring-1 focus-visible:ring-ring"
                asChild
              >
                <Link href="/signup">無料で始める</Link>
              </Button>
            </div>
          </div>
          <Image
            alt="ヒーローイメージ"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            height="400"
            src="/placeholder.svg?height=400&width=600"
            width="600"
          />
        </div>
      </div>
    </section>
  )
}
