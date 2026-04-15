"use client"

import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CodeBlock } from "@/components/code-block"
import { PersonalizedCommand } from "@/components/personalized-command"
import { useAccounts } from "@/lib/accounts-context"
import { Info, Users, Star, ExternalLink, AlertCircle, Terminal } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function MultiAccountPage() {
  const { accounts, defaultAccount } = useAccounts()
  const extraAccounts = accounts.filter((a) => !a.isDefault)

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">추가 가이드</Badge>
          <Badge variant="outline" className="text-xs">
            <Users className="size-3 mr-1" />
            멀티 계정
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">두 번째 계정 추가하기</h1>
        <p className="text-muted-foreground text-sm">
          gws는 계정별로 config 디렉토리를 분리합니다.
          <code className="mx-1 rounded bg-muted px-1 text-xs">GOOGLE_WORKSPACE_CLI_CONFIG_DIR</code>
          환경변수로 원하는 계정을 전환합니다.
        </p>
      </header>

      {/* 핵심 원칙 */}
      <section className="rounded-xl border bg-muted/40 p-4 space-y-3">
        <h2 className="text-sm font-semibold">핵심 원칙</h2>
        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          <div className="rounded-lg border bg-background p-3 space-y-1">
            <p className="font-medium flex items-center gap-1.5"><Star className="size-3.5 text-yellow-500" /> 기본 계정</p>
            <p className="text-muted-foreground">환경변수 없이 <code className="rounded bg-muted px-1">gws</code>만 실행</p>
            <p className="text-muted-foreground">config 경로: <code className="rounded bg-muted px-1">~/.config/gws</code></p>
          </div>
          <div className="rounded-lg border bg-background p-3 space-y-1">
            <p className="font-medium flex items-center gap-1.5"><Users className="size-3.5 text-blue-500" /> 추가 계정</p>
            <p className="text-muted-foreground">매 명령마다 환경변수 지정 또는 alias 사용</p>
            <p className="text-muted-foreground">config 경로: <code className="rounded bg-muted px-1">~/.config/gws_계정명</code></p>
          </div>
        </div>
      </section>

      {/* Current state */}
      {accounts.length > 0 && (
        <section className="rounded-xl border bg-muted/40 p-4 space-y-3">
          <h2 className="text-sm font-semibold">내 계정 현황</h2>
          <div className="space-y-1.5 text-xs font-mono">
            {accounts.map((a) => (
              <div key={a.id} className="flex items-center gap-2 flex-wrap">
                <span className={`size-2 rounded-full shrink-0 ${a.isDefault ? "bg-green-500" : "bg-blue-400"}`} />
                <span className={`font-semibold ${a.isDefault ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400"}`}>
                  {a.isDefault ? "기본" : "추가"}
                </span>
                <span>{a.email}</span>
                <span className="text-muted-foreground">→ {a.configDir}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 1: GCP project for new account */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
          추가 계정으로 gcloud 로그인 + 프로젝트 생성
        </h2>
        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            기존 계정(기본)과 추가 계정은 <strong>각각 별도의 GCP 프로젝트</strong>가 필요합니다.
          </AlertDescription>
        </Alert>
        <PersonalizedCommand
          accountIndex="non-default"
          template={`# 추가 계정으로 gcloud 로그인 (기존 계정 유지됨)
gcloud auth login

# 추가 계정을 활성 계정으로 전환
gcloud config set account {{EMAIL}}

# 프로젝트 생성
gcloud projects create {{PROJECT_ID}} --name="{{PROJECT_ID}}"
gcloud config set project {{PROJECT_ID}}

# API 한 번에 활성화
gcloud services enable \\
  gmail.googleapis.com \\
  drive.googleapis.com \\
  calendar-json.googleapis.com \\
  sheets.googleapis.com \\
  docs.googleapis.com \\
  tasks.googleapis.com`}
          filename="추가 계정 GCP 세팅 (CLI)"
        />
      </section>

      {/* Step 2: OAuth consent + credentials (browser only) */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
          OAuth 동의화면 + 크리덴셜 (브라우저 필수)
        </h2>
        <div className="space-y-3">
          {[
            {
              label: "OAuth 동의화면 설정",
              urlBase: "https://console.cloud.google.com/apis/credentials/consent?project=",
              steps: [
                "External → Create",
                "앱 이름 + 지원 이메일 입력 → Save and Continue (나머지 통과)",
                "⚠️ Test users → + Add Users → 추가 계정 이메일 추가 (필수!)",
              ],
            },
            {
              label: "OAuth 클라이언트 ID 생성 + 다운로드",
              urlBase: "https://console.cloud.google.com/apis/credentials?project=",
              steps: [
                "+ Create Credentials → OAuth client ID",
                "애플리케이션 유형: 데스크톱 앱",
                "만들기 → JSON 다운로드",
              ],
            },
          ].map((section, idx) => {
            const projectId = extraAccounts[0]?.projectId ?? "YOUR_PROJECT_ID"
            const url = section.urlBase + projectId
            return (
              <Card key={idx} className="overflow-hidden">
                <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{idx + 1}</span>
                    <span className="text-sm font-medium">{section.label}</span>
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                    <ExternalLink className="size-3" />바로가기
                  </a>
                </div>
                <CardContent className="p-4">
                  <ol className="space-y-2">
                    {section.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">{i + 1}</span>
                        <span className={step.startsWith("⚠️") ? "text-orange-600 font-medium" : ""}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Step 3: Setup config dir */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
          Config 디렉토리 생성 및 인증
        </h2>

        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <AlertCircle className="size-4 text-orange-600" />
          <AlertDescription className="text-xs text-orange-700 dark:text-orange-400">
            <strong>환경변수와 gws 명령은 반드시 한 줄로!</strong> 줄바꿈하면 오류가 납니다.
          </AlertDescription>
        </Alert>

        <PersonalizedCommand
          accountIndex="non-default"
          template={`# config 디렉토리 생성
mkdir -p {{CONFIG_DIR}}

# 다운받은 JSON을 client_secret.json으로 복사
cp ~/Downloads/client_secret_*.json {{CONFIG_DIR}}/client_secret.json

# gws auth setup (한 줄로 실행!)
GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws auth setup --project {{PROJECT_ID}} --login`}
          filename="한 줄씩 순서대로 실행"
        />

        <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-xs">
          <p className="font-medium">실행 중 계정 선택 프롬프트가 나오면:</p>
          <Card className="bg-zinc-950">
            <CardContent className="p-3 font-mono text-xs text-zinc-300 space-y-0.5">
              <p className="text-zinc-500">┌ Select a Google account ──────────────┐</p>
              <p>{"  ○ "}{defaultAccount?.email ?? "기본계정@gmail.com"}</p>
              <p>{"  ◉ "}<span className="text-yellow-400">{extraAccounts[0]?.email ?? "추가계정@gmail.com"}</span>
                {" "}<span className="text-green-400">← 이 계정 선택</span></p>
              <p className="text-zinc-500">└──────────────────────────────────────┘</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Step 4: Verify */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
          인증 확인
        </h2>
        <PersonalizedCommand
          accountIndex="non-default"
          template={`GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws auth status`}
        />
        <p className="text-xs text-muted-foreground">
          <code className="rounded bg-muted px-1">&quot;token_valid&quot;: true</code>와
          <code className="mx-1 rounded bg-muted px-1">&quot;user&quot;: &quot;추가계정@gmail.com&quot;</code>이 나오면 성공입니다.
        </p>
      </section>

      <Separator />

      {/* Usage: env var */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Terminal className="size-4" />
          계정 전환 방법
        </h2>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Star className="size-3.5 text-yellow-500" />
              기본 계정 ({defaultAccount?.email ?? "default"}) — 그냥 실행
            </p>
            <CodeBlock code="gws calendar list" lang="bash" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-blue-500" />
              추가 계정 — 환경변수 명시
            </p>
            <PersonalizedCommand
              accountIndex="non-default"
              template={`GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws calendar list`}
            />
          </div>
        </div>
      </section>

      {/* Alias setup */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">alias 등록으로 편하게 사용하기</h2>
        <p className="text-sm text-muted-foreground">
          매번 환경변수 입력이 번거로우면 <code className="rounded bg-muted px-1 text-xs">~/.zshrc</code>에 alias를 등록합니다.
        </p>
        {accounts.length > 0 ? (
          <CodeBlock
            code={accounts.map((a) => {
              const slug = a.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase()
              return `alias gws${slug}='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=${a.configDir} gws'`
            }).join("\n")}
            lang="bash"
            filename="~/.zshrc에 추가"
          />
        ) : (
          <CodeBlock
            code={`# ~/.zshrc에 추가
alias gws8821='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws_8821 gws'
alias gws1002='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws_1002 gws'`}
            lang="bash"
            filename="~/.zshrc에 추가"
          />
        )}
        <CodeBlock code="source ~/.zshrc" lang="bash" filename="적용" />
        <p className="text-xs text-muted-foreground">
          이후 <code className="rounded bg-muted px-1">gws1002 calendar list</code>,{" "}
          <code className="rounded bg-muted px-1">gws8821 gmail +triage</code> 처럼 사용합니다.
        </p>
      </section>

      {/* Default account symlink */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">기본 계정 변경 (심볼릭 링크)</h2>
        <p className="text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1 text-xs">~/.config/gws</code>는
          심볼릭 링크로 관리합니다. 링크 대상을 바꾸면 기본 계정이 변경됩니다.
        </p>
        {extraAccounts.length > 0 ? (
          <PersonalizedCommand
            accountIndex="non-default"
            template={`# 기존 심볼릭 링크 제거
rm ~/.config/gws

# 새 계정을 기본으로 설정
ln -s {{CONFIG_DIR}} ~/.config/gws

# 확인
gws auth status`}
            filename="기본 계정 전환"
          />
        ) : (
          <CodeBlock
            code={`rm ~/.config/gws
ln -s ~/.config/gws_NEW_ACCOUNT ~/.config/gws`}
            lang="bash"
          />
        )}
      </section>

      {/* Claude Code skill section */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Claude Code에서 계정별 스킬 만들기</h2>
        <p className="text-sm text-muted-foreground">
          Claude Code에서 <code className="rounded bg-muted px-1 text-xs">/gws1002</code>,{" "}
          <code className="rounded bg-muted px-1 text-xs">/gws8821</code>로 계정을 지정하여 명령을 실행할 수 있습니다.
        </p>

        {accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((a) => {
              const slug = a.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase()
              return (
                <div key={a.id} className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    스킬 파일 생성: <code className="rounded bg-muted px-1">~/.claude/skills/gws{slug}/SKILL.md</code>
                  </p>
                  <CodeBlock
                    code={`mkdir -p ~/.claude/skills/gws${slug}
cat > ~/.claude/skills/gws${slug}/SKILL.md << 'EOF'
---
name: gws${slug}
version: 1.0.0
description: "Google Workspace CLI for ${a.email}. Runs with GOOGLE_WORKSPACE_CLI_CONFIG_DIR=${a.configDir}."
---

# gws${slug} — ${a.email}

이 스킬 실행 시 모든 gws 명령을 ${a.email} 계정으로 실행합니다.

## 명령 실행 규칙

모든 gws 명령 앞에 환경변수를 붙인다:

\`\`\`bash
GOOGLE_WORKSPACE_CLI_CONFIG_DIR=${a.configDir} gws <service> <resource> <method>
\`\`\`
EOF`}
                    lang="bash"
                    filename={`/gws${slug} 스킬 생성`}
                  />
                </div>
              )
            })}
            <Alert>
              <Info className="size-4" />
              <AlertDescription className="text-xs">
                생성 후 Claude Code를 <strong>/clear</strong> 하면 <code className="rounded bg-muted px-1">/gws{accounts.length > 0 ? accounts[0].email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() : "8821"}</code> 스킬이 활성화됩니다.
                <br />
                <code className="rounded bg-muted px-1">/gws</code>만 입력하면 gws로 시작하는 스킬 목록이, 정확한 이름을 입력하면 바로 실행됩니다.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <CodeBlock
            code={`# 각 계정별 스킬 디렉토리 생성
mkdir -p ~/.claude/skills/gws8821
mkdir -p ~/.claude/skills/gws1002

# /clear 후 /gws8821, /gws1002 로 실행 가능`}
            lang="bash"
          />
        )}
      </section>
    </article>
  )
}
