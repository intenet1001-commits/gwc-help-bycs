import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Terminal, Wrench } from "lucide-react"
import { AccountSetup } from "@/components/account-setup"
import { HomeQuickStart } from "@/components/home-quick-start"

const steps = [
  {
    number: "01",
    href: "/guide/install",
    title: "gws CLI 설치",
    description: "npm install -g @googleworkspace/cli 한 줄로 설치. Node.js만 있으면 됩니다.",
    time: "CLI · 2분",
    badge: "CLI",
  },
  {
    number: "02",
    href: "/guide/gcp-project",
    title: "GCP 프로젝트 & API 세팅",
    description: "gcloud CLI로 프로젝트 생성 + 필요한 API 한 번에 활성화. 브라우저 불필요.",
    time: "CLI · 5분",
    badge: "CLI",
  },
  {
    number: "03",
    href: "/guide/credentials",
    title: "OAuth 크리덴셜 받기",
    description: "이 단계만 브라우저 필요. 두 링크에서 10번 클릭으로 credentials.json 다운로드.",
    time: "브라우저 · 5분",
    badge: "브라우저",
  },
  {
    number: "04",
    href: "/guide/auth-setup",
    title: "인증 설정 (gws auth setup)",
    description: "gws auth setup --project ID --login 실행 후 브라우저 허용 클릭으로 완료.",
    time: "CLI · 2분",
    badge: "CLI",
  },
  {
    number: "05",
    href: "/guide/commands",
    title: "명령어 레퍼런스",
    description: "Gmail, Drive, Calendar, Sheets 등 주요 gws 명령어 모음.",
    time: "참고용",
    badge: null,
  },
]

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-6 pt-4 text-center">
        <div className="flex justify-center">
          <Badge className="text-sm px-3 py-1" variant="secondary">
            gws v0.22.5 기준 · Mac &amp; Windows
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Google Workspace CLI<br />
          <span className="text-muted-foreground">완벽 설치 가이드</span>
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground text-base leading-relaxed">
          터미널에서 Gmail, Drive, Calendar, Sheets를 명령어로 제어하세요.
          초보자도 30분 안에 완성할 수 있도록 단계별로 안내합니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/guide/install" className="flex items-center gap-2">
              지금 시작하기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/tools/credentials-parser" className="flex items-center gap-2">
              <Wrench className="size-4" />
              JSON 파서 도구
            </Link>
          </Button>
        </div>
      </section>

      {/* Situation selector */}
      <HomeQuickStart />

      {/* Account setup */}
      <AccountSetup />

      {/* What you need */}
      <section className="rounded-xl border bg-muted/40 p-6 space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-500" />
          시작 전 확인사항
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0 mt-1.5" />
            Google 계정 (개인 Gmail 또는 Google Workspace 계정)
          </li>
          <li className="flex items-start gap-2">
            <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0 mt-1.5" />
            터미널 앱 (Mac: 기본 터미널 또는 iTerm2 / Windows: PowerShell 또는 명령 프롬프트)
          </li>
          <li className="flex items-start gap-2">
            <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0 mt-1.5" />
            인터넷 연결
          </li>
        </ul>
      </section>

      {/* Steps grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Terminal className="size-5" />
          설치 단계
        </h2>
        <div className="space-y-3">
          {steps.map((step) => (
            <Link key={step.href} href={step.href} className="block group">
              <Card className="transition-colors hover:border-primary/50 hover:bg-accent/30">
                <CardHeader className="pb-2 flex-row items-start gap-4 space-y-0">
                  <span className="text-2xl font-black text-muted-foreground/30 leading-none font-mono w-10 shrink-0">
                    {step.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm group-hover:text-primary transition-colors flex items-center gap-2 flex-wrap">
                      {step.title}
                      {step.badge && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${step.badge === "CLI" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"}`}>
                          {step.badge === "CLI" ? "🖥 CLI" : "🌐 브라우저"}
                        </span>
                      )}
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {step.time}
                  </Badge>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Tool highlight */}
      <section>
        <Link href="/tools/credentials-parser" className="block group">
          <Card className="border-dashed transition-colors hover:border-primary/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                <Wrench className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                  credentials.json 파서 도구
                  <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  다운받은 credentials.json을 붙여넣으면 각 키-값을 개별 복사할 수 있습니다.
                  client_id, client_secret 등을 한눈에 확인하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>
    </div>
  )
}
