"use client"

import DemoClient from "@/components/demo-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Shield, ArrowRight, Globe, Zap, Lock } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
        </div>

        {/* デモ選択カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* OCR Demo */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/demo/ocr">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">OCR Demo</h3>
                    <p className="text-sm text-muted-foreground">文書の文字認識と構造化</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  世界中のあらゆる文書を構造化データに変換。多言語対応で高精度な文字認識を体験できます。
                </p>
                
                <div className="flex gap-2 mb-4">
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                    <Globe className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">多言語対応</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">リアルタイム</span>
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link href="/demo/ocr">
                    OCR Demo を体験
                  </Link>
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* ID Verify Demo */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/demo/id-verify">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">ID Verify Demo</h3>
                    <p className="text-sm text-muted-foreground">身分証明書の本人確認</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  身分証明書とセルフィーによる本人確認。犯罪収益移転防止法に準拠した安全な認証を体験できます。
                </p>
                
                <div className="flex gap-2 mb-4">
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                    <Lock className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">セキュア</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                    <span className="text-xs">📱</span>
                    <span className="text-xs font-medium text-primary">モバイル専用</span>
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link href="/demo/id-verify">
                    ID Verify Demo を体験
                  </Link>
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
