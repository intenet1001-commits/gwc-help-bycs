"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck, UploadCloud } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const FIELD_DESCRIPTIONS: Record<string, string> = {
  client_id: "OAuth 클라이언트 고유 ID. 앱을 식별하는 데 사용됩니다.",
  client_secret: "OAuth 클라이언트 비밀 키. 절대 외부에 노출하지 마세요.",
  project_id: "Google Cloud 프로젝트 ID. gws auth setup --project 에 사용됩니다.",
  auth_uri: "Google OAuth 인증 엔드포인트 URL.",
  token_uri: "액세스 토큰 발급 엔드포인트 URL.",
  auth_provider_x509_cert_url: "Google 인증 공급자의 공개 인증서 URL.",
  redirect_uris: "OAuth 인증 후 리디렉션될 URI 목록.",
  javascript_origins: "JavaScript에서 요청 가능한 허용 출처 목록.",
}

const SENSITIVE_FIELDS = ["client_secret"]

type ParsedCreds = Record<string, string | string[]>

function parseCredentials(raw: string): { data: ParsedCreds; type: string } | { error: string } {
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { error: "JSON 형식이 올바르지 않습니다. credentials.json 파일 내용을 그대로 붙여넣어 주세요." }
  }

  // Detect wrapper key: "installed" (Desktop app) or "web" (Web app)
  let credObj: Record<string, unknown>
  let type: string

  if (parsed.installed && typeof parsed.installed === "object") {
    credObj = parsed.installed as Record<string, unknown>
    type = "Desktop 앱 (installed)"
  } else if (parsed.web && typeof parsed.web === "object") {
    credObj = parsed.web as Record<string, unknown>
    type = "웹 앱 (web)"
  } else if (parsed.client_id) {
    // Already flattened
    credObj = parsed
    type = "직접 형식"
  } else {
    return { error: "인식할 수 없는 credentials 형식입니다. 'installed' 또는 'web' 타입의 OAuth 2.0 크리덴셜을 붙여넣어 주세요." }
  }

  const data: ParsedCreds = {}
  for (const [key, value] of Object.entries(credObj)) {
    if (Array.isArray(value)) {
      data[key] = value.map((v) => String(v))
    } else {
      data[key] = String(value)
    }
  }

  return { data, type }
}

export function CredentialsParser() {
  const [raw, setRaw] = useState("")
  const [result, setResult] = useState<{ data: ParsedCreds; type: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set(["client_secret"]))
  const [isDragging, setIsDragging] = useState(false)

  const handleParse = () => {
    const trimmed = raw.trim()
    if (!trimmed) {
      setError("credentials.json 내용을 붙여넣어 주세요.")
      setResult(null)
      return
    }
    const parsed = parseCredentials(trimmed)
    if ("error" in parsed) {
      setError(parsed.error)
      setResult(null)
    } else {
      setError(null)
      setResult(parsed)
    }
  }

  const handleClear = () => {
    setRaw("")
    setResult(null)
    setError(null)
  }

  const loadFile = useCallback((file: File) => {
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      toast.error("JSON 파일만 지원합니다.")
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setRaw(text)
      setError(null)
      setResult(null)
      // Auto-parse
      const parsed = parseCredentials(text.trim())
      if ("error" in parsed) {
        setError(parsed.error)
      } else {
        setResult(parsed)
        toast.success(`${file.name} 파싱 완료!`)
      }
    }
    reader.readAsText(file)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
  }

  const toggleHide = (field: string) => {
    setHiddenFields((prev) => {
      const next = new Set(prev)
      if (next.has(field)) {
        next.delete(field)
      } else {
        next.add(field)
      }
      return next
    })
  }

  const handleCopyAllAsEnv = () => {
    if (!result) return
    const lines = Object.entries(result.data)
      .filter(([, v]) => !Array.isArray(v))
      .map(([k, v]) => `${k.toUpperCase()}=${v}`)
      .join("\n")
    navigator.clipboard.writeText(lines).then(() => {
      toast.success(".env 형식으로 복사되었습니다!")
    })
  }

  const displayValue = (field: string, value: string | string[]) => {
    if (Array.isArray(value)) return value.join(", ")
    if (hiddenFields.has(field)) return "•".repeat(Math.min(value.length, 32))
    return value
  }

  return (
    <div className="space-y-6">
      {/* Privacy notice */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <ShieldCheck className="size-4 text-green-600" />
        <AlertTitle className="text-green-700 dark:text-green-400">100% 클라이언트 사이드 처리</AlertTitle>
        <AlertDescription className="text-green-600 dark:text-green-500 text-sm">
          붙여넣은 JSON은 브라우저에서만 처리됩니다. 서버로 전송되거나 저장되지 않습니다.
          네트워크 탭에서 직접 확인하실 수 있습니다.
        </AlertDescription>
      </Alert>

      {/* Input area */}
      <Card
        className={cn("transition-colors relative", isDragging && "border-primary border-2 bg-primary/5")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-primary/10 pointer-events-none">
            <UploadCloud className="size-10 text-primary mb-2 animate-bounce" />
            <span className="text-sm font-semibold text-primary">여기에 놓으세요</span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>credentials.json 붙여넣기 또는 드래그</span>
            <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
              <UploadCloud className="size-3.5" />
              파일을 여기에 드래그
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder={`Google Cloud Console에서 다운받은 credentials.json 파일 내용을 여기에 붙여넣으세요.\n또는 파일을 이 영역에 드래그하세요.\n\n예시:\n{\n  "installed": {\n    "client_id": "123456789-abc.apps.googleusercontent.com",\n    "client_secret": "GOCSPX-...",\n    ...\n  }\n}`}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="min-h-[180px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={handleParse} disabled={!raw.trim()}>
              파싱하기
            </Button>
            {(result || error) && (
              <Button variant="outline" onClick={handleClear}>
                초기화
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>파싱 오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">파싱 결과</h3>
              <Badge variant="secondary">{result.type}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyAllAsEnv}>
              .env 형식으로 전체 복사
            </Button>
          </div>

          <div className="space-y-2">
            {Object.entries(result.data).map(([key, value]) => {
              const isSensitive = SENSITIVE_FIELDS.includes(key)
              const isHidden = hiddenFields.has(key)
              const displayVal = displayValue(key, value)
              const copyVal = Array.isArray(value) ? value.join(", ") : value

              return (
                <Card key={key} className={cn("overflow-hidden", isSensitive && "border-orange-200 dark:border-orange-900")}>
                  <CardContent className="p-0">
                    <div className="flex items-start gap-3 p-3">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-foreground">{key}</span>
                          {isSensitive && (
                            <Badge variant="outline" className="border-orange-300 text-orange-600 text-[10px] px-1.5">
                              <Lock className="size-2.5 mr-1" />
                              민감 정보
                            </Badge>
                          )}
                        </div>
                        {FIELD_DESCRIPTIONS[key] && (
                          <p className="text-xs text-muted-foreground">{FIELD_DESCRIPTIONS[key]}</p>
                        )}
                        <div className="mt-1.5 rounded-md bg-muted px-2.5 py-2">
                          <span className="font-mono text-xs break-all select-all">
                            {displayVal}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 pt-0.5">
                        {isSensitive && (
                          <button
                            onClick={() => toggleHide(key)}
                            className="inline-flex size-7 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            title={isHidden ? "값 보기" : "값 숨기기"}
                          >
                            {isHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                          </button>
                        )}
                        <CopyButton value={copyVal} label={key} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {result.data.project_id && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
                <strong>다음 단계:</strong> 아래 명령어를 터미널에 붙여넣어 실행하세요.
                <div className="mt-2 rounded-md bg-blue-950 p-2 font-mono text-xs text-blue-100">
                  gws auth setup --project {Array.isArray(result.data.project_id) ? result.data.project_id[0] : result.data.project_id} --login
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
