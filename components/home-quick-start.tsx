"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Rocket } from "lucide-react"
import { useAccounts } from "@/lib/accounts-context"

export function HomeQuickStart() {
  const { accounts, defaultAccount } = useAccounts()

  if (defaultAccount?.isExisting) {
    return (
      <div className="rounded-xl border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">gws 설치 완료</p>
            <p className="text-xs text-green-600 dark:text-green-500">{defaultAccount.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" variant="outline" className="text-green-700 border-green-400 hover:bg-green-100 dark:text-green-400 dark:border-green-700">
            <Link href="/guide/multi-account">계정 추가</Link>
          </Button>
          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
            <Link href="/guide/commands" className="flex items-center gap-1">
              명령어 보기 <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (accounts.length > 0) {
    return null
  }

  return (
    <div className="rounded-xl border-2 bg-muted/30 p-5 space-y-4">
      <p className="text-sm font-semibold">나는 어떤 상황인가요?</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border bg-background p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Rocket className="size-4 text-primary" />
            <p className="text-sm font-medium">처음 설치하는 경우</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            gws를 한 번도 설치한 적 없어요. 아래에 이메일을 입력한 뒤 Step 1부터 시작하세요.
          </p>
          <Button asChild size="sm" className="w-full">
            <Link href="/guide/install" className="flex items-center justify-center gap-1.5">
              Step 1부터 시작 <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
        <div className="rounded-lg border bg-background p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-500" />
            <p className="text-sm font-medium">이미 gws가 있는 경우</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            이미 <code className="rounded bg-muted px-1">gws auth setup</code>을 완료한 계정이 있어요. 아래에 이메일 입력 후 &quot;이미 있음&quot; 클릭하세요.
          </p>
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href="/guide/commands" className="flex items-center justify-center gap-1.5">
              명령어 가이드로 이동 <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        어떤 경우든 <strong>아래에 Google 이메일을 먼저 입력</strong>하면 가이드 전체 명령어가 자동으로 개인화됩니다.
      </p>
    </div>
  )
}
