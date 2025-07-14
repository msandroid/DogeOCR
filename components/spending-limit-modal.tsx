"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { toast } from "sonner"

interface SpendingLimitModalProps {
  currentLimit: number
  onUpdateLimit: (newLimit: number) => void
}

export default function SpendingLimitModal({ currentLimit, onUpdateLimit }: SpendingLimitModalProps) {
  const [open, setOpen] = useState(false)
  const [limit, setLimit] = useState(currentLimit.toString())
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    const newLimit = parseFloat(limit)
    
    if (isNaN(newLimit) || newLimit < 0) {
      toast.error("有効な金額を入力してください")
      return
    }

    if (newLimit > 10000) {
      toast.error("支出リミットは$10,000以下に設定してください")
      return
    }

    setLoading(true)

    try {
      // API呼び出しをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onUpdateLimit(newLimit)
      toast.success("支出リミットを更新しました")
      setOpen(false)
    } catch (error) {
      toast.error("更新に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          リミット設定
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>月間支出リミット設定</DialogTitle>
          <DialogDescription>
            月間の最大支出額を設定できます。リミットに達すると自動的にサービスが停止されます。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="limit" className="text-right">
              リミット
            </Label>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="pl-8"
                placeholder="100"
                min="0"
                max="10000"
                step="1"
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>• リミットを0に設定すると無制限になります</p>
            <p>• リミットに達するとAPIアクセスが停止されます</p>
            <p>• リミットは月初にリセットされます</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "更新中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 