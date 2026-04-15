import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CodeBlock } from "@/components/code-block"
import { StepFooter } from "@/components/step-footer"
import { Info, Terminal, ExternalLink } from "lucide-react"

export const metadata = {
  title: "1. GCP 프로젝트 & API 세팅 | gws 설치 가이드",
}

export default function GcpProjectPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary">STEP 1 / 4</Badge>
        <h1 className="text-2xl font-bold">GCP 프로젝트 & API 세팅</h1>
        <p className="text-muted-foreground text-sm">
          gcloud CLI로 터미널에서 전부 처리합니다. 브라우저 없이 복붙만 하면 됩니다.
        </p>
      </header>

      {/* gcloud 설치 확인 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Terminal className="size-4" />
          gcloud 설치 확인
        </h2>
        <CodeBlock code="gcloud --version" lang="bash" />
        <p className="text-xs text-muted-foreground">
          버전이 나오면 이미 설치된 것입니다. 없으면 아래에서 설치하세요.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Mac (Homebrew)</p>
            <CodeBlock code="brew install --cask google-cloud-sdk" lang="bash" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Windows (winget)</p>
            <CodeBlock code="winget install Google.CloudSDK" lang="powershell" />
          </div>
        </div>
        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            설치 후 터미널을 재시작하거나 Mac은 <code className="mx-1 rounded bg-muted px-1">source ~/.zshrc</code>를 실행하세요.
          </AlertDescription>
        </Alert>
      </section>

      {/* gcloud 로그인 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
          Google 계정 로그인
        </h2>
        <CodeBlock code="gcloud auth login" lang="bash" />
        <p className="text-xs text-muted-foreground">
          브라우저가 열리면 사용할 Google 계정으로 로그인합니다. 이후 모든 작업은 터미널에서 처리됩니다.
        </p>
      </section>

      {/* 프로젝트 생성 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
          프로젝트 생성
        </h2>
        <p className="text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1 text-xs">MY-GWS-PROJECT</code>를 원하는 ID로 바꾸세요 (소문자, 하이픈만 가능).
        </p>
        <CodeBlock
          code={`gcloud projects create MY-GWS-PROJECT --name="GWS CLI"
gcloud config set project MY-GWS-PROJECT`}
          lang="bash"
          filename="터미널에 순서대로 실행"
        />
        <p className="text-xs text-muted-foreground">
          프로젝트 ID는 나중에 gws auth setup에 필요합니다. 메모해두세요.
        </p>
      </section>

      {/* API 활성화 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
          필요한 API 한 번에 활성화
        </h2>
        <p className="text-sm text-muted-foreground">
          아래 명령어를 그대로 복붙해서 실행합니다.
        </p>
        <CodeBlock
          code={`gcloud services enable \\
  gmail.googleapis.com \\
  drive.googleapis.com \\
  calendar-json.googleapis.com \\
  sheets.googleapis.com \\
  docs.googleapis.com \\
  tasks.googleapis.com`}
          lang="bash"
          filename="API 활성화 (한 번에)"
        />
        <p className="text-xs text-muted-foreground">
          완료까지 약 30초 걸립니다.
        </p>
      </section>

      {/* 빌링 확인 */}
      <section className="space-y-3">
        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs space-y-1">
            <p><strong>빌링 계정이 없으면 일부 API가 활성화되지 않을 수 있습니다.</strong></p>
            <p>
              신규 계정은 $300 무료 크레딧이 있습니다.{" "}
              <a
                href="https://console.cloud.google.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
              >
                빌링 설정 <ExternalLink className="size-3" />
              </a>
              에서 확인하세요. gws 개인 사용 수준에서는 무료 tier 내에서 가능합니다.
            </p>
          </AlertDescription>
        </Alert>
      </section>

      {/* 확인 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
          설정 확인
        </h2>
        <CodeBlock
          code={`gcloud config get-value project
gcloud services list --enabled --filter="NAME:(gmail OR drive OR calendar)"`}
          lang="bash"
          filename="확인 명령어"
        />
        <Card className="bg-muted/40">
          <CardContent className="p-3 font-mono text-xs space-y-0.5 text-muted-foreground">
            <p>MY-GWS-PROJECT</p>
            <p>NAME: calendar-json.googleapis.com</p>
            <p>NAME: drive.googleapis.com</p>
            <p>NAME: gmail.googleapis.com</p>
          </CardContent>
        </Card>
      </section>

      <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-4 text-sm text-green-700 dark:text-green-400">
        ✅ 프로젝트 생성 및 API 활성화 완료. 다음은 브라우저에서 OAuth 크리덴셜을 받는 단계입니다 (5분 이내).
      </div>

      <StepFooter
        next={{ href: "/guide/credentials", label: "2. OAuth 크리덴셜 받기" }}
      />
    </article>
  )
}
