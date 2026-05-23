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
        "group/copy inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground",
        "transition-all duration-200 ease-out",
        "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-sm",
        "active:scale-95",
        copied && "bg-brand-green border-brand-green text-white hover:bg-brand-green",
        size === "sm" && "px-1.5 py-1 text-[11px]",
        className
      )}
      title="Copy to clipboard"
    >
      <span className="relative size-3">
        <Copy
          className={cn(
            "absolute inset-0 size-3 transition-all duration-200",
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 size-3 transition-all duration-200",
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
      </span>
      {size !== "sm" && (
        <span className="transition-all duration-200">
          {copied ? "Copied!" : "Copy"}
        </span>
      )}
    </button>
  )
}
