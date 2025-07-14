import PricingCard from "@/components/pricing-card"
import { Toaster } from "sonner"

export default function NewPricingPage() {
  return (
    <>
      <div className="flex flex-col min-h-[100dvh] bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">料金プラン</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            DogeOCRは、従量課金制で柔軟な料金体系を提供しています。
            最低月額$200から始められ、使用量に応じて課金されます。
          </p>
        </div>
        
                 {/* Pricing Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
           <PricingCard planType="FREE" />
           <PricingCard planType="PLUS" />
           <PricingCard planType="PRO" isPopular />
           <PricingCard planType="ENTERPRISE" />
         </div>

        {/* Additional Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">💳 安全な決済</h3>
              <p className="text-muted-foreground">
                Stripeによる安全で確実な決済処理。クレジットカード情報は暗号化されて保護されます。
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">📊 使用量管理</h3>
              <p className="text-muted-foreground">
                リアルタイムで使用量を確認でき、コスト管理が簡単です。月次レポートも提供されます。
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Q: 最低月額とは何ですか？</h3>
              <p className="text-muted-foreground">
                A: 各プランには最低月額が設定されており、使用量が少ない場合でも最低料金が適用されます。最低料金内でご利用いただけるトークン数も含まれています。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q: 従量課金はどのように計算されますか？</h3>
              <p className="text-muted-foreground">
                A: 入力トークンと出力トークンそれぞれに料金が設定されており、月間の使用量に応じて課金されます。最低料金を超えた分のみ追加料金が発生します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q: プランはいつでも変更できますか？</h3>
              <p className="text-muted-foreground">
                A: はい。アカウント設定からいつでもプランの変更が可能です。変更は次回請求サイクルから適用されます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q: 支払い方法は何が利用できますか？</h3>
              <p className="text-muted-foreground">
                A: Visa、Mastercard、American Express、JCBなどの主要クレジットカードがご利用いただけます。
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  )
} 