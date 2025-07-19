import { PLANS, PlanType } from './stripe'

export interface UserSubscription {
  userId: string
  planType: PlanType
  status: 'active' | 'inactive' | 'cancelled'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  stripeSubscriptionId?: string
}

/**
 * ユーザーのサブスクリプション状態を取得する（仮実装）
 * TODO: Supabaseや他のDBから実際のサブスクリプション情報を取得
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  // TODO: 実際のデータベースからサブスクリプション情報を取得
  // 例: const { data } = await supabase.from('subscriptions').select('*').eq('userId', userId).single()
  
  // 仮実装: すべてのユーザーをFREEプランとして扱う
  return {
    userId,
    planType: 'FREE',
    status: 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
  }
}

/**
 * ユーザーがAPIキー機能を利用できるかチェック
 */
export function canUseApiKeys(planType: PlanType): boolean {
  return planType === 'PRO' || planType === 'ENTERPRISE'
}

/**
 * ユーザーが特定の機能を利用できるかチェック
 */
export function canUseFeature(planType: PlanType, feature: string): boolean {
  switch (feature) {
    case 'api_keys':
      return canUseApiKeys(planType)
    case 'advanced_ocr':
      return planType === 'PRO' || planType === 'ENTERPRISE'
    case 'custom_templates':
      return planType === 'PRO' || planType === 'ENTERPRISE'
    case 'priority_support':
      return planType === 'PRO' || planType === 'ENTERPRISE'
    case 'sla_guarantee':
      return planType === 'ENTERPRISE'
    default:
      return false
  }
}

/**
 * プラン名を取得
 */
export function getPlanName(planType: PlanType): string {
  return PLANS[planType].name
}

/**
 * プランの説明を取得
 */
export function getPlanDescription(planType: PlanType): string {
  const plan = PLANS[planType]
  return `${plan.name} - ${plan.basePrice === 0 ? '無料' : `$${plan.basePrice}/月`}`
} 