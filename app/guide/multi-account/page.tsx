"use client"

import Link from "next/link"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CodeBlock } from "@/components/code-block"
import { PersonalizedCommand } from "@/components/personalized-command"
import { CopyButton } from "@/components/copy-button"
import { useAccounts } from "@/lib/accounts-context"
import { Info, Users, Star, ExternalLink, AlertCircle, Terminal, CheckCircle2, FolderOpen, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function MultiAccountPage() {
  const { accounts, defaultAccount } = useAccounts()
  const extraAccounts = accounts.filter((a) => !a.isDefault)
  const newExtraAccounts = extraAccounts.filter((a) => !a.isExisting)
  const existingExtraAccounts = extraAccounts.filter((a) => a.isExisting)
  const [credFiles, setCredFiles] = useState<Record<string, {
    name: string; projectId: string | null; clientId: string | null;
    clientSecret: string | null; valid: boolean; content?: string
  }>>({})
  const [aliasNames, setAliasNames] = useState<Record<string, string>>({})
  const [selectedDefaultDir, setSelectedDefaultDir] = useState<string | null>(null)
  const [customDefaultDir, setCustomDefaultDir] = useState("")

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
        <h1 className="text-2xl font-bold">추가 계정 설정 가이드</h1>
        <p className="text-muted-foreground text-sm">
          gws는 계정별로 config 디렉토리를 분리합니다.
          <code className="mx-1 rounded bg-muted px-1 text-xs">GOOGLE_WORKSPACE_CLI_CONFIG_DIR</code>
          환경변수로 원하는 계정을 전환합니다.
          아래 4단계를 계정 수만큼 반복하면 몇 개든 추가할 수 있습니다.
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
                <span className="text-muted-foreground">
                  → ~/.config/gws_{a.suffix}
                  {a.isDefault && <span className="text-green-600 dark:text-green-400 ml-1">(→ gws)</span>}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 이미 설치됨 계정 스킵 안내 */}
      {existingExtraAccounts.length > 0 && (
        <section className="rounded-xl border border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-600" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">이미 설치됨으로 표시된 추가 계정</p>
          </div>
          <div className="space-y-1">
            {existingExtraAccounts.map((a) => (
              <p key={a.id} className="text-xs text-green-700 dark:text-green-500">
                <code className="rounded bg-green-100 dark:bg-green-900/40 px-1">~/.config/gws_{a.suffix}</code>
                {" "}— {a.email}: 인증 완료됨, 아래 Steps 건너뜀
              </p>
            ))}
          </div>
        </section>
      )}

      {/* 모든 추가 계정이 이미 완료된 경우 */}
      {newExtraAccounts.length === 0 && extraAccounts.length > 0 && (
        <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          모든 추가 계정이 이미 설치됨으로 표시되어 있습니다.
        </div>
      )}

      {/* 반복 패턴 안내 */}
      <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="size-4 text-blue-600" />
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">계정 추가는 몇 개든 같은 4단계 반복입니다</p>
        </div>
        <div className="text-xs text-blue-700/80 dark:text-blue-400/80 space-y-1">
          <p>계정마다 <strong>별도 GCP 프로젝트</strong>와 <strong>별도 config 디렉토리</strong>가 필요합니다.</p>
          <p>명명 규칙: config 디렉토리는 <code className="rounded bg-blue-100 dark:bg-blue-900/40 px-1">~/.config/gws_<strong>계정명</strong></code>, 스킬은 <code className="rounded bg-blue-100 dark:bg-blue-900/40 px-1">~/.claude/skills/gws<strong>계정명</strong>/</code></p>
          <p className="pt-1">예시: intenet1001 계정 추가 → <code className="rounded bg-blue-100 dark:bg-blue-900/40 px-1">~/.config/gws_1001</code> + <code className="rounded bg-blue-100 dark:bg-blue-900/40 px-1">~/.claude/skills/gws1001/</code></p>
        </div>
      </section>

      {/* 계정별 Steps 1–4 */}
      {newExtraAccounts.map((account, idx) => {
        const accountArrayIndex = accounts.indexOf(account)
        const isMultiple = newExtraAccounts.length > 1

        return (
          <div key={account.id} className="space-y-8">
            {isMultiple && (
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <Badge variant="secondary" className="text-xs shrink-0">
                  추가 계정 {idx + 1} / {newExtraAccounts.length}: {account.email}
                </Badge>
                <div className="h-px flex-1 bg-border" />
              </div>
            )}

            {/* Step 1 */}
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
                accountIndex={accountArrayIndex}
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

            {/* Step 2 */}
            <section className="space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                OAuth 동의화면 + 크리덴셜 (브라우저 필수)
              </h2>
              <div className="space-y-3">
                {/* Card 1: OAuth 동의화면 */}
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                      <div>
                        <span className="text-sm font-medium">OAuth 동의화면 설정</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          바로가기 클릭 시 <code className="bg-muted rounded px-1">{account.projectId ?? "프로젝트ID"}</code> 프로젝트로 자동 이동
                        </p>
                      </div>
                    </div>
                    <a href={`https://console.cloud.google.com/auth/audience?project=${account.projectId ?? "YOUR_PROJECT_ID"}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                      <ExternalLink className="size-3" />바로가기
                    </a>
                  </div>
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">1</span>
                      <div className="space-y-1.5">
                        <p className="text-sm"><strong>External</strong> 선택 → <strong>CREATE</strong> 클릭</p>
                        <div className="rounded-md bg-muted/50 border px-3 py-2 text-[11px] text-muted-foreground space-y-1">
                          <p>바로가기 → <strong>대상 탭</strong>으로 직접 이동 → External 선택 → CREATE</p>
                          <p className="text-orange-600 dark:text-orange-400">이미 External로 설정된 경우 → 하단 Test users 항목만 확인</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">2</span>
                      <span>앱 이름 + 지원 이메일 입력 → Save and Continue <span className="text-muted-foreground">(나머지 통과)</span></span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-orange-600 border-orange-300">3</span>
                      <div className="flex-1 rounded-lg border border-orange-300 bg-orange-50 dark:bg-orange-950/20 p-3 space-y-2">
                        <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                          ⚠️ 필수 — 여기서 추가 계정 등록 안 하면 인증 실패합니다
                        </p>
                        <p className="text-xs text-orange-700/80 dark:text-orange-400/80">
                          <strong>Test users</strong> → <strong>+ Add Users</strong> → 아래 이메일 추가
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs rounded bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 font-mono">{account.email}</code>
                          <CopyButton value={account.email} label="이메일" size="sm" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: OAuth 클라이언트 ID */}
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                      <div>
                        <span className="text-sm font-medium">OAuth 클라이언트 ID 생성 + 다운로드</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          바로가기 → <code className="bg-muted rounded px-1">{account.projectId ?? "프로젝트ID"}</code> 프로젝트 <strong>클라이언트 탭</strong>으로 직접 이동
                        </p>
                      </div>
                    </div>
                    <a href={`https://console.cloud.google.com/auth/clients?project=${account.projectId ?? "YOUR_PROJECT_ID"}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                      <ExternalLink className="size-3" />바로가기
                    </a>
                  </div>
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">1</span>
                      <span>+ Create Credentials → OAuth client ID</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-orange-600 border-orange-300">2</span>
                      <div className="flex-1 rounded-lg border border-orange-300 bg-orange-50 dark:bg-orange-950/20 p-3 space-y-2">
                        <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">⚠️ 애플리케이션 유형 선택 — 여기서 틀리면 인증 안 됩니다</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 rounded-md bg-green-100 dark:bg-green-900/30 border border-green-300 px-2.5 py-1 font-semibold text-green-700 dark:text-green-400">
                            ✅ 데스크톱 앱
                          </span>
                          <span className="text-muted-foreground">vs</span>
                          <span className="flex items-center gap-1 rounded-md bg-red-100 dark:bg-red-900/30 border border-red-300 px-2.5 py-1 font-semibold text-red-600 dark:text-red-400 line-through">
                            ❌ 웹 앱
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">3</span>
                      <span>만들기 → 팝업창에서 <strong>Download JSON</strong> 클릭</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground">4</span>
                      <span className="text-muted-foreground">팝업 놓쳤다면: 목록에서 생성된 클라이언트 오른쪽 <strong>↓</strong> 아이콘 클릭</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Step 3 */}
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

              {/* 파일 선택 + 검증 */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <p className="text-xs font-medium">Step 2에서 다운받은 credentials JSON 선택 (선택사항)</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="cursor-pointer flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs hover:bg-muted transition-colors">
                    <FolderOpen className="size-3.5" />
                    파인더로 파일 선택
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          const raw = ev.target?.result as string
                          try {
                            const json = JSON.parse(raw)
                            const installed = json.installed ?? json.web
                            if (!installed?.client_id) throw new Error("invalid")
                            setCredFiles(prev => ({
                              ...prev,
                              [account.id]: {
                                name: file.name,
                                projectId: installed.project_id ?? null,
                                clientId: installed.client_id ?? null,
                                clientSecret: installed.client_secret ?? null,
                                valid: true,
                                content: raw,
                              }
                            }))
                          } catch {
                            setCredFiles(prev => ({
                              ...prev,
                              [account.id]: { name: file.name, projectId: null, clientId: null, clientSecret: null, valid: false }
                            }))
                          }
                        }
                        reader.readAsText(file)
                      }}
                    />
                  </label>
                  {credFiles[account.id] && (
                    credFiles[account.id].valid ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle2 className="size-3.5" />
                        {credFiles[account.id].name}
                        {credFiles[account.id].projectId && (
                          <span className="text-muted-foreground font-normal ml-1">
                            · project: {credFiles[account.id].projectId}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="size-3.5" />
                        유효하지 않은 credentials JSON입니다
                      </span>
                    )
                  )}
                  {credFiles[account.id]?.valid && credFiles[account.id].content && (
                    <button
                      onClick={() => {
                        const blob = new Blob([credFiles[account.id].content!], { type: "application/json" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "client_secret.json"
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="flex items-center gap-1 rounded-md border border-green-400 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 text-xs text-green-700 dark:text-green-400 hover:bg-green-100 transition-colors"
                    >
                      <Download className="size-3" />
                      client_secret.json으로 저장
                    </button>
                  )}
                </div>
                {!credFiles[account.id] && (
                  <p className="text-[11px] text-muted-foreground">
                    선택하면 파일 내용이 명령어에 자동 반영됩니다. 건너뛰면 와일드카드(*)로 실행됩니다.
                  </p>
                )}
              </div>

              {/* 파일 선택 시: 개별 복사 가능 값 */}
              {credFiles[account.id]?.valid && (
                <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">gws auth setup 진행 중 요구하는 값</p>
                  {[
                    { label: "client_id", value: credFiles[account.id].clientId },
                    { label: "client_secret", value: credFiles[account.id].clientSecret },
                    { label: "project_id", value: credFiles[account.id].projectId },
                  ].filter(f => f.value).map(field => (
                    <div key={field.label} className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground w-20 shrink-0">{field.label}</span>
                      <code className="flex-1 text-[11px] font-mono bg-muted rounded px-2 py-0.5 truncate">{field.value}</code>
                      <CopyButton value={field.value!} label={field.label} size="sm" />
                    </div>
                  ))}
                </div>
              )}

              {/* 명령어 블록: 한 줄씩 분리 */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">순서대로 실행 (각각 복사 가능)</p>
                <PersonalizedCommand
                  accountIndex={accountArrayIndex}
                  template="mkdir -p {{CONFIG_DIR}}"
                  filename="① 디렉토리 생성"
                />
                {credFiles[account.id]?.valid && credFiles[account.id]?.content ? (
                  <PersonalizedCommand
                    accountIndex={accountArrayIndex}
                    template={`cat > {{CONFIG_DIR}}/client_secret.json << 'CREDENTIALS_EOF'
${credFiles[account.id].content!.trim()}
CREDENTIALS_EOF`}
                    filename="② client_secret.json 저장 (선택한 파일 내용)"
                  />
                ) : (
                  <PersonalizedCommand
                    accountIndex={accountArrayIndex}
                    template="cp ~/Downloads/client_secret_*.json {{CONFIG_DIR}}/client_secret.json"
                    filename="② client_secret.json 복사"
                  />
                )}
                <PersonalizedCommand
                  accountIndex={accountArrayIndex}
                  template="GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws auth setup --project {{PROJECT_ID}} --login"
                  filename="③ gws auth setup (한 줄로!)"
                />
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-xs">
                <p className="font-medium">실행 중 계정 선택 프롬프트가 나오면:</p>
                <Card className="bg-zinc-950">
                  <CardContent className="p-3 font-mono text-xs text-zinc-300 space-y-0.5">
                    <p className="text-zinc-500">┌ Select a Google account ──────────────┐</p>
                    <p>{"  ○ "}{defaultAccount?.email ?? "기본계정@gmail.com"}</p>
                    <p>{"  ◉ "}<span className="text-yellow-400">{account.email}</span>
                      {" "}<span className="text-green-400">← 이 계정 선택</span></p>
                    <p className="text-zinc-500">└──────────────────────────────────────┘</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Step 4 */}
            <section className="space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                인증 확인
              </h2>
              <PersonalizedCommand
                accountIndex={accountArrayIndex}
                template={`GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws auth status`}
              />
              <p className="text-xs text-muted-foreground">
                <code className="rounded bg-muted px-1">&quot;token_valid&quot;: true</code>와
                <code className="mx-1 rounded bg-muted px-1">&quot;user&quot;: &quot;{account.email}&quot;</code>이 나오면 성공입니다.
              </p>
            </section>
          </div>
        )
      })}

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
            <CodeBlock code="gws calendar +agenda" lang="bash" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-blue-500" />
              추가 계정 — 환경변수 명시
            </p>
            <PersonalizedCommand
              accountIndex="non-default"
              template={`GOOGLE_WORKSPACE_CLI_CONFIG_DIR={{CONFIG_DIR}} gws calendar +agenda`}
            />
          </div>
        </div>
      </section>

      {/* Alias setup */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">alias 등록으로 편하게 사용하기</h2>
        <p className="text-sm text-muted-foreground">
          매번 환경변수 입력이 번거로우면 <code className="rounded bg-muted px-1 text-xs">~/.zshrc</code>에 alias를 등록합니다.
          원하는 alias 이름을 직접 입력하세요.
        </p>
        {accounts.length > 0 ? (
          <div className="space-y-3">
            {/* alias 이름 입력 */}
            <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">alias 이름 설정</p>
              {accounts.map((a) => {
                const defaultSlug = a.suffix
                const alias = aliasNames[a.id] ?? defaultSlug
                return (
                  <div key={a.id} className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground w-36 truncate shrink-0">{a.email}</span>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAliasNames(prev => ({ ...prev, [a.id]: e.target.value.replace(/\s/g, "") }))}
                      className="flex-1 rounded border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder={defaultSlug}
                      spellCheck={false}
                    />
                  </div>
                )
              })}
            </div>
            {/* 생성된 alias 코드 */}
            <CodeBlock
              code={accounts.map((a) => {
                const alias = aliasNames[a.id] ?? a.suffix
                const actualDir = `~/.config/gws_${a.suffix}`
                if (a.isDefault) {
                  return [
                    `# ${a.email} — 기본 계정 (~/.config/gws → ${actualDir})`,
                    `alias ${alias}='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=${actualDir} gws'`,
                    `# 기본 계정은 환경변수 없이도 실행 가능: gws <command>`,
                  ].join("\n")
                }
                return `alias ${alias}='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=${actualDir} gws'`
              }).join("\n")}
              lang="bash"
              filename="~/.zshrc에 추가"
            />
          </div>
        ) : (
          <CodeBlock
            code={`# ~/.zshrc에 추가\nalias gws8821='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws_8821 gws'\nalias gws1002='GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws_1002 gws'`}
            lang="bash"
            filename="~/.zshrc에 추가"
          />
        )}
        <CodeBlock code="source ~/.zshrc" lang="bash" filename="적용" />
        {accounts.length > 0 && (() => {
          const a = extraAccounts[0] ?? accounts[0]
          const defaultSlug = a.suffix
          const alias = aliasNames[a.id] ?? defaultSlug
          return (
            <p className="text-xs text-muted-foreground">
              이후 입력한 alias로 바로 사용합니다. 예: <code className="rounded bg-muted px-1">{alias} gmail +triage</code>
            </p>
          )
        })()}
      </section>

      {/* Default account symlink */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">기본 계정 변경 (심볼릭 링크)</h2>
        <p className="text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1 text-xs">~/.config/gws</code>는
          심볼릭 링크로 관리합니다. 계정을 선택하거나 경로를 직접 입력하면 명령어가 자동 생성됩니다.
        </p>
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
            {/* 계정 선택 버튼 (계정이 있을 때만) */}
            {accounts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">설정된 계정에서 선택</p>
                <div className="flex flex-wrap gap-2">
                  {accounts.map((a) => {
                    const actualDir = `~/.config/gws_${a.suffix}`
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          setSelectedDefaultDir(selectedDefaultDir === actualDir ? null : actualDir)
                          setCustomDefaultDir("")
                        }}
                        className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                          selectedDefaultDir === actualDir
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        <span className="font-medium">{a.email}</span>
                        <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                          {actualDir}
                          {a.isDefault && <span className="text-green-600 ml-1">(현재 기본)</span>}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground">또는</p>
              </div>
            )}
            {/* 직접 경로 입력 */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">config 폴더 경로 직접 입력</p>
              <input
                type="text"
                value={customDefaultDir}
                onChange={(e) => {
                  setCustomDefaultDir(e.target.value)
                  if (e.target.value) setSelectedDefaultDir(null)
                }}
                placeholder="~/.config/gws_myaccount"
                className="w-full rounded border bg-background px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                spellCheck={false}
              />
            </div>
          </div>
          {/* 생성된 심볼릭 링크 명령어 */}
          {(() => {
            const targetDir = selectedDefaultDir || customDefaultDir.trim() || null
            return targetDir ? (
              <CodeBlock
                code={`# 기존 심볼릭 링크 제거\nrm ~/.config/gws\n\n# 새 계정을 기본으로 설정\nln -s ${targetDir} ~/.config/gws\n\n# 확인\ngws auth status`}
                lang="bash"
                filename="기본 계정 전환"
              />
            ) : (
              <p className="text-xs text-muted-foreground">계정을 선택하거나 경로를 입력하면 명령어가 나타납니다.</p>
            )
          })()}
        </div>
      </section>

      {/* Claude Code skill section */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Claude Code에서 계정별 스킬 만들기</h2>

        {/* 동작 원리 */}
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3 space-y-1.5 text-xs">
          <p className="font-medium text-blue-700 dark:text-blue-400">어떻게 동작하나요?</p>
          <p className="text-blue-700/80 dark:text-blue-400/80">
            Claude Code에서{" "}
            <code className="rounded bg-blue-100 dark:bg-blue-900/40 px-1">/gwsintenet8821</code> 같은 슬래시 명령어를 입력하면
            스킬 파일이 로드되어, 이후 모든 gws 명령에{" "}
            <code className="rounded bg-blue-100 dark:bg-blue-900/40 px-1">GOOGLE_WORKSPACE_CLI_CONFIG_DIR</code>
            {" "}환경변수가 자동 주입됩니다.
            터미널 alias와 같은 효과를 Claude Code 대화 안에서 사용할 수 있습니다.
          </p>
        </div>

        {/* 내 계정 기준 — 통합 생성 */}
        {accounts.length > 0 ? (
          <div className="space-y-3">
            {/* 방법 1: 터미널 통합 스크립트 */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">방법 1 — 터미널에서 한 번에 실행</p>
              <CodeBlock
                code={accounts.map((a) => {
                  const dir = `~/.config/gws_${a.suffix}`
                  return `mkdir -p ~/.claude/skills/gws${a.suffix} && cat > ~/.claude/skills/gws${a.suffix}/SKILL.md << 'EOF'\n---\nname: gws${a.suffix}\nversion: 1.0.0\ndescription: "GWS CLI for ${a.email}. GOOGLE_WORKSPACE_CLI_CONFIG_DIR=${dir}."\n---\n# gws${a.suffix} — ${a.email}\n모든 gws 명령 앞에 GOOGLE_WORKSPACE_CLI_CONFIG_DIR=${dir}를 붙인다.\nEOF`
                }).join("\n\n")}
                lang="bash"
                filename="모든 gws 스킬 한 번에 생성"
              />
            </div>

            {/* 방법 2: Claude Code 통합 프롬프트 */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">방법 2 — Claude Code에 붙여넣기 (한 번에)</p>
              {(() => {
                const lines = accounts.map((a, i) =>
                  `${i + 1}. ~/.claude/skills/gws${a.suffix}/SKILL.md — ${a.email} (config: ~/.config/gws_${a.suffix})`
                ).join("\n")
                const prompt = `아래 gws 스킬 파일들을 한 번에 만들어줘:\n\n${lines}\n\n각 파일: name=gws[suffix], version 1.0.0, 모든 gws 명령에 GOOGLE_WORKSPACE_CLI_CONFIG_DIR=~/.config/gws_[suffix] 환경변수 자동 주입. 생성 후 /clear 안내.`
                return (
                  <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">복사 → Claude Code에 붙여넣기</span>
                      <CopyButton value={prompt} label="통합 프롬프트" size="sm" />
                    </div>
                    <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed">{prompt}</pre>
                  </div>
                )
              })()}
            </div>

            <Alert>
              <Info className="size-4" />
              <AlertDescription className="text-xs">
                생성 후 <strong>/clear</strong> → <code className="rounded bg-muted px-1">/gws{accounts[0].suffix}</code> 입력하면 스킬이 활성화됩니다.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground rounded-lg border bg-muted/20 p-3">
            상단에서 계정을 먼저 등록하면 여기에 맞춤 생성 명령어가 나타납니다.
          </p>
        )}
      </section>
    </article>
  )
}
