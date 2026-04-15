"use client"

import { useOS } from "@/lib/os-context"

interface OSSectionProps {
  mac: React.ReactNode
  windows: React.ReactNode
}

export function OSSection({ mac, windows }: OSSectionProps) {
  const { os } = useOS()
  return <>{os === "mac" ? mac : windows}</>
}
