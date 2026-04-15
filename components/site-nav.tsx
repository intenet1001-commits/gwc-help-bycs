"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useOS } from "@/lib/os-context"
import { Monitor, Apple } from "lucide-react"

const steps = [
  { href: "/guide/gcp-project", label: "1. GCP & API", short: "1" },
  { href: "/guide/credentials", label: "2. 크리덴셜", short: "2" },
  { href: "/guide/install", label: "3. 설치", short: "3" },
  { href: "/guide/auth-setup", label: "4. 인증", short: "4" },
  { href: "/guide/multi-account", label: "+ 계정 추가", short: "+" },
  { href: "/guide/commands", label: "명령어", short: "🗒" },
]

export function SiteNav() {
  const pathname = usePathname()
  const { os, setOs } = useOS()

  const currentStep = steps.findIndex((s) => pathname.startsWith(s.href))

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
          <span className="rounded-md bg-primary px-2 py-0.5 text-primary-foreground text-xs font-bold">gws</span>
          <span className="hidden sm:inline text-muted-foreground">설치 가이드</span>
        </Link>

        {/* Step progress — only shown on guide pages */}
        {currentStep >= 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {steps.map((step, i) => (
              <Link
                key={step.href}
                href={step.href}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  pathname.startsWith(step.href)
                    ? "bg-primary text-primary-foreground"
                    : i < currentStep
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {step.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {/* OS Toggle */}
          <div className="flex items-center rounded-lg border bg-muted p-0.5 text-xs">
            <button
              onClick={() => setOs("mac")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors",
                os === "mac" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Apple className="size-3" />
              Mac
            </button>
            <button
              onClick={() => setOs("windows")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors",
                os === "windows" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="size-3" />
              Windows
            </button>
          </div>

          {/* Parser tool link */}
          <Link
            href="/tools/credentials-parser"
            className={cn(
              "hidden sm:flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              pathname.startsWith("/tools/credentials-parser")
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground"
            )}
          >
            JSON 파서
          </Link>
        </div>
      </div>

      {/* Mobile step progress */}
      {currentStep >= 0 && (
        <div className="flex md:hidden items-center gap-1 px-4 pb-2 overflow-x-auto">
          {steps.map((step, i) => (
            <Link
              key={step.href}
              href={step.href}
              className={cn(
                "flex items-center justify-center size-7 rounded-full text-xs font-bold shrink-0 transition-colors",
                pathname.startsWith(step.href)
                  ? "bg-primary text-primary-foreground"
                  : i < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.short}
            </Link>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            {steps[currentStep]?.label.replace(/^\d+\. /, "")}
          </span>
        </div>
      )}
    </header>
  )
}
