"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { PLANS, PlanType } from "@/lib/stripe"
import { toast } from "sonner"

interface PricingCardProps {
  planType: PlanType
  isPopular?: boolean
}

export default function PricingCard({ planType, isPopular = false }: PricingCardProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const plan = PLANS[planType]

  const handleSubscribe = async () => {
    if (!session) {
      toast.error("サブスクリプションにはログインが必要です")
      return
    }

    if (planType === 'FREE') {
      toast.success("Freeプランを開始しました")
      return
    }

    if (!plan.priceId) {
      toast.error("この料金プランは現在準備中です")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planType: planType,
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        toast.error(error)
        return
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error("決済処理でエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
          人気
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          {planType === 'FREE' ? (
            <>
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/月</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold">${plan.basePrice}</span>
              <span className="text-muted-foreground">/月〜</span>
            </>
          )}
        </CardDescription>
        <div className="text-sm text-muted-foreground">
          <div>${plan.pricing.inputTokens} / 1K 入力トークン</div>
          <div>${plan.pricing.outputTokens} / 1K 出力トークン</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full"
          variant={isPopular ? "default" : "outDoge"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              処理中...
            </>
                      ) : planType === 'FREE' ? (
              '無料で開始'
            ) : (
              '今すぐ申し込む'
            )}
        </Button>
      </CardFooter>
    </Card>
  )
} 