"use client"

import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAccounts } from "@/lib/accounts-context"

export function GuideSkipBanner() {
  const { defaultAccount } = useAccounts()
  if (!defaultAccount?.isExisting) return null

  return (
    <div className="rounded-xl border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-4 space-y-1.5">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-green-600 shrink-0" />
        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
          이미 설치됨 — 이 단계를 건너뛰어도 됩니다
        </p>
      </div>
      <p className="text-xs text-green-700 dark:text-green-500 pl-6">
        <strong>{defaultAccount.email}</strong> 계정은 이미 완료된 것으로 표시되어 있습니다.{" "}
        <Link href="/guide/commands" className="underline underline-offset-2 font-medium">
          명령어 가이드로 바로 이동 →
        </Link>
      </p>
    </div>
  )
}
