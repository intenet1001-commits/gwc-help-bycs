import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SiteNav } from "@/components/site-nav"
import { OSProvider } from "@/lib/os-context"
import { AccountsProvider } from "@/lib/accounts-context"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Google Workspace CLI (gws) 완벽 설치 가이드",
  description:
    "Mac과 Windows 초보자도 따라할 수 있는 Google Workspace CLI(gws) v0.22.5 설치 및 인증 설정 가이드. credentials.json 파서 도구 포함.",
  keywords: ["gws", "Google Workspace CLI", "설치 가이드", "OAuth", "credentials"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background">
        <AccountsProvider>
        <OSProvider>
          <TooltipProvider>
            <SiteNav />
            <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
            <footer className="mt-16 border-t py-8 text-center text-xs text-muted-foreground">
              <p>gws v0.22.5 기준 · Google Workspace CLI CS가이드</p>
            </footer>
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </OSProvider>
        </AccountsProvider>
      </body>
    </html>
  )
}
