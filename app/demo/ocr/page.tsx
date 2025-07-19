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
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl text-foreground" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 800 }}>Doge OCR</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            世界中のあらゆる文書のOCRと構造化データ抽出
          </p>
        </div>

        {/* デモセクション */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="max-h-[600px] overflow-y-auto">
            <DemoClient />
          </div>
        </div>
      </div>
    </div>
  )
} 