import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { Menu, Settings } from "lucide-react"
import Image from "next/image"
import AuthButton from "@/components/auth-button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-background border-b border-border">
      <Link className="mr-6 flex items-center" href="/">
        <div className="relative w-10 h-10">
          <Image
            src="/images/icon 2.png"
            alt="Doge Works Logo"
            width={40}
            height={40}
            className="rounded-full dark:opacity-0 transition-opacity duration-200"
          />
          <Image
            src="/images/icon 1.png"
            alt="Doge Works Logo"
            width={40}
            height={40}
            className="absolute inset-0 rounded-full opacity-0 dark:opacity-100 transition-opacity duration-200"
          />
        </div>
        <span className="ml-2 text-xl font-bold text-foreground font-rubik-one">Doge Works</span> {/* フォントを適用 */}
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
        <Link className="text-sm font-medium hover:underline underline-offset-4 text-primary font-bold" href="/demo">
          デモ
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
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
              <div className="relative w-10 h-10">
                <Image
                  src="/images/icon 2.png"
                  alt="Doge Works Logo"
                  width={40}
                  height={40}
                  className="rounded-full dark:opacity-0 transition-opacity duration-200"
                />
                <Image
                  src="/images/icon 1.png"
                  alt="Doge Works Logo"
                  width={40}
                  height={40}
                  className="absolute inset-0 rounded-full opacity-0 dark:opacity-100 transition-opacity duration-200"
                />
              </div>
              <span className="ml-2 text-xl font-bold text-foreground font-rubik-one">Doge Works</span>{" "}
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
              <Link className="flex w-full items-center py-2 text-lg font-semibold text-primary font-bold" href="/demo">
                デモ
              </Link>
            </div>
            <div className="mt-4 px-4 space-y-2">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <AuthButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
