import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">料金プラン</h1>
        <p className="text-lg text-muted-foreground">
          Doge Worksは、従量課金制でDoge OCR APIを提供しています。
          最低月額$200からご利用いただけます。
        </p>
      </div>
      
      {/* Pricing Options */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">従量課金制プラン</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <Card className="flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Starter</CardTitle>
              <CardDescription className="text-muted-foreground">小規模な利用やテストに最適</CardDescription>
              <div className="mt-4 text-4xl font-bold text-primary">
                $200 <span className="text-xl text-muted-foreground">/ 月〜</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <div>$0.001 / 1K 入力トークン</div>
                <div>$0.002 / 1K 出力トークン</div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  最低月額 $200
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  基本OCR機能
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  従量課金制
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  月間使用量レポート
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  メールサポート
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/auth/signin">今すぐ始める</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Professional Plan */}
          <Card className="flex flex-col border-2 border-primary shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Professional</CardTitle>
              <CardDescription className="text-muted-foreground">成長中のビジネス向け</CardDescription>
              <div className="mt-4 text-4xl font-bold text-primary">
                $500 <span className="text-xl text-muted-foreground">/ 月〜</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <div>$0.0008 / 1K 入力トークン</div>
                <div>$0.0015 / 1K 出力トークン</div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  最低月額 $500
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  高精度OCR機能
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  優遇料金レート
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  API利用可能
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  優先サポート
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  カスタムテンプレート対応
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/auth/signin">今すぐ始める</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Enterprise</CardTitle>
              <CardDescription className="text-muted-foreground">大規模な企業向け</CardDescription>
              <div className="mt-4 text-4xl font-bold text-primary">
                $1,000 <span className="text-xl text-muted-foreground">/ 月〜</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <div>$0.0005 / 1K 入力トークン</div>
                <div>$0.001 / 1K 出力トークン</div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  最低月額 $1,000
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  最高精度OCR機能
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  最優遇料金レート
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  専用サポート
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  SLA保証
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  カスタムAIモデル
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  オンプレミス対応
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/auth/signin">今すぐ始める</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Pricing Details */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">料金詳細</h2>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>従量課金制について</CardTitle>
              <CardDescription>
                使用量に応じた柔軟な料金体系
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">💰 最低月額制</h3>
                  <p className="text-sm text-muted-foreground">
                    各プランには最低月額が設定されており、使用量が少ない場合でも最低料金が適用されます。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">📊 従量課金</h3>
                  <p className="text-sm text-muted-foreground">
                    最低料金を超えた分については、入力・出力トークン数に応じて課金されます。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🔄 月次請求</h3>
                  <p className="text-sm text-muted-foreground">
                    毎月の使用量を集計し、月末に請求書を発行いたします。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">📈 使用量レポート</h3>
                  <p className="text-sm text-muted-foreground">
                    リアルタイムで使用量を確認でき、コスト管理が簡単です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
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
  )
}
