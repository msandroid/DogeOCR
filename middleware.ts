import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
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