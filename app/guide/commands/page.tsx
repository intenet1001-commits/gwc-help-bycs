import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "@/components/code-block"
import { StepFooter } from "@/components/step-footer"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "5. 주요 명령어 | gws 설치 가이드",
}

const commandGroups = [
  {
    name: "Calendar (일정)",
    icon: "📅",
    commands: [
      { cmd: "gws calendar +agenda", desc: "다가오는 일정 요약 (헬퍼)" },
      { cmd: "gws calendar calendarList list", desc: "내 캘린더 목록 조회" },
      { cmd: `gws calendar events list --params '{"calendarId": "primary"}'`, desc: "기본 캘린더 이벤트 목록" },
      { cmd: `gws calendar events get --params '{"calendarId": "primary", "eventId": "EVENT_ID"}'`, desc: "특정 이벤트 상세 조회" },
    ],
  },
  {
    name: "Drive (파일)",
    icon: "📁",
    commands: [
      { cmd: "gws drive files list", desc: "내 드라이브 파일 목록" },
      { cmd: `gws drive files list --params '{"q": "name contains \\'보고서\\'"}'`, desc: "이름으로 파일 검색" },
      { cmd: `gws drive files get --params '{"fileId": "FILE_ID"}'`, desc: "파일 메타데이터 조회" },
    ],
  },
  {
    name: "Gmail (이메일)",
    icon: "✉️",
    commands: [
      { cmd: "gws gmail +triage", desc: "안읽은 메일 요약 (헬퍼)" },
      { cmd: `gws gmail users messages list --params '{"userId": "me", "maxResults": 10}'`, desc: "받은 편지함 메시지 목록" },
      { cmd: `gws gmail users messages get --params '{"userId": "me", "id": "MSG_ID"}'`, desc: "특정 메일 내용 조회" },
      { cmd: `gws gmail +send --to="user@example.com" --subject="안녕" --body="내용"`, desc: "이메일 전송 (헬퍼)" },
    ],
  },
  {
    name: "Sheets (스프레드시트)",
    icon: "📊",
    commands: [
      { cmd: `gws sheets +read --id=SHEET_ID --range="Sheet1!A1:Z100"`, desc: "셀 값 읽기 (헬퍼)" },
      { cmd: `gws sheets +append --id=SHEET_ID --range="Sheet1" --values='["값1","값2"]'`, desc: "행 추가 (헬퍼)" },
      { cmd: `gws sheets spreadsheets get --params '{"spreadsheetId": "SHEET_ID"}'`, desc: "스프레드시트 정보 조회" },
    ],
  },
  {
    name: "Docs (문서)",
    icon: "📝",
    commands: [
      { cmd: `gws docs documents get --params '{"documentId": "DOC_ID"}'`, desc: "문서 내용 조회" },
      { cmd: `gws docs documents create --json '{"title": "새 문서"}'`, desc: "새 문서 만들기" },
    ],
  },
  {
    name: "Tasks (할 일)",
    icon: "✅",
    commands: [
      { cmd: "gws tasks tasklists list", desc: "할 일 목록 조회" },
      { cmd: `gws tasks tasks list --params '{"tasklist": "TASKLIST_ID"}'`, desc: "특정 목록의 할 일 항목" },
    ],
  },
]

export default function CommandsPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <Badge variant="secondary">STEP 5 / 5</Badge>
        <h1 className="text-2xl font-bold">주요 명령어 가이드</h1>
        <p className="text-muted-foreground text-sm">
          gws v0.22.5의 주요 명령어 모음입니다. 각 명령어는 클립보드로 복사할 수 있습니다.
        </p>
      </header>

      {/* Help command */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">도움말 보기</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">전체 명령어 목록</p>
            <CodeBlock code="gws --help" lang="bash" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">특정 명령어 도움말</p>
            <CodeBlock code="gws calendar --help" lang="bash" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Command groups */}
      <div className="space-y-8">
        {commandGroups.map((group) => (
          <section key={group.name} className="space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <span>{group.icon}</span>
              {group.name}
            </h2>
            <div className="space-y-3">
              {group.commands.map((item, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="py-2 px-4 bg-muted/30">
                    <CardTitle className="text-xs text-muted-foreground font-normal">{item.desc}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CodeBlock code={item.cmd} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Separator />

      {/* Output format tip */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">출력 형식 변경</h2>
        <p className="text-sm text-muted-foreground">
          대부분의 명령어는 <code className="rounded bg-muted px-1 text-xs">--format</code> 옵션으로 출력 형식을 바꿀 수 있습니다:
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { flag: "--format=json", desc: "JSON 형식" },
            { flag: "--format=yaml", desc: "YAML 형식" },
            { flag: "--format=csv", desc: "CSV 형식 (일부 지원)" },
          ].map((item) => (
            <div key={item.flag} className="space-y-1">
              <p className="text-xs text-muted-foreground">{item.desc}</p>
              <CodeBlock code={`gws calendar calendarList list ${item.flag}`} lang="bash" />
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-4 text-sm text-green-700 dark:text-green-400 space-y-1">
        <p className="font-semibold">🎉 모든 설정이 완료되었습니다!</p>
        <p>이제 터미널에서 Google Workspace를 자유롭게 사용할 수 있습니다.</p>
      </div>

      <StepFooter
        prev={{ href: "/guide/auth-setup", label: "4. 인증 설정" }}
      />
    </article>
  )
}
