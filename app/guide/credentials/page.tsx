"use client"

import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StepFooter } from "@/components/step-footer"
import { GuideSkipBanner } from "@/components/guide-skip-banner"
import { useAccounts } from "@/lib/accounts-context"
import { Info, ArrowRight, ExternalLink } from "lucide-react"

export default function CredentialsPage() {
  const { defaultAccount } = useAccounts()
  const projectId = defaultAccount?.projectId

  const consoleSteps = [
    {
      url: projectId
        ? `https://console.cloud.google.com/apis/credentials/consent?project=${projectId}`
        : "https://console.cloud.google.com/apis/credentials/consent",
      label: "OAuth 동의 화면 설정",
      steps: [
        "User Type: 외부(External) 선택 → 만들기",
        "앱 이름 입력 (예: gws-cli) + 지원 이메일 입력",
        "저장 후 계속 → 저장 후 계속 → 저장 후 계속",
        "테스트 사용자: +ADD USERS → 본인 이메일 추가 → 저장",
      ],
    },
    {
      url: projectId
        ? `https://console.cloud.google.com/apis/credentials?project=${projectId}`
        : "https://console.cloud.google.com/apis/credentials",
      label: "OAuth 클라이언트 ID 만들기",
      steps: [
        "+ 사용자 인증 정보 만들기 → OAuth 클라이언트 ID",
        "애플리케이션 유형: 데스크톱 앱 (⚠️ 웹 앱 아님)",
        "이름 입력 → 만들기",
        "팝업에서 JSON 다운로드 클릭",
      ],
    },
  ]

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary">STEP 2 / 4</Badge>
        <h1 className="text-2xl font-bold">OAuth 크리덴셜 받기</h1>
        <p className="text-muted-foreground text-sm">
          이 단계만 브라우저가 필요합니다. 두 개의 링크에서 총 <strong>10번 클릭</strong>으로 끝납니다.
        </p>
      </header>

      <GuideSkipBanner />

      {projectId && (
        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            아래 <strong>바로가기</strong> 버튼이 프로젝트{" "}
            <code className="rounded bg-muted px-1">{projectId}</code>로 바로 연결됩니다.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {consoleSteps.map((section, idx) => (
          <Card key={idx} className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium">{section.label}</span>
              </div>
              <a
                href={section.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="size-3" />
                바로가기{projectId ? ` (${projectId})` : ""}
              </a>
            </div>
            <CardContent className="p-4">
              <ol className="space-y-2">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: step.replace(/⚠️/g, '<span class="text-orange-500">⚠️</span>') }} />
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <Info className="size-4" />
        <AlertDescription className="text-xs space-y-1">
          <p>다운받은 파일 이름이 <code className="rounded bg-muted px-1">client_secret_...json</code>처럼 길다면</p>
          <p><code className="rounded bg-muted px-1">credentials.json</code>으로 이름을 바꾸면 관리하기 편합니다.</p>
        </AlertDescription>
      </Alert>

      {/* JSON 파서 CTA */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              파일 내용 확인이 필요하면?
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">
              credentials.json을 붙여넣으면 project_id, client_id 등을 개별 복사할 수 있습니다.
            </p>
          </div>
          <Link
            href="/tools/credentials-parser"
            className="shrink-0 flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            JSON 파서
            <ArrowRight className="size-3" />
          </Link>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-4 text-sm text-green-700 dark:text-green-400">
        ✅ credentials.json 다운로드 완료. 이제 다시 터미널로 돌아갑니다.
      </div>

      <StepFooter
        prev={{ href: "/guide/gcp-project", label: "1. GCP 세팅" }}
        next={{ href: "/guide/install", label: "3. gws 설치 & 인증" }}
      />
    </article>
  )
}
