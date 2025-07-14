import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// サーバーサイド用Stripe設定
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

// クライアントサイド用Stripe設定
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// 料金プラン定義（従量課金制）
export const PLANS = {
  FREE: {
    name: 'Freeプラン',
    basePrice: 0, // 基本料金なし
    priceId: '', // Stripeで作成後に設定
    features: [
      '完全従量課金制',
      '使用した分だけ支払い',
      '支出リミット設定可能',
      '基本OCR機能',
      'メールサポート',
    ],
    pricing: {
      inputTokens: 0.005, // $0.005 per 1K input tokens
      outputTokens: 0.005, // $0.005 per 1K output tokens
      minimumMonthly: 0, // 最低料金なし
    },
    limits: {
      monthlyMinimum: 0, // 最低料金なし
      defaultSpendingLimit: 100, // デフォルト支出リミット $100
    },
  },
  PLUS: {
    name: 'Plusプラン',
    basePrice: 200, // 最低月額 $200
    priceId: '', // Stripeで作成後に設定
    features: [
      '最低月額 $200',
      '基本OCR機能',
      '従量課金制',
      '月間使用量レポート',
      'メールサポート',
    ],
    pricing: {
      inputTokens: 0.001, // $0.001 per 1K input tokens
      outputTokens: 0.002, // $0.002 per 1K output tokens
      minimumMonthly: 200, // 最低月額 $200
    },
    limits: {
      monthlyMinimum: 200000, // 最低料金に含まれるトークン数（入力+出力）
    },
  },
  PRO: {
    name: 'Proプラン',
    basePrice: 500, // 最低月額 $500
    priceId: '', // Stripeで作成後に設定
    features: [
      '最低月額 $500',
      '高精度OCR機能',
      '優遇料金レート',
      'API利用可能',
      '優先サポート',
      'カスタムテンプレート対応',
    ],
    pricing: {
      inputTokens: 0.0008, // $0.0008 per 1K input tokens
      outputTokens: 0.0015, // $0.0015 per 1K output tokens
      minimumMonthly: 500, // 最低月額 $500
    },
    limits: {
      monthlyMinimum: 600000, // 最低料金に含まれるトークン数（入力+出力）
    },
  },
  ENTERPRISE: {
    name: 'エンタープライズプラン',
    basePrice: 1000, // 最低月額 $1000
    priceId: '', // Stripeで作成後に設定
    features: [
      '最低月額 $1,000',
      '最高精度OCR機能',
      '最優遇料金レート',
      '専用サポート',
      'SLA保証',
      'カスタムAIモデル',
      'オンプレミス対応',
    ],
    pricing: {
      inputTokens: 0.0005, // $0.0005 per 1K input tokens
      outputTokens: 0.001, // $0.001 per 1K output tokens
      minimumMonthly: 1000, // 最低月額 $1000
    },
    limits: {
      monthlyMinimum: 1500000, // 最低料金に含まれるトークン数（入力+出力）
    },
  },
} as const

export type PlanType = keyof typeof PLANS 