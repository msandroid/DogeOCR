import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            決済が完了しました！
          </CardTitle>
          <CardDescription>
            サブスクリプションの設定が正常に完了しました
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            ご利用ありがとうございます。新しいプランでDogeOCRをお楽しみください。
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                ダッシュボードへ
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/billing">
                請求設定を確認
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            確認メールをお送りしました。数分以内に届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <SuccessContent />
    </Suspense>
  )
} 