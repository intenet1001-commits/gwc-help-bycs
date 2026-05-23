"use client"

import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StepFooter } from "@/components/step-footer"
import { ScreenshotPlaceholder } from "@/components/screenshot-placeholder"
import { useAccounts } from "@/lib/accounts-context"
import {
  Info,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  MousePointerClick,
  ChevronRight,
} from "lucide-react"

// ── 재사용 UI 컴포넌트 ────────────────────────────────────────────────────────

function ClickHere({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
      <MousePointerClick className="size-4 shrink-0" />
      {children}
    </div>
  )
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-orange-300 bg-orange-50 px-3 py-2.5 text-xs text-orange-800 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300">
      <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

function Success({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-green-300 bg-green-50 px-3 py-2.5 text-xs text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
      <CheckCircle2 className="size-3.5 mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  )
}

function StepNum({ n, label, time }: { n: number; label: string; time?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
        {n}
      </span>
      <h2 className="text-lg font-semibold">{label}</h2>
      {time && <Badge variant="outline" className="ml-auto text-xs">{time}</Badge>}
    </div>
  )
}

function MiniStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
        {n}
      </span>
      <div className="flex-1 min-w-0 space-y-2">{children}</div>
    </div>
  )
}

function OpenBtn({ href, label }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
    >
      <ExternalLink className="size-3" />
      {label ?? "바로가기"}
    </a>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
export default function ConsoleSetupPage() {
  const { defaultAccount } = useAccounts()
  const projectId = defaultAccount?.projectId || "my-gws-project"

  return (
    <article className="space-y-10">

      {/* ── 헤더 ──────────────────────────────────────────────────────── */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">콘솔 가이드</Badge>
          <Badge variant="outline" className="text-orange-600 border-orange-300">브라우저 전용</Badge>
          <Badge className="bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400">왕초보용</Badge>
        </div>
        <h1 className="text-2xl font-bold">GCP 콘솔 완전 초보 가이드</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          터미널·CLI 없이 <strong>브라우저만</strong>으로 GCP 프로젝트 생성부터
          OAuth 크리덴셜 다운로드까지 완료할 수 있습니다.
          각 단계마다 <span className="text-red-600 font-medium">빨간 원</span>으로
          클릭 위치를 표시했습니다.
        </p>
      </header>

      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <Info className="size-4 text-blue-600" />
        <AlertDescription className="text-xs text-blue-700 dark:text-blue-400">
          터미널이 익숙하다면{" "}
          <Link href="/guide/gcp-project" className="underline font-medium">CLI 가이드</Link>
          가 더 빠릅니다. CLI가 어렵다면 이 페이지를 따라하세요.
        </AlertDescription>
      </Alert>

      {/* ── 전체 흐름 요약 ─────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-muted/40 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">전체 흐름 (약 20분)</p>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            "① 프로젝트 생성",
            "② API 활성화",
            "③ OAuth 동의 화면",
            "④ 인증 정보 만들기",
            "⑤ 데스크톱 앱 선택",
            "⑥ JSON 다운로드",
          ].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-1">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{step}</span>
              {i < arr.length - 1 && <ChevronRight className="size-3 text-muted-foreground" />}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 1: 프로젝트 생성
      ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <StepNum n={1} label="GCP 프로젝트 만들기" time="3분" />

        <Card>
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-muted-foreground">아래 버튼을 눌러 GCP 프로젝트 생성 페이지를 엽니다.</p>
              <OpenBtn href="https://console.cloud.google.com/projectcreate" label="프로젝트 생성 페이지 열기" />
            </div>

            <ScreenshotPlaceholder
              src="/screenshots/01-project-create.png"
              alt="GCP 프로젝트 생성 페이지"
              caption="이런 화면이 나타납니다"
              priority
            />

            <div className="space-y-5">
              <MiniStep n={1}>
                <p className="text-sm font-medium">프로젝트 이름 입력칸을 클릭합니다</p>
                <ClickHere>빨간 원 표시된 입력칸을 클릭하세요</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/01b-name-highlight.png"
                  alt="프로젝트 이름 입력 필드 강조"
                  caption="여기를 클릭하세요 (빨간 원 위치)"
                />
              </MiniStep>

              <MiniStep n={2}>
                <p className="text-sm font-medium">
                  프로젝트 이름을 입력합니다 &mdash;{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">GWS CLI</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  입력하면 <strong>프로젝트 ID</strong>가 아래에 자동 생성됩니다. 그대로 두세요.
                </p>
                <ScreenshotPlaceholder
                  src="/screenshots/01c-name-filled.png"
                  alt="프로젝트 이름 입력 후 ID 자동 생성"
                  caption="이름 입력 후 — 프로젝트 ID가 자동으로 만들어집니다"
                />
              </MiniStep>

              <MiniStep n={3}>
                <p className="text-sm font-medium">파란 <strong>만들기</strong> 버튼을 클릭합니다</p>
                <ClickHere>파란 "만들기" 버튼 클릭</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/01d-create-button.png"
                  alt="만들기 버튼"
                  caption="이 버튼을 클릭하세요 (파란 원)"
                />
              </MiniStep>
            </div>

            <Success>
              약 30초 기다리면 대시보드로 이동합니다. 상단에 방금 만든 프로젝트 이름이 보이면 성공!
            </Success>
            <ScreenshotPlaceholder
              src="/screenshots/01e-project-done.png"
              alt="프로젝트 생성 완료 대시보드"
              caption="이런 화면이 보이면 프로젝트 생성 완료"
            />
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2: API 활성화
      ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <StepNum n={2} label="필요한 API 6개 활성화하기" time="8분" />

        <Card>
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-muted-foreground">API 라이브러리 페이지를 엽니다.</p>
              <OpenBtn
                href={`https://console.cloud.google.com/apis/library?project=${projectId}`}
                label="API 라이브러리 열기"
              />
            </div>

            <ScreenshotPlaceholder
              src="/screenshots/02-api-library.png"
              alt="API 라이브러리 메인 화면"
              caption="API 라이브러리 — 여기서 검색해서 하나씩 활성화합니다"
            />

            <div className="space-y-5">
              <MiniStep n={1}>
                <p className="text-sm font-medium">검색창에 API 이름을 입력합니다</p>
                <ClickHere>검색창 클릭 후 "Gmail API" 입력</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/02b-search-highlight.png"
                  alt="API 검색창 위치"
                  caption="검색창 위치 (빨간 원) — 클릭 후 입력"
                />
                <ScreenshotPlaceholder
                  src="/screenshots/02c-search-gmail.png"
                  alt="Gmail API 검색 결과"
                  caption='"Gmail API" 검색 결과 — 첫 번째 항목을 클릭하세요'
                />
              </MiniStep>

              <MiniStep n={2}>
                <p className="text-sm font-medium">API 상세 페이지에서 파란 <strong>사용</strong> 버튼을 클릭합니다</p>
                <ClickHere>파란 "사용" 버튼 클릭</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/02d-gmail-enable-btn.png"
                  alt="Gmail API 사용 버튼"
                  caption='"사용" 버튼 (빨간 원) — 클릭하면 API가 활성화됩니다'
                />
                <Success>"사용 설정됨"으로 바뀌면 이 API 완료!</Success>
              </MiniStep>

              <MiniStep n={3}>
                <p className="text-sm font-medium">
                  나머지 5개 API도 <strong>같은 방법</strong>으로 검색 → 사용 클릭합니다
                </p>
                <div className="rounded-lg border divide-y text-sm overflow-hidden">
                  {[
                    { name: "Gmail API",            desc: "이메일 읽기/쓰기",      done: true },
                    { name: "Google Drive API",      desc: "드라이브 파일 관리" },
                    { name: "Google Calendar API",   desc: "캘린더 일정 관리" },
                    { name: "Google Sheets API",     desc: "스프레드시트 편집" },
                    { name: "Google Docs API",        desc: "문서 편집" },
                    { name: "Tasks API",              desc: "할일 목록 관리" },
                  ].map((api) => (
                    <div key={api.name} className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium">{api.name}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">— {api.desc}</span>
                      </div>
                      {api.done
                        ? <Badge className="text-xs shrink-0 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">위에서 완료</Badge>
                        : <Badge variant="outline" className="text-xs shrink-0">검색 → 사용 클릭</Badge>
                      }
                    </div>
                  ))}
                </div>
              </MiniStep>
            </div>

            <Success>
              6개 API 모두 "사용 설정됨" 상태가 되면 Step 2 완료!
            </Success>
            <ScreenshotPlaceholder
              src="/screenshots/02e-api-enabled.png"
              alt="API 활성화 완료 대시보드"
              caption="API 대시보드 — 활성화된 API 목록에서 확인 가능"
            />
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3: OAuth 동의 화면
      ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <StepNum n={3} label="OAuth 동의 화면 설정하기" time="5분" />

        <Alert>
          <Info className="size-4" />
          <AlertDescription className="text-xs">
            앱이 Google 계정 데이터에 접근할 때 사용자에게 보여주는 동의 화면을 설정합니다.
            개인 Google 계정은 <strong>External(외부)</strong>을 선택해야 합니다.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-muted-foreground">OAuth 동의 화면 페이지를 엽니다.</p>
              <OpenBtn
                href={`https://console.cloud.google.com/auth/audience?project=${projectId}`}
                label="동의 화면 설정 열기"
              />
            </div>

            <ScreenshotPlaceholder
              src="/screenshots/03-oauth-audience.png"
              alt="OAuth 동의 화면 User Type 선택"
              caption="User Type 선택 화면 — External을 선택해야 합니다"
            />

            <div className="space-y-5">
              <MiniStep n={1}>
                <p className="text-sm font-medium">
                  <strong className="text-red-600">External</strong> (외부) 를 선택합니다
                </p>
                <Warn>
                  Internal은 Google Workspace 기업 계정 전용입니다.
                  개인 Gmail 계정은 반드시 <strong>External</strong> 선택!
                </Warn>
                <ClickHere>"External" 라디오 버튼 클릭</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/03b-external-highlight.png"
                  alt="External 선택 강조"
                  caption='"External" 클릭 (빨간 원)'
                />
              </MiniStep>

              <MiniStep n={2}>
                <p className="text-sm font-medium">파란 <strong>만들기</strong> 버튼을 클릭합니다</p>
                <ClickHere>"만들기" 버튼 클릭</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/03c-consent-create-btn.png"
                  alt="만들기 버튼 강조"
                  caption='"만들기" 클릭 후 앱 정보 입력 화면으로 이동'
                />
              </MiniStep>

              <MiniStep n={3}>
                <p className="text-sm font-medium">앱 정보를 입력합니다</p>
                <ScreenshotPlaceholder
                  src="/screenshots/03d-app-info-form.png"
                  alt="앱 정보 입력 폼"
                  caption="앱 정보 입력 화면"
                />
                <div className="rounded-lg border divide-y text-xs overflow-hidden">
                  <div className="grid grid-cols-[140px_1fr] gap-2 px-3 py-2 bg-muted/40 font-semibold text-muted-foreground">
                    <span>입력 항목</span><span>입력값</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 px-3 py-2 items-center">
                    <span className="font-medium">앱 이름 ①</span>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono">gws-cli</code>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 px-3 py-2 items-center">
                    <span className="font-medium">사용자 지원 이메일 ②</span>
                    <span className="text-muted-foreground">드롭다운에서 내 이메일 선택</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 px-3 py-2 items-center">
                    <span className="font-medium">개발자 연락처 ③</span>
                    <span className="text-muted-foreground">내 이메일 직접 입력</span>
                  </div>
                </div>
                <ScreenshotPlaceholder
                  src="/screenshots/03e-appname-highlight.png"
                  alt="앱 이름 입력 필드 강조"
                  caption="앱 이름 입력 필드 (빨간 원 ①번)"
                />
              </MiniStep>

              <MiniStep n={4}>
                <p className="text-sm font-medium">
                  <strong>저장 후 계속</strong> 버튼을 3번 클릭해서 마지막 단계까지 넘어갑니다
                </p>
                <p className="text-xs text-muted-foreground">
                  범위(Scopes) 페이지와 요약 페이지는 추가 입력 없이 바로 넘어가면 됩니다.
                </p>
              </MiniStep>

              <MiniStep n={5}>
                <p className="text-sm font-medium">
                  테스트 사용자 단계에서 <strong>내 이메일</strong>을 추가합니다
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>+ ADD USERS</strong>를 클릭한 뒤 본인 Gmail 주소를 입력하고 저장하세요.
                  이렇게 해야 로그인 시 "앱이 확인되지 않음" 경고를 무시하고 진행할 수 있습니다.
                </p>
              </MiniStep>
            </div>

            <Success>
              마지막 요약 화면에서 "대시보드로 돌아가기"를 클릭하면 Step 3 완료!
            </Success>
            <ScreenshotPlaceholder
              src="/screenshots/03f-test-users-done.png"
              alt="OAuth 동의 화면 완료 상태"
              caption="동의 화면 설정 완료"
            />
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 4: 사용자 인증 정보 만들기
      ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <StepNum n={4} label="OAuth 클라이언트 ID 만들기" time="2분" />

        <Card>
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-muted-foreground">사용자 인증 정보 페이지를 엽니다.</p>
              <OpenBtn
                href={`https://console.cloud.google.com/auth/clients?project=${projectId}`}
                label="인증 정보 페이지 열기"
              />
            </div>

            <ScreenshotPlaceholder
              src="/screenshots/04-credentials.png"
              alt="사용자 인증 정보 페이지"
              caption="사용자 인증 정보 페이지"
            />

            <div className="space-y-5">
              <MiniStep n={1}>
                <p className="text-sm font-medium">
                  상단의 <strong>+ 사용자 인증 정보 만들기</strong> 버튼을 클릭합니다
                </p>
                <ClickHere>"+ 사용자 인증 정보 만들기" 클릭</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/04b-create-btn-highlight.png"
                  alt="사용자 인증 정보 만들기 버튼 강조"
                  caption="이 버튼을 클릭하세요 (빨간 원)"
                />
              </MiniStep>

              <MiniStep n={2}>
                <p className="text-sm font-medium">
                  드롭다운에서 <strong>OAuth 클라이언트 ID</strong>를 선택합니다
                </p>
                <ClickHere>"OAuth 클라이언트 ID" 선택</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/04c-oauth-menu-highlight.png"
                  alt="OAuth 클라이언트 ID 메뉴 항목 강조"
                  caption="드롭다운에서 이 항목 클릭 (빨간 원)"
                />
              </MiniStep>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 5: 데스크톱 앱 선택 (핵심!)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <StepNum n={5} label="애플리케이션 유형 — 데스크톱 앱 선택" time="1분" />

        <Warn>
          가장 중요한 단계입니다.
          <strong> "웹 애플리케이션"이 아니라 "데스크톱 앱"</strong>을 선택해야 합니다.
          잘못 선택하면 gws가 작동하지 않습니다.
        </Warn>

        <Card>
          <CardContent className="p-5 space-y-5">
            <ScreenshotPlaceholder
              src="/screenshots/05-client-type-form.png"
              alt="애플리케이션 유형 선택 폼 전체"
              caption="애플리케이션 유형 선택 화면"
            />

            <div className="space-y-5">
              <MiniStep n={1}>
                <p className="text-sm font-medium">
                  애플리케이션 유형에서{" "}
                  <span className="font-bold text-red-600 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded">
                    데스크톱 앱
                  </span>
                  을 선택합니다
                </p>
                <ClickHere>반드시 "데스크톱 앱" 선택 — 이게 핵심!</ClickHere>
                <ScreenshotPlaceholder
                  src="/screenshots/05b-desktop-app-highlight.png"
                  alt="데스크톱 앱 선택 강조"
                  caption='"데스크톱 앱" — 반드시 여기를 선택 (빨간 원)'
                />
              </MiniStep>

              <MiniStep n={2}>
                <p className="text-sm font-medium">이름을 입력하고 만들기를 클릭합니다</p>
                <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
                  <span className="font-semibold">이름: </span>
                  <code className="rounded bg-muted px-1 font-mono">gws-desktop</code>
                  <span className="text-muted-foreground ml-2">(아무 이름이나 괜찮습니다)</span>
                </div>
              </MiniStep>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 6: JSON 다운로드
      ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-5">
        <StepNum n={6} label="credentials.json 파일 다운로드" time="30초" />

        <Card>
          <CardContent className="p-5 space-y-5">
            <p className="text-sm text-muted-foreground">
              만들기를 클릭하면 팝업이 나타납니다. 여기서 JSON 파일을 다운로드합니다.
            </p>

            <ScreenshotPlaceholder
              src="/screenshots/06-download-popup.png"
              alt="OAuth 클라이언트 생성 완료 팝업"
              caption="생성 완료 팝업 — JSON 다운로드 버튼이 보입니다"
            />

            <MiniStep n={1}>
              <p className="text-sm font-medium">
                팝업에서 <strong>JSON 다운로드</strong> 버튼을 클릭합니다
              </p>
              <ClickHere>"JSON 다운로드" 버튼 클릭</ClickHere>
              <ScreenshotPlaceholder
                src="/screenshots/06b-download-btn-highlight.png"
                alt="JSON 다운로드 버튼 강조"
                caption="이 버튼을 클릭하세요 (빨간 원)"
              />
            </MiniStep>

            <Success>
              <span>
                다운로드 폴더에{" "}
                <code className="bg-green-100 dark:bg-green-900 px-1 rounded font-mono text-xs">
                  client_secret_XXXX.json
                </code>{" "}
                파일이 저장됩니다.
                파일명이 너무 길면{" "}
                <code className="bg-green-100 dark:bg-green-900 px-1 rounded font-mono text-xs">
                  credentials.json
                </code>
                으로 바꿔도 됩니다.
              </span>
            </Success>

            <Warn>
              팝업을 닫아버렸다면? 인증 정보 목록에서 방금 만든 항목 오른쪽의
              다운로드 아이콘(↓)을 클릭하면 다시 받을 수 있습니다.
            </Warn>
          </CardContent>
        </Card>
      </section>

      {/* ── 완료 체크리스트 ──────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-muted/40 p-6 space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-500" />
          완료 체크리스트
        </h2>
        <ul className="space-y-2.5 text-sm">
          {[
            "GCP 프로젝트 생성됨 (상단에 프로젝트 이름 표시됨)",
            "API 6개 모두 활성화됨 (Gmail, Drive, Calendar, Sheets, Docs, Tasks)",
            "OAuth 동의 화면 — External 설정 + 테스트 사용자에 내 이메일 추가",
            "OAuth 클라이언트 ID — 데스크톱 앱 유형으로 생성",
            "credentials.json 파일 다운로드 완료",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 shrink-0" readOnly />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 다음 단계 ──────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 p-5 space-y-3">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold text-sm">
          <CheckCircle2 className="size-5" />
          GCP 설정 완료! 이제 gws 인증을 설정합니다.
        </div>
        <p className="text-xs text-green-700 dark:text-green-500">
          터미널에서 아래 명령어를 실행하세요. credentials.json 파일 경로를 지정합니다.
        </p>
        <pre className="rounded-lg bg-green-900/10 dark:bg-green-950/50 p-3 text-xs font-mono text-green-800 dark:text-green-300 overflow-x-auto whitespace-pre-wrap">
{`gws auth setup --project ${projectId} --credentials ~/Downloads/credentials.json --login`}
        </pre>
        <p className="text-xs text-green-600 dark:text-green-500">
          명령어 실행 후 브라우저가 열리면 Google 로그인 → <strong>허용</strong> 클릭
        </p>
      </section>

      <StepFooter
        prev={{ href: "/guide/install", label: "1. gws CLI 설치" }}
        next={{ href: "/guide/auth-setup", label: "4. 인증 설정" }}
      />
    </article>
  )
}
