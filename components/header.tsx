import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"
import AuthButton from "@/components/auth-button"

export default function Header() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-background border-b border-border">
      <Link className="mr-6 flex items-center" href="/">
        <Image
          src="/images/icon.png" // Use the provided icon.png
          alt="Doge Works Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="ml-2 text-xl font-bold text-primary font-rubik-one">Doge Works</span> {/* フォントを適用 */}
      </Link>
      <nav className="ml-auto hidden gap-4 sm:gap-6 md:flex">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground"
          href="/products"
        >
          プロダクト
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground"
          href="/solutions"
        >
          ソリューション
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground" href="/pricing">
          料金
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground" href="/docs">
          ドキュメント
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 text-primary font-bold" href="/demo">
          デモ
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:block">
          <AuthButton />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent" size="icon" variant="outline">
              <Menu className="h-6 w-6 text-foreground" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <Link className="mr-6 flex items-center" href="/">
              <Image
                src="/images/icon.png" // Use the provided icon.png
                alt="Doge Works Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="ml-2 text-xl font-bold text-primary font-rubik-one">Doge Works</span>{" "}
              {/* フォントを適用 */}
            </Link>
            <div className="grid gap-2 py-6">
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold text-muted-foreground"
                href="/products"
              >
                プロダクト
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold text-muted-foreground"
                href="/solutions"
              >
                ソリューション
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold text-muted-foreground"
                href="/pricing"
              >
                料金
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold text-muted-foreground" href="/docs">
                ドキュメント
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold text-primary font-bold" href="/demo">
                デモ
              </Link>
            </div>
            <div className="mt-4 px-4">
              <AuthButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
