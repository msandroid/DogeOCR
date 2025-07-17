import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const supabase = createClient(
  'https://pzwalveyyuhlwuditeij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6d2FsdmV5eXVobHd1ZGl0ZWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzIwNDIsImV4cCI6MjA2ODI0ODA0Mn0.ilr0-_qIGKTu8bO5ersa7i5FzqTsX9wloCHT-bw3KNY'
)

/**
 * Stripeサブスクリプション情報をDBに保存する（仮実装）
 * @param userId
 * @param planType
 * @param session Stripe.Checkout.Session
 */
export async function updateUserSubscription(userId: string, planType: string, session: any) {
  // TODO: Supabaseや他のDBにサブスクリプション情報を保存する本実装を追加
  console.log('updateUserSubscription called', { userId, planType, sessionId: session.id })
  // 例: await supabase.from('subscriptions').upsert({ userId, planType, sessionId: session.id, ... })
}
