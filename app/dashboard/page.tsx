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

const sidebarItems = [
  { icon: BarChart3, label: "Overview", href: "/dashboard", active: true },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: Users, label: "Integrations", href: "/dashboard/integrations" },
  { icon: Users, label: "Background Agents", href: "/dashboard/agents" },
  { icon: Bug, label: "BugBot", href: "/dashboard/bugbot" },
  { icon: Activity, label: "Usage", href: "/dashboard/usage" },
  { icon: CreditCard, label: "Billing & Invoices", href: "/billing" },
  { icon: FileText, label: "Docs", href: "/docs" },
  { icon: HelpCircle, label: "Contact Us", href: "/contact" },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [timeFilter, setTimeFilter] = useState("Jul 06 - Jul 14")

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
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-foreground">Pro Plan</h1>
              <Badge variant="secondary" className="bg-primary text-primary-foreground">Active</Badge>
            </div>
            <p className="text-muted-foreground">
              Unlimited tab completions, extended agent limits, and access to most features.
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">$0 <span className="text-lg text-muted-foreground">/ $40</span></div>
            <div className="text-sm text-muted-foreground mb-2">Usage-Based Spending this Month</div>
            <Button variant="outline" size="sm">
              Edit Limit
            </Button>
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={timeFilter === "1d" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setTimeFilter("1d")}
            className="bg-gray-700 text-white"
          >
            1d
          </Button>
          <Button 
            variant={timeFilter === "7d" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setTimeFilter("7d")}
            className="bg-gray-700 text-white"
          >
            7d
          </Button>
          <Button 
            variant={timeFilter === "30d" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setTimeFilter("30d")}
            className="bg-gray-700 text-white"
          >
            30d
          </Button>
          <Button 
            variant={timeFilter === "Jul 06 - Jul 14" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setTimeFilter("Jul 06 - Jul 14")}
            className="bg-gray-700 text-white"
          >
            Jul 06 - Jul 14
          </Button>
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Your Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-1">93,059</div>
                <div className="text-muted-foreground">Lines of Agent Edits</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-1">19</div>
                <div className="text-muted-foreground">Tabs Accepted</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Area */}
          <Card>
            <CardContent className="p-6">
              <div className="h-64 flex items-end justify-between gap-2">
                {/* Sample Chart Data */}
                {[9.5, 8.2, 10.1, 7.8, 11.2, 9.8, 8.5, 10.9, 9.1, 8.7, 10.5, 14.2, 11.8, 13.5].map((value, index) => (
                  <div key={index} className="flex-1 bg-primary rounded-t" style={{ height: `${value * 10}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0k</span>
                <span>5k</span>
                <span>10k</span>
                <span>15k</span>
                <span>20k</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 