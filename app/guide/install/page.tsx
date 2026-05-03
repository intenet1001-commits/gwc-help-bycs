"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { StepFooter } from "@/components/step-footer"
import { OSSection } from "@/components/os-section"
import { Info, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { GuideSkipBanner } from "@/components/guide-skip-banner"

export default function InstallPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary">STEP 3 / 4</Badge>
        <h1 className="text-2xl font-bold">gws CLI 설치</h1>
        <p className="text-muted-foreground text-sm">
          gws CLI는 Node.js 기반으로 동작합니다. Node.js가 없다면 먼저 설치해야 합니다.
          우측 상단의 OS 토글로 Mac/Windows 가이드를 전환하세요.
        </p>
      </header>

      <GuideSkipBanner />

      {/* Node.js check */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
          Node.js 설치 여부 확인
        </h2>
        <p className="text-sm text-muted-foreground">
          터미널을 열고 아래 명령어를 실행합니다. 버전 번호가 나오면 이미 설치된 것입니다.
        </p>
        <CodeBlock code="node --version" lang="bash" />
        <p className="text-xs text-muted-foreground">
          출력 예시: <code className="rounded bg-muted px-1">v20.11.0</code> —
          v18 이상이면 정상입니다. 버전이 낮거나 명령어 오류가 나면 아래에서 설치하세요.
        </p>
      </section>

      {/* Node.js install — OS specific */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
          Node.js 설치 (미설치 시)
        </h2>

        <OSSection
          mac={
            <div className="space-y-4">
              <p className="text-sm">
                <strong>방법 A: Homebrew 사용 (추천)</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Homebrew가 없다면 먼저{" "}
                <a href="https://brew.sh" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">
                  brew.sh <ExternalLink className="size-3" />
                </a>
                에서 설치하세요.
              </p>
              <CodeBlock code="brew install node" lang="bash" />
              <p className="text-sm mt-4">
                <strong>방법 B: 공식 설치 프로그램</strong>
              </p>
              <Card className="bg-muted/40">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-mono">nodejs.org/en/download</span>
                  <a
                    href="https://nodejs.org/en/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    다운로드 <ExternalLink className="size-3" />
                  </a>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground">
                LTS 버전의 macOS installer(.pkg)를 다운로드하여 실행합니다.
              </p>
            </div>
          }
          windows={
            <div className="space-y-4">
              <p className="text-sm">
                <strong>방법 A: winget 사용 (Windows 10/11, 추천)</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                PowerShell 또는 명령 프롬프트를 열고 실행합니다.
              </p>
              <CodeBlock code="winget install OpenJS.NodeJS.LTS" lang="powershell" />
              <p className="text-sm mt-4">
                <strong>방법 B: 공식 설치 프로그램</strong>
              </p>
              <Card className="bg-muted/40">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-mono">nodejs.org/en/download</span>
                  <a
                    href="https://nodejs.org/en/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    다운로드 <ExternalLink className="size-3" />
                  </a>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground">
                LTS 버전의 Windows Installer(.msi)를 다운로드하여 실행합니다.
                설치 중 &quot;Add to PATH&quot; 옵션이 체크되어 있는지 확인하세요.
              </p>
              <Alert>
                <Info className="size-4" />
                <AlertDescription className="text-xs">
                  설치 후 <strong>새 PowerShell 창</strong>을 열어야 PATH가 적용됩니다.
                </AlertDescription>
              </Alert>
            </div>
          }
        />
      </section>

      {/* gws install */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
          gws CLI 설치
        </h2>
        <p className="text-sm text-muted-foreground">
          Node.js가 준비되면 아래 명령어로 gws를 전역 설치합니다.
        </p>
        <OSSection
          mac={<CodeBlock code="npm install -g @googleworkspace/cli" lang="bash" />}
          windows={
            <div className="space-y-2">
              <CodeBlock code="npm install -g @googleworkspace/cli" lang="powershell" />
              <p className="text-xs text-muted-foreground">
                권한 오류 발생 시 PowerShell을 <strong>관리자 권한으로 실행</strong>하고 다시 시도하세요.
              </p>
            </div>
          }
        />
      </section>

      {/* Verify */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
          설치 확인
        </h2>
        <CodeBlock code="gws --version" lang="bash" />
        <p className="text-xs text-muted-foreground">
          출력 예시:
        </p>
        <CodeBlock
          code={`gws 0.22.5
This is not an officially supported Google product.`}
          lang="output"
        />
        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            <strong>Windows에서 &apos;gws&apos;가 인식되지 않는 경우:</strong> PowerShell을 재시작하거나,
            <code className="mx-1 rounded bg-muted px-1">npx @googleworkspace/cli --version</code>으로 실행해보세요.
          </AlertDescription>
        </Alert>
      </section>

      <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-4 text-sm text-green-700 dark:text-green-400">
        ✅ gws v0.22.5 설치 완료! 다음 단계로 Google 계정 인증을 진행합니다.
      </div>

      <StepFooter
        prev={{ href: "/guide/credentials", label: "2. 크리덴셜 다운로드" }}
        next={{ href: "/guide/auth-setup", label: "4. 인증 설정" }}
      />
    </article>
  )
}
