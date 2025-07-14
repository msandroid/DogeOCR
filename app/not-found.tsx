import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background text-foreground">
      <div className="text-center p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">ページが見つかりません</h2>
        <p className="text-lg text-muted-foreground mb-8">お探しのページは見つかりませんでした。</p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg shadow-md transition-colors">
            ホームページへ
          </Button>
        </Link>
      </div>
    </div>
  )
}
