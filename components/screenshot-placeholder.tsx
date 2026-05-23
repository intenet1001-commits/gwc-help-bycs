"use client"

import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ScreenshotPlaceholderProps {
  src?: string
  alt: string
  caption?: string
  className?: string
  priority?: boolean
}

export function ScreenshotPlaceholder({
  src,
  alt,
  caption,
  className,
  priority = false,
}: ScreenshotPlaceholderProps) {
  if (src) {
    // SVG files use img tag for better compatibility
    const isSvg = src.endsWith('.svg')

    return (
      <figure className={cn("space-y-2", className)}>
        <div className="relative overflow-hidden rounded-lg border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {isSvg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              className="w-full h-auto"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={800}
              height={500}
              className="w-full h-auto"
              priority={priority}
            />
          )}
        </div>
        {caption && (
          <figcaption className="text-xs text-muted-foreground text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure className={cn("space-y-2", className)}>
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8 min-h-[200px]">
        <ImageIcon className="size-10 text-muted-foreground/40" />
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-muted-foreground/60">{alt}</p>
          <p className="text-xs text-muted-foreground/40">
            Screenshot coming soon
          </p>
        </div>
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
