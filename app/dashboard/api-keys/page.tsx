"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import React from "react"
import Link from "next/link"
import { Copy, Key } from "lucide-react"

export default function ApiKeysPage() {
  const { data: session, status } = useSession()
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showIssued, setShowIssued] = useState(false)
  const [showDelete, setShowDelete] = useState<string|null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [issuedKey, setIssuedKey] = useState<string|null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const userId = (session?.user as any)?.id

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
        setShowIssued(true)
        setShowCreate(false)
        setNewKeyName("")
        fetchApiKeys()
      } else {
        toast.error(data.error || "APIキー発行に失敗")
      }
    } finally {
      setLoading(false)
    }
  }

  // APIキー削除
  const handleDelete = async (key: string, name: string) => {
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
        setShowDelete(null)
        setDeleteConfirm("")
      } else {
        toast.error(data.error || "削除に失敗")
      }
    } finally {
      setLoading(false)
    }
  }

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
            <div className="text-muted-foreground">APIキー管理ページを利用するにはログインしてください</div>
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <div className="w-full max-w-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <div className="text-muted-foreground">Authenticate programmatically with Fireworks AI</div>
          </div>
          <Button className="rounded-xl px-6 py-2 text-base font-semibold" onClick={()=>setShowCreate(true)}>
            Create API Key
          </Button>
        </div>
        <h2 className="text-xl font-semibold mb-4">Secure Keys</h2>
        <div className="space-y-4">
          {fetching ? (
            <div>読み込み中...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-muted-foreground">APIキーはありません</div>
          ) : (
            apiKeys.map((k:any) => (
              <div key={k.key} className="flex items-center justify-between border rounded-xl px-6 py-6 bg-white">
                <div className="flex items-center gap-4">
                  <Key className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <div className="text-lg font-semibold">{k.name}</div>
                    <div className="text-xs text-muted-foreground">Created: {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "-"}</div>
                  </div>
                </div>
                <Button variant="destructive" className="rounded-xl px-6 py-2 font-semibold" onClick={()=>{setShowDelete(k.key); setDeleteConfirm("")}}>
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* 作成ダイアログ */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new API Key</DialogTitle>
            <div className="text-muted-foreground mb-2">Add a name to your API key to help you identify it later.</div>
          </DialogHeader>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">API Key Name*</label>
            <Input placeholder="Enter a name" value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold" onClick={handleCreate} disabled={!newKeyName || loading}>
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 1回のみ表示ダイアログ */}
      <Dialog open={showIssued} onOpenChange={v=>{setShowIssued(v); if(!v) setIssuedKey(null)}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy your API Key</DialogTitle>
            <div className="text-red-600 font-semibold mb-2">This value is viewable one time only</div>
            <div className="text-muted-foreground mb-2">Copy the below key to your clipboard and store it somewhere safe</div>
          </DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono bg-gray-100 rounded px-2 py-1 text-base">{issuedKey}</span>
            <Button variant="ghost" size="icon" onClick={()=>{navigator.clipboard.writeText(issuedKey||""); toast.success("Copied!")}}>
              <Copy className="w-5 h-5" />
            </Button>
          </div>
          <DialogFooter>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold" onClick={()=>{setShowIssued(false); setIssuedKey(null)}}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 削除確認ダイアログ */}
      <Dialog open={!!showDelete} onOpenChange={v=>{if(!v) setShowDelete(null)}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <div className="text-muted-foreground mb-2">Are you sure you want to delete this API key?</div>
            <div className="mb-2">Confirm by typing the name of the key: <span className="font-mono bg-gray-100 rounded px-2 py-1">{apiKeys.find(k=>k.key===showDelete)?.name}</span>
              <Button variant="ghost" size="icon" onClick={()=>{navigator.clipboard.writeText(apiKeys.find(k=>k.key===showDelete)?.name||""); toast.success("Copied!")}}>
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          <Input placeholder="API Key Name" value={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="destructive" className="rounded-xl px-6 py-2 font-semibold" disabled={deleteConfirm!==apiKeys.find(k=>k.key===showDelete)?.name} onClick={()=>handleDelete(showDelete!, deleteConfirm)}>
              Delete Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 