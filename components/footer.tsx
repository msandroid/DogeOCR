import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-muted py-12 px-4 md:px-6 border-t border-border">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link className="flex items-center" href="/">
            <Image
              src="/images/icon.png" // Use the provided icon.png
              alt="Doge Works Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="ml-2 text-2xl font-bold text-primary font-rubik-one">Doge Works</span> {/* フォントを適用 */}
          </Link>
          <p className="text-sm text-muted-foreground">
            Doge Worksは、AI技術を活用したOCRサービス「Doge OCR API」と身分証明書検証サービス「Doge ID Verify API」を提供し、文書処理と本人確認業務を自動化します。
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">サービス</h3>
          <ul className="space-y-1">
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/products">
                プロダクト
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/solutions#invoice">
                請求書処理
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/solutions#receipt">
                レシート・領収書
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/solutions#form">
                各種帳票
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/solutions#id-card">
                身分証明書
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">会社概要</h3>
          <ul className="space-y-1">
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/about">
                会社について
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/careers">
                採用情報
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/contact">
                お問い合わせ
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/docs">
                ドキュメント
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">法務</h3>
          <ul className="space-y-1">
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/terms">
                利用規約
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary" href="/privacy">
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">© 2023 Doge Works. All rights reserved.</div>
    </footer>
  )
}
