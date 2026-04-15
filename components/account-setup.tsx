"use client"

import { useState } from "react"
import { useAccounts } from "@/lib/accounts-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, ChevronDown, ChevronUp, Users, Star, UserPlus, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function AccountSetup() {
  const { accounts, addAccount, removeAccount, updateAccount, setDefault } = useAccounts()
  const [defaultEmail, setDefaultEmail] = useState("")
  const [defaultIsExisting, setDefaultIsExisting] = useState(false)
  const [extraEmail, setExtraEmail] = useState("")
  const [open, setOpen] = useState(true)

  const defaultAccount = accounts.find((a) => a.isDefault)
  const extraAccounts = accounts.filter((a) => !a.isDefault)

  const handleAddDefault = () => {
    if (!defaultEmail.trim()) return
    const existing = accounts.find((a) => a.isDefault)
    if (existing) removeAccount(existing.id)
    addAccount(defaultEmail.trim(), defaultIsExisting)
    setDefaultEmail("")
    setDefaultIsExisting(false)
  }

  const handleAddExtra = () => {
    if (!extraEmail.trim()) return
    addAccount(extraEmail.trim())
    setExtraEmail("")
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
            기본: {defaultAccount?.email ?? "—"}
            {extraAccounts.length > 0 && ` · 추가: ${extraAccounts.map((a) => a.email).join(", ")}`}
          </p>
        )}
      </CardHeader>

      {open && (
        <CardContent className="space-y-5">
          <p className="text-xs text-muted-foreground">
            계정을 입력하면 가이드 전체의 명령어에 실제 이메일과 경로가 자동으로 채워집니다.
          </p>

          {/* ── 기본 계정 ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="size-3.5 text-yellow-500" />
              <span className="text-xs font-semibold">기본 계정</span>
              <span className="text-xs text-muted-foreground">— 환경변수 없이 <code className="rounded bg-muted px-1">gws</code> 단독 실행 시 사용</span>
            </div>

            {defaultAccount ? (
              <div className="rounded-lg border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium truncate">{defaultAccount.email}</span>
                    {defaultAccount.isExisting ? (
                      <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        <CheckCircle2 className="size-2.5 mr-1" />
                        이미 설치됨
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 shrink-0 text-muted-foreground">
                        신규 설치
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateAccount(defaultAccount.id, { isExisting: !defaultAccount.isExisting })}
                      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 shrink-0"
                    >
                      {defaultAccount.isExisting ? "신규로 변경" : "이미 있음"}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeAccount(defaultAccount.id)}
                      className="text-destructive hover:text-destructive"
                      title="제거"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Config 경로</Label>
                    <Input
                      value={defaultAccount.configDir}
                      onChange={(e) => updateAccount(defaultAccount.id, { configDir: e.target.value })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">GCP 프로젝트 ID</Label>
                    <Input
                      value={defaultAccount.projectId}
                      onChange={(e) => updateAccount(defaultAccount.id, { projectId: e.target.value })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="기본으로 사용할 계정 (예: you@gmail.com)"
                    value={defaultEmail}
                    onChange={(e) => setDefaultEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddDefault()}
                    className="text-sm"
                  />
                  <Button onClick={handleAddDefault} disabled={!defaultEmail.trim()} size="sm" className="shrink-0">
                    <Plus className="size-4 mr-1" />
                    설정
                  </Button>
                </div>
                {/* 이미 설치됨 토글 */}
                <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                  <div
                    role="checkbox"
                    aria-checked={defaultIsExisting}
                    onClick={() => setDefaultIsExisting((v) => !v)}
                    className={cn(
                      "flex size-4 items-center justify-center rounded border transition-colors",
                      defaultIsExisting
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-muted-foreground"
                    )}
                  >
                    {defaultIsExisting && <CheckCircle2 className="size-3" />}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    이미 <code className="rounded bg-muted px-1">gws auth setup</code> 완료된 계정입니다
                  </span>
                </label>
              </div>
            )}
          </div>

          <Separator />

          {/* ── 추가 계정 ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="size-3.5 text-blue-500" />
              <span className="text-xs font-semibold">추가 계정</span>
              <span className="text-xs text-muted-foreground">— <code className="rounded bg-muted px-1">GOOGLE_WORKSPACE_CLI_CONFIG_DIR</code> 환경변수로 전환</span>
            </div>

            {extraAccounts.length > 0 && (
              <div className="space-y-2">
                {extraAccounts.map((account) => (
                  <div key={account.id} className="rounded-lg border bg-blue-50/40 dark:bg-blue-950/10 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{account.email}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setDefault(account.id)}
                          title="기본 계정으로 변경"
                          className="text-muted-foreground hover:text-yellow-600"
                        >
                          <Star className="size-3.5" />
                        </Button>
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
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Config 경로</Label>
                        <Input
                          value={account.configDir}
                          onChange={(e) => updateAccount(account.id, { configDir: e.target.value })}
                          className="h-7 text-xs font-mono"
                        />
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

            <div className="flex gap-2">
              <Input
                placeholder="추가할 계정 (예: other@gmail.com)"
                value={extraEmail}
                onChange={(e) => setExtraEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddExtra()}
                className="text-sm"
                disabled={!defaultAccount}
              />
              <Button
                onClick={handleAddExtra}
                disabled={!extraEmail.trim() || !defaultAccount}
                size="sm"
                variant="outline"
                className="shrink-0"
                title={!defaultAccount ? "기본 계정을 먼저 설정하세요" : undefined}
              >
                <Plus className="size-4 mr-1" />
                추가
              </Button>
            </div>
            {!defaultAccount && (
              <p className="text-xs text-muted-foreground">
                ↑ 기본 계정을 먼저 설정해야 추가 계정을 입력할 수 있습니다.
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
