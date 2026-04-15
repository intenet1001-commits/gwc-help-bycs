"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
  size?: "sm" | "default"
}

export function CopyButton({ value, label, className, size = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value)
      } else {
        // Fallback for non-secure contexts
        const el = document.createElement("textarea")
        el.value = value
        el.style.position = "fixed"
        el.style.opacity = "0"
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)
      }
      setCopied(true)
      toast.success(label ? `"${label}" copied!` : "Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy. Please copy manually.")
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        size === "sm" && "px-1.5 py-1 text-[11px]",
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="size-3 text-green-500" />
      ) : (
        <Copy className="size-3" />
      )}
      {size !== "sm" && (copied ? "Copied" : "Copy")}
    </button>
  )
}
