import { CredentialsParser } from "@/components/credentials-parser"
import { Badge } from "@/components/ui/badge"
import { Wrench } from "lucide-react"

export const metadata = {
  title: "credentials.json 파서 | gws 설치 가이드",
  description: "Google OAuth credentials.json 파일을 붙여넣어 각 필드를 개별 복사할 수 있는 도구",
}

export default function CredentialsParserPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Wrench className="size-5" />
          <h1 className="text-2xl font-bold">credentials.json 파서</h1>
          <Badge variant="secondary">도구</Badge>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Google Cloud Console에서 다운받은 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">credentials.json</code> 파일을
          붙여넣으면 각 키-값 쌍을 개별적으로 복사할 수 있습니다.
          Desktop 앱(installed) 및 웹 앱(web) 형식 모두 지원합니다.
        </p>
      </div>

      <CredentialsParser />
    </div>
  )
}
