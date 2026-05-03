"use client"

import { useState } from "react"
import { useAccounts } from "@/lib/accounts-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ChevronDown, ChevronUp, Users, CheckCircle2, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function AccountSetup() {
  const { accounts, addAccount, removeAccount, updateAccount, setDefault } = useAccounts()
  const [newEmail, setNewEmail] = useState("")
  const [newSuffix, setNewSuffix] = useState("")
  const [isExisting, setIsExisting] = useState(false)
  const [open, setOpen] = useState(true)

  const defaultAccount = accounts.find((a) => a.isDefault)

  const handleAdd = () => {
    if (!newEmail.trim()) return
    addAccount(newEmail.trim(), newSuffix.trim() || undefined, isExisting)
    setNewEmail("")
    setNewSuffix("")
    setIsExisting(false)
  }

  return (
    <Card className={cn("border-2 transition-colors", accounts.length > 0 ? "border-green-200 dark:border-green-900" : "border-dashed")}>
      <CardHeader className="pb-3 cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="size-4" />
            내 Google 계정 입력
            {accounts.length > 0 && (
              <Badge variant="secondary" className="text-xs">{accounts.length}개 등록됨</Badge>
            )}
          </span>
          <span className="text-muted-foreground">
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </span>
        </CardTitle>
        {!open && accounts.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            기본(gws): {defaultAccount?.email ?? "—"}
            {accounts.filter((a) => !a.isDefault).length > 0 &&
              ` · gws_${accounts.filter((a) => !a.isDefault).map((a) => a.suffix).join(", gws_")}`}
          </p>
        )}
      </CardHeader>

      {open && (
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            gws config 폴더(<code className="rounded bg-muted px-1">gws_*</code>)별로 계정을 등록하고,
            어느 계정을 기본(<code className="rounded bg-muted px-1">~/.config/gws</code>)으로 쓸지 선택하세요.
          </p>

          {/* 계정 목록 */}
          {accounts.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">등록된 계정</p>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={cn(
                    "rounded-lg border p-3 space-y-2.5 transition-colors",
                    account.isDefault
                      ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                      : "border-border bg-muted/20"
                  )}
                >
                  {/* 헤더 행 */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* 기본 선택 라디오 */}
                      <button
                        onClick={() => !account.isDefault && setDefault(account.id)}
                        title={account.isDefault ? "현재 기본 계정" : "기본(gws)으로 설정"}
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          account.isDefault
                            ? "border-green-500 bg-green-500"
                            : "border-muted-foreground hover:border-primary"
                        )}
                      >
                        {account.isDefault && <span className="size-1.5 rounded-full bg-white" />}
                      </button>

                      {/* 폴더 배지 */}
                      <code className={cn(
                        "text-[11px] font-mono rounded px-1.5 py-0.5",
                        account.isDefault
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {`~/.config/gws_${account.suffix}`}
                      </code>
                      {account.isDefault && (
                        <span className="text-[10px] text-green-600 dark:text-green-400 font-mono">
                          (→ gws)
                        </span>
                      )}

                      {account.isDefault && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                          <Star className="size-2.5 mr-1" />
                          기본
                        </Badge>
                      )}
                      {account.isExisting && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0">
                          <CheckCircle2 className="size-2.5 mr-1" />
                          설치됨
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateAccount(account.id, { isExisting: !account.isExisting })}
                        className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 shrink-0"
                      >
                        {account.isExisting ? "신규로" : "설치됨"}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeAccount(account.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* 편집 필드 */}
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">이메일</Label>
                      <p className="text-xs font-mono truncate text-foreground/80">{account.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">폴더명 (gws_뒤)</Label>
                      <div className="flex items-center h-7 rounded border bg-background px-2 gap-0 focus-within:ring-1 focus-within:ring-primary">
                        <span className="text-[11px] font-mono text-muted-foreground shrink-0">gws_</span>
                        <input
                          value={account.suffix}
                          onChange={(e) => updateAccount(account.id, { suffix: e.target.value.replace(/\s/g, "") })}
                          className="flex-1 min-w-0 text-xs font-mono bg-transparent focus:outline-none"
                          spellCheck={false}
                        />
                      </div>
                      {account.isDefault && (
                        <p className="text-[10px] text-green-600 dark:text-green-400">
                          ↗ ~/.config/gws 심볼릭 링크 대상
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">GCP 프로젝트 ID</Label>
                      <Input
                        value={account.projectId}
                        onChange={(e) => updateAccount(account.id, { projectId: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 계정 추가 폼 */}
          <div className="rounded-lg border border-dashed p-3 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">계정 추가</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="이메일 (예: you@gmail.com)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="text-sm flex-1"
              />
              <div className="flex items-center h-9 rounded border bg-background px-2 gap-0 focus-within:ring-1 focus-within:ring-primary sm:w-36">
                <span className="text-[11px] font-mono text-muted-foreground shrink-0">gws_</span>
                <input
                  value={newSuffix}
                  onChange={(e) => setNewSuffix(e.target.value.replace(/\s/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="8821"
                  className="flex-1 min-w-0 text-xs font-mono bg-transparent focus:outline-none"
                  spellCheck={false}
                />
              </div>
              <Button onClick={handleAdd} disabled={!newEmail.trim()} size="sm" className="shrink-0">
                <Plus className="size-4 mr-1" />
                추가
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <button
                role="checkbox"
                aria-checked={isExisting}
                onClick={() => setIsExisting((v) => !v)}
                className={cn(
                  "flex size-4 items-center justify-center rounded border transition-colors shrink-0",
                  isExisting ? "border-green-500 bg-green-500 text-white" : "border-muted-foreground"
                )}
              >
                {isExisting && <CheckCircle2 className="size-3" />}
              </button>
              <span className="text-xs text-muted-foreground">
                이미 <code className="rounded bg-muted px-1">gws auth setup</code> 완료된 계정
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              폴더명 미입력 시 이메일 앞부분으로 자동 생성됩니다.
              첫 번째 추가된 계정이 기본(gws)으로 설정됩니다.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
