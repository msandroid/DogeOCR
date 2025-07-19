"use client"

import IDVerifyDemo from "@/components/id-verify-demo"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Smartphone, Camera, Lock } from "lucide-react"
import Link from "next/link"

export default function IDVerifyDemoPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-4"
            >
              <Link href="/demo">
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-light text-foreground">ID Verify Demo</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            日本の犯罪収益移転防止法に準拠したeKYC認証システムを体験
          </p>
          
          {/* 機能バッジ */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <Smartphone className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">モバイル専用</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">カメラ認証</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">セキュア</span>
            </div>
          </div>
        </div>
        
        {/* デモセクション */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl">🆔</span>
              <h2 className="text-2xl font-semibold text-foreground">
                ID Verify Demo
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              身分証明書とセルフィーによる本人確認
            </p>
            
            {/* 機能リスト */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">カメラによる直接撮影</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">顔認証による本人確認</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">文書真贋判定</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">犯罪収益移転防止法準拠</p>
              </div>
            </div>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            <IDVerifyDemo />
          </div>
        </div>

        {/* 機能説明 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">モバイル専用</h3>
            <p className="text-sm text-muted-foreground">
              セキュリティ上の理由により、モバイル端末でのみ利用可能
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">顔認証</h3>
            <p className="text-sm text-muted-foreground">
              高精度な顔認証技術による本人確認
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">セキュリティ</h3>
            <p className="text-sm text-muted-foreground">
              犯罪収益移転防止法に準拠した安全な認証
            </p>
          </div>
        </div>

        {/* 他のデモへのリンク */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">他のデモも体験</h3>
              <p className="text-sm text-muted-foreground mb-4">
                文書の文字認識と構造化機能も体験できます
              </p>
              <Button asChild className="w-full">
                <Link href="/demo/ocr">
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 