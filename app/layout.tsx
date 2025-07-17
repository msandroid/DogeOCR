import type React from "react"
import type { Metadata } from "next"
import { Inter, Rubik_Mono_One as Rubik_One } from "next/font/google" // Rubik_Oneをインポート
import "./globals.css"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })
const rubikOne = Rubik_One({
  weight: "400", // Regular (400) ウェイトを指定
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik-one", // CSS変数名を定義
})

export const metadata: Metadata = {
  title: "Doge Works - AI Powered Document Processing & Identity Verification",
  description:
    "Doge Worksは、AI技術を活用したOCRサービス「Doge OCR API」と身分証明書検証サービス「Doge ID Verify API」を提供し、文書処理と本人確認業務を自動化します。",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning className={rubikOne.variable}>
      {/* 余分な空白文字を削除 */}
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <Header />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
