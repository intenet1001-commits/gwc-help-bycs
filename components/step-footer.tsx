import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepFooterProps {
  prev?: { href: string; label: string }
  next?: { href: string; label: string }
}

export function StepFooter({ prev, next }: StepFooterProps) {
  return (
    <div className="mt-12 flex items-center justify-between border-t pt-6">
      {prev ? (
        <Button variant="outline" asChild>
          <Link href={prev.href} className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            {prev.label}
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {next && (
        <Button asChild>
          <Link href={next.href} className="flex items-center gap-2">
            {next.label}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
