import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // APIキーページへのアクセス制御
    if (pathname === "/dashboard/api-keys") {
      // 仮実装: すべてのユーザーをFREEプランとして扱う
      // 実際の実装では、データベースからサブスクリプション情報を取得
      const userPlan = 'FREE' as const // 仮の実装
      const canUseApiKeys = userPlan !== 'FREE'
      
      if (!canUseApiKeys) {
        // アクセス権限がない場合は、ダッシュボードにリダイレクト
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // ここに追加のミドルウェアロジックを記述可能
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // 管理者専用ページの保護例
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }

        // ダッシュボード等の保護されたページ
        if (pathname.startsWith("/dashboard")) {
          return !!token
        }

        // その他の保護が必要なページ
        if (pathname.startsWith("/api/protected")) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // 保護するパスのパターンを指定
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/protected/:path*",
  ]
} 