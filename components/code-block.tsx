"use client"

import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
  className?: string
}

export function CodeBlock({ code, lang, filename, className }: CodeBlockProps) {
  return (
    <div className={cn("group relative rounded-lg border bg-zinc-950 text-zinc-50 text-sm", className)}>
      {(filename || lang) && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="text-xs text-zinc-400 font-mono">
            {filename || lang}
          </span>
          <CopyButton value={code} size="sm" className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" />
        </div>
      )}
      <div className="relative">
        {!filename && !lang && (
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton value={code} size="sm" className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" />
          </div>
        )}
        <pre className="overflow-x-auto p-4 font-mono leading-relaxed">
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  )
}
