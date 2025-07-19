"use client"

import DemoClient from "@/components/demo-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Globe, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function OCRDemoPage() {
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                デモ一覧に戻る
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-light text-foreground">OCR Demo</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            世界中のあらゆる文書のOCRと構造化データ抽出を体験
          </p>
          
          {/* 機能バッジ */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">多言語対応</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">リアルタイム処理</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">高精度</span>
            </div>
          </div>
        </div>
        
        {/* デモセクション */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl">📄</span>
              <h2 className="text-2xl font-semibold text-foreground">
                OCR Demo
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              画像をアップロードして構造化データを抽出
            </p>
            
            {/* 機能リスト */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">世界中のあらゆる文書に対応</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">高精度な文字認識</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">構造化データの自動抽出</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs">✓</span>
                </div>
                <p className="text-xs text-muted-foreground">リアルタイム処理</p>
              </div>
            </div>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            <DemoClient />
          </div>
        </div>

        {/* 機能説明 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">多言語対応</h3>
            <p className="text-sm text-muted-foreground">
              日本語、英語、中国語など世界中の言語に対応
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">構造化データ</h3>
            <p className="text-sm text-muted-foreground">
              表、リスト、フォームなど複雑な構造も自動認識
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">高速処理</h3>
            <p className="text-sm text-muted-foreground">
              最新のAI技術による高速で高精度な文字認識
            </p>
          </div>
        </div>

        {/* 他のデモへのリンク */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">他のデモも体験</h3>
              <p className="text-sm text-muted-foreground mb-4">
                身分証明書の本人確認機能も体験できます
              </p>
              <Button asChild className="w-full">
                <Link href="/demo/id-verify">
                  <span className="text-lg mr-2">🆔</span>
                  ID Verify Demo
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 