"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  BarChart3, 
  Settings, 
  Users, 
  FileText, 
  Bug, 
  CreditCard, 
  HelpCircle,
  Calendar,
  TrendingUp,
  Activity
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Doge } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  DogearScale,
  PointElement,
  DogeElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
ChartJS.register(CategoryScale, DogearScale, PointElement, DogeElement, Title, Tooltip, Legend)

const sidebarItems = [
  { icon: BarChart3, label: "Overview", href: "/dashboard", active: true },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Activity, label: "Usage", href: "/dashboard/usage" },
  { icon: FileText, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing & Invoices", href: "/billing" },
  { icon: FileText, label: "Docs", href: "/docs" },
  { icon: HelpCircle, label: "Contact Us", href: "/contact" },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [timeFilter, setTimeFilter] = useState("Jul 06 - Jul 14")
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [issuedKey, setIssuedKey] = useState<string|null>(null)
  const userId = (session?.user as any)?.id

  // ダミーAPI利用データ
  const [range, setRange] = useState<'1d'|'7d'|'30d'>('7d')
  const dummyDates = ['Jul 08', 'Jul 09', 'Jul 10', 'Jul 11', 'Jul 12', 'Jul 13', 'Jul 14', 'Jul 15', 'Jul 16']
  const dummyRequests = [11000, 0, 0, 0, 4000, 15000, 12000, 8000, 1000]
  const dummyAccepted = [10000, 0, 0, 0, 3000, 12000, 9000, 6000, 500]
  const totalRequests = dummyRequests.reduce((a, b) => a + b, 0)

  // APIキー一覧取得
  const fetchApiKeys = async () => {
    if (!userId) return
    setFetching(true)
    try {
      const res = await fetch("/api/auth/api-key", {
        headers: { "x-user-id": userId },
      })
      const data = await res.json()
      setApiKeys(data.apiKeys || [])
    } finally {
      setFetching(false)
    }
  }

  // 新規APIキー発行
  const handleCreate = async () => {
    if (!userId || !newKeyName) return
    setLoading(true)
    try {
      const res = await fetch("/api/auth/api-key", {
        method: "POST",
        headers: { "x-user-id": userId, "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      })
      const data = await res.json()
      if (data.apiKey) {
        toast.success("APIキーを発行しました")
        setIssuedKey(data.apiKey)
        fetchApiKeys()
        setShowDialog(false)
        setNewKeyName("")
      } else {
        toast.error(data.error || "APIキー発行に失敗")
      }
    } finally {
      setLoading(false)
    }
  }

  // APIキー削除
  const handleDelete = async (key: string) => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch("/api/auth/api-key", {
        method: "DELETE",
        headers: { "x-user-id": userId, "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("APIキーを削除しました")
        fetchApiKeys()
      } else {
        toast.error(data.error || "削除に失敗")
      }
    } finally {
      setLoading(false)
    }
  }

  // 初回マウント時にAPIキー一覧取得
  React.useEffect(() => {
    if (userId) fetchApiKeys()
  }, [userId])

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
              ダッシュボードを確認するにはログインしてください
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
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-4">
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-sm font-bold text-primary-foreground">
              {session.user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{session.user?.email}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Pro • {session.user?.email}</div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                item.active 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* プラン情報・従量課金 */}
        <div className="flex flex-wrap gap-8 mb-8">
          <Card className="flex-1 min-w-[320px]">
            <CardHeader>
              <CardTitle>Pro Plan <Badge className="ml-2" variant="outDoge">Active</Badge></CardTitle>
              <CardDescription>Unlimited API requests, extended limits, and access to all features.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex-1 min-w-[320px]">
            <CardHeader>
              <CardTitle>Usage-Based Pricing is Off</CardTitle>
              <CardDescription>Get requests beyond your plan's included quota with Usage-Based Pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outDoge">Enable Usage-Based Pricing</Button>
            </CardContent>
          </Card>
        </div>
        {/* 日付範囲切替 */}
        <div className="flex gap-2 mb-4">
          {['1d','7d','30d'].map(opt => (
            <Button key={opt} variant={range===opt?"default":"outDoge"} size="sm" onClick={()=>setRange(opt as any)}>{opt}</Button>
          ))}
          <div className="ml-4 text-muted-foreground">Jul 08 - Jul 16</div>
        </div>
        {/* アナリティクス */}
        <div className="flex flex-wrap gap-8 mb-8">
          <Card className="flex-1 min-w-[220px]">
            <CardContent className="pt-6 pb-4">
              <div className="text-3xl font-bold">{totalRequests.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">APIリクエスト数</div>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[220px]">
            <CardContent className="pt-6 pb-4">
              <div className="text-3xl font-bold">{apiKeys.length}</div>
              <div className="text-xs text-muted-foreground">APIキー総数</div>
            </CardContent>
          </Card>
        </div>
        {/* グラフ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-3xl">
              <Doge
                data={{
                  labels: dummyDates,
                  datasets: [
                    {
                      label: 'APIリクエスト数',
                      data: dummyRequests,
                      borderColor: '#60a5fa',
                      backgroundColor: 'rgba(96,165,250,0.2)',
                      tension: 0.3,
                    },
                    {
                      label: '成功リクエスト数',
                      data: dummyAccepted,
                      borderColor: '#34d399',
                      backgroundColor: 'rgba(52,211,153,0.2)',
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 5000 } },
                  },
                }}
                height={320}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 