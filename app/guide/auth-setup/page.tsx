"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CodeBlock } from "@/components/code-block"
import { StepFooter } from "@/components/step-footer"
import { PersonalizedCommand } from "@/components/personalized-command"
import { AlertCircle, Info, CheckCircle2, Circle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAccounts } from "@/lib/accounts-context"

function SetupProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <Card className="bg-zinc-950 text-zinc-100 font-mono text-xs overflow-hidden">
      <CardContent className="p-4 space-y-1.5">
        <p className="text-zinc-400 mb-2">┌ gws auth setup ──────────────────────────────────┐</p>
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={i} className="flex items-center gap-2 px-2">
              {done ? (
                <CheckCircle2 className="size-3.5 text-green-400 shrink-0" />
              ) : active ? (
                <Loader2 className="size-3.5 text-yellow-400 shrink-0 animate-spin" />
              ) : (
                <Circle className="size-3.5 text-zinc-600 shrink-0" />
              )}
              <span className={done ? "text-green-400" : active ? "text-yellow-400" : "text-zinc-500"}>
                Step {i + 1}/5: {step}
              </span>
            </div>
          )
        })}
        <p className="text-zinc-400 mt-2">└──────────────────────────────────────────────────┘</p>
      </CardContent>
    </Card>
  )
}

export default function AuthSetupPage() {
  const { defaultAccount } = useAccounts()
  const setupSteps = [
    "gcloud CLI — found",
    "Authentication",
    "GCP project",
    "Workspace APIs",
    "OAuth credentials — Waiting for manual input...",
  ]

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary">STEP 4 / 4</Badge>
        <h1 className="text-2xl font-bold">인증 설정 (gws auth setup)</h1>
        <p className="text-muted-foreground text-sm">
          GCP 프로젝트와 OAuth 크리덴셜을 연결하여 gws가 Google 계정에 접근할 수 있도록 설정합니다.
        </p>
      </header>

      {defaultAccount?.isExisting && (
        <div className="rounded-xl border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-600 shrink-0" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              이미 설치됨으로 표시된 계정입니다
            </p>
          </div>
          <p className="text-xs text-green-700 dark:text-green-500">
            <strong>{defaultAccount.email}</strong> 계정은 이미{" "}
            <code className="rounded bg-green-100 dark:bg-green-900/40 px-1">gws auth setup</code>이 완료된 것으로 표시되어 있습니다.
            아래 단계를 건너뛰고 바로{" "}
            <Link href="/guide/commands" className="underline underline-offset-2">명령어 가이드</Link>로 이동하거나,
            재설치가 필요하면 계속 진행하세요.
          </p>
        </div>
      )}

      {/* Prerequisites */}
      <section className="rounded-xl border bg-muted/40 p-4 space-y-2">
        <p className="text-xs font-semibold">준비 확인</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
            GCP 프로젝트 생성 완료 (Step 1)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
            OAuth 크리덴셜 다운로드 완료 (Step 2)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
            gws CLI 설치 완료 (Step 3)
          </li>
        </ul>
      </section>

      {/* Step 1 — gcloud login for this account */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
          설정할 계정으로 gcloud 로그인
        </h2>
        <p className="text-sm text-muted-foreground">
          gws auth setup은 현재 활성화된 gcloud 계정 기준으로 동작합니다.
          설정할 Google 계정으로 먼저 로그인하세요.
        </p>
        <CodeBlock code="gcloud auth login" lang="bash" />
        <p className="text-xs text-muted-foreground">
          브라우저에서 gws를 사용할 Google 계정으로 로그인합니다.
        </p>
        <CodeBlock
          code={`# 로그인된 계정 확인
gcloud auth list`}
          lang="bash"
        />
      </section>

      {/* Step 2 — Run gws auth setup */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
          gws auth setup 실행
        </h2>

        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <AlertCircle className="size-4 text-orange-600" />
          <AlertDescription className="text-xs text-orange-700 dark:text-orange-400 space-y-1">
            <p className="font-semibold">⚠️ 반드시 한 줄로 실행하세요</p>
            <p>
              환경변수와 gws 명령을 줄바꿈하면 <code className="rounded bg-orange-100 px-1">--login</code>이
              별도 명령으로 처리되어 오류가 납니다.
            </p>
          </AlertDescription>
        </Alert>

        <PersonalizedCommand
          accountIndex="default"
          template={`GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws auth setup --project {{PROJECT_ID}} --login`}
          filename="한 줄로 복붙해서 실행"
        />

        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            <strong>기본 계정(첫 번째 설치)</strong>이라면 환경변수 없이 실행해도 됩니다:
            <div className="mt-1.5">
              <PersonalizedCommand
                accountIndex="default"
                template={`gws auth setup --project {{PROJECT_ID}} --login`}
              />
            </div>
          </AlertDescription>
        </Alert>
      </section>

      {/* Step 3 — Interactive prompts */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
          5단계 설정 진행
        </h2>
        <p className="text-sm text-muted-foreground">
          실행하면 아래와 같은 진행 화면이 나타납니다:
        </p>
        <SetupProgress steps={setupSteps} current={1} />
        <div className="space-y-3 text-sm">
          <div className="rounded-lg border p-3 space-y-1">
            <p className="font-medium text-xs">Step 2 — 계정 선택 프롬프트</p>
            <p className="text-xs text-muted-foreground">
              gcloud에 여러 계정이 있으면 선택 화면이 나옵니다.
              반드시 <strong>설정하려는 계정</strong>을 선택하세요.
              잘못된 계정 선택 시 엉뚱한 계정으로 인증됩니다.
            </p>
            <Card className="bg-zinc-950 mt-2">
              <CardContent className="p-3 font-mono text-xs text-zinc-300 space-y-0.5">
                <p className="text-zinc-500">┌ Select a Google account ──────────────┐</p>
                <p>{"  ◉ "}<span className="text-yellow-400">your@gmail.com</span>   ← 이 계정 선택</p>
                <p className="text-zinc-500">{"  ○ other@gmail.com"}</p>
                <p className="text-zinc-500">└──────────────────────────────────────┘</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border p-3 space-y-1">
            <p className="font-medium text-xs">Step 5 — OAuth credentials</p>
            <p className="text-xs text-muted-foreground">
              크리덴셜을 자동으로 찾지 못하면 콘솔에서 직접 입력하라고 요청합니다.
              브라우저 링크가 표시되면 해당 URL에서 <strong>Client ID와 Client Secret</strong>을 복사하여 붙여넣으세요.
            </p>
          </div>
        </div>
      </section>

      {/* Step 4 — Browser auth */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
          브라우저 인증 완료
        </h2>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">1</span>
            <span>터미널에 URL이 표시되면 브라우저가 자동으로 열립니다.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">2</span>
            <span>설정하려는 Google 계정을 선택합니다.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">3</span>
            <div>
              <strong>&quot;Google이 확인하지 않은 앱&quot;</strong> 경고가 나오면:
              <p className="text-xs text-muted-foreground mt-0.5">
                <strong>고급</strong> → <strong>[앱 이름](안전하지 않음)으로 이동</strong>
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">4</span>
            <span><strong>허용</strong> 클릭 → 터미널에 완료 메시지가 표시됩니다.</span>
          </li>
        </ol>

        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription className="text-xs space-y-1">
            <p><strong>&quot;액세스 차단됨: 앱이 Google 인증을 완료하지 않았습니다&quot;</strong></p>
            <p>OAuth 동의화면의 테스트 사용자에 본인 계정이 추가되지 않아서 발생합니다.</p>
            <p>
              브라우저에서{" "}
              <strong>API 및 서비스 → OAuth 동의화면 → 테스트 사용자</strong>에
              사용 중인 Gmail 주소를 추가하세요.
            </p>
          </AlertDescription>
        </Alert>
      </section>

      {/* Step 5 — Verify */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">5</span>
          인증 확인
        </h2>
        <PersonalizedCommand
          accountIndex="default"
          template={`GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws auth status`}
        />
        <Card className="bg-zinc-950 text-zinc-300 font-mono text-xs">
          <CardContent className="p-3 space-y-0.5">
            <p className="text-zinc-500">{"{"}</p>
            <p>{"  "}<span className="text-blue-400">&quot;token_valid&quot;</span>: <span className="text-green-400">true</span>,</p>
            <p>{"  "}<span className="text-blue-400">&quot;user&quot;</span>: <span className="text-yellow-300">&quot;your@gmail.com&quot;</span></p>
            <p className="text-zinc-500">{"}"}</p>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          <code className="rounded bg-muted px-1">&quot;token_valid&quot;: true</code>가 나오면 인증 완료입니다.
        </p>
      </section>

      {/* 다음 단계 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">이제 gws를 사용할 수 있습니다</h2>
        <CodeBlock code="gws calendar list" lang="bash" filename="동작 확인 명령어" />
        <p className="text-xs text-muted-foreground">
          캘린더 목록이 출력되면 완전히 설정된 것입니다.
        </p>
        <p className="text-xs text-muted-foreground">
          두 번째 계정을 추가하려면{" "}
          <Link href="/guide/multi-account" className="text-blue-600 hover:underline">
            멀티 계정 가이드
          </Link>
          를 참고하세요.
        </p>
      </section>

      <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-4 text-sm text-green-700 dark:text-green-400">
        ✅ gws 설치 및 인증 완료! 이제 터미널에서 Google Workspace를 사용할 수 있습니다.
      </div>

      <StepFooter
        prev={{ href: "/guide/install", label: "3. gws 설치" }}
        next={{ href: "/guide/commands", label: "명령어 가이드" }}
      />
    </article>
  )
}
