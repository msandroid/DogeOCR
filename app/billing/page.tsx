"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, Settings, Download, BarChart3, AlertTriangle } from "lucide-react"
import Link from "next/link"
import SpendingLimitModal from "@/components/spending-limit-modal"
import { Toaster } from "sonner"

export default function BillingPage() {
  const { data: session, status } = useSession()
  const [spendingLimit, setSpendingLimit] = useState(100)
  const currentSpending = 15.75 // 今月の使用料金

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>ログインが必要です</CardTitle>
            <CardDescription>
              請求情報を確認するにはログインしてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/signin">ログイン</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">請求管理</h1>
          <p className="text-muted-foreground mt-2">
            従量課金制プランの使用量と請求情報を管理します
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                現在のプラン
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-lg font-semibold">Freeプラン</h3>
                   <p className="text-muted-foreground">完全従量課金制</p>
                 </div>
                 <Badge variant="secondary">アクティブ</Badge>
               </div>
               
               {/* Usage-Based Spending */}
               <div className="border-t pt-4">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-sm font-medium">Usage-Based Spending this Month</span>
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-medium">${currentSpending.toFixed(2)} / ${spendingLimit}</span>
                     <SpendingLimitModal 
                       currentLimit={spendingLimit} 
                       onUpdateLimit={setSpendingLimit} 
                     />
                   </div>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2">
                   <div 
                     className={`h-2 rounded-full ${
                       currentSpending / spendingLimit > 0.8 ? 'bg-red-500' : 
                       currentSpending / spendingLimit > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                     }`} 
                     style={{ width: `${Math.min((currentSpending / spendingLimit) * 100, 100)}%` }}
                   ></div>
                 </div>
                 <div className="flex justify-between items-center mt-1">
                   <div className="text-xs text-muted-foreground">
                     {((currentSpending / spendingLimit) * 100).toFixed(1)}% 使用済み
                   </div>
                   {currentSpending / spendingLimit > 0.8 && (
                     <div className="flex items-center text-xs text-red-600">
                       <AlertTriangle className="h-3 w-3 mr-1" />
                       リミット接近
                     </div>
                   )}
                 </div>
               </div>

               <div className="border-t pt-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-muted-foreground">今月の使用料金</p>
                     <p className="text-2xl font-bold">${currentSpending.toFixed(2)}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground">残り予算</p>
                     <p className="text-2xl font-bold">${(spendingLimit - currentSpending).toFixed(2)}</p>
                   </div>
                 </div>
               </div>

              <div className="flex gap-2 pt-4">
                <Button asChild>
                  <Link href="/pricing/new">プランをアップグレード</Link>
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  設定を変更
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                請求書をダウンロード
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                使用量レポート
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                使用履歴を確認
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                支払い方法を変更
              </Button>
            </CardContent>
          </Card>
        </div>

                 {/* Usage Statistics */}
         <Card className="mt-6">
           <CardHeader>
             <CardTitle>使用量統計</CardTitle>
             <CardDescription>
               月間の使用量とコスト詳細（1000トークンあたり$5.00）
             </CardDescription>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="text-center">
                 <div className="text-2xl font-bold text-blue-600">1.55K</div>
                 <div className="text-sm text-muted-foreground">入力トークン</div>
                 <div className="text-xs text-muted-foreground mt-1">$7.75</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-green-600">1.60K</div>
                 <div className="text-sm text-muted-foreground">出力トークン</div>
                 <div className="text-xs text-muted-foreground mt-1">$8.00</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-purple-600">3.15K</div>
                 <div className="text-sm text-muted-foreground">合計トークン</div>
                 <div className="text-xs text-muted-foreground mt-1">$15.75</div>
               </div>
             </div>
             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
               <p className="text-sm text-blue-800">
                 <strong>料金計算:</strong> 入力・出力トークン共に1000トークンあたり$5.00で課金されます
               </p>
             </div>
           </CardContent>
         </Card>

        {/* Billing History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>請求履歴</CardTitle>
            <CardDescription>
              過去の請求とお支払い履歴
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                             <div className="flex items-center justify-between p-4 border rounded-lg">
                 <div>
                   <p className="font-medium">2024年1月</p>
                   <p className="text-sm text-muted-foreground">Freeプラン - 従量課金</p>
                 </div>
                 <div className="text-right">
                   <p className="font-medium">$15.75</p>
                   <Badge variant="secondary">支払い済み</Badge>
                 </div>
               </div>
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">
                  それ以前の請求履歴はありません
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>サポート</CardTitle>
            <CardDescription>
              ご質問やお困りのことがございましたら、お気軽にお問い合わせください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/docs">ドキュメント</Link>
              </Button>
              <Button variant="outline">
                お問い合わせ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" />
    </div>
  )
} 