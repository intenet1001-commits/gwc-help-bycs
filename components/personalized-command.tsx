"use client"

import { useAccounts } from "@/lib/accounts-context"
import { CodeBlock } from "@/components/code-block"

interface PersonalizedCommandProps {
  template: string
  /** Which account to use — "default" | index number | "all" */
  accountIndex?: number | "default" | "non-default"
  lang?: string
  filename?: string
}

/**
 * Renders a CodeBlock with account-specific values substituted.
 * Template variables:
 *   {{EMAIL}}        → account email
 *   {{PROJECT_ID}}   → account projectId
 *   {{CONFIG_DIR}}   → account configDir
 *   {{ALIAS}}        → suggested alias (e.g. gws8821)
 *   {{SLUG}}         → email username part (e.g. intenet8821)
 */
export function PersonalizedCommand({
  template,
  accountIndex = "default",
  lang = "bash",
  filename,
}: PersonalizedCommandProps) {
  const { accounts, defaultAccount } = useAccounts()

  const account =
    accountIndex === "default"
      ? defaultAccount
      : accountIndex === "non-default"
      ? accounts.find((a) => !a.isDefault)
      : accounts[accountIndex]

  const slug = account ? account.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() : "YOUR_ACCOUNT"

  const code = template
    .replace(/\{\{EMAIL\}\}/g, account?.email ?? "your@gmail.com")
    .replace(/\{\{PROJECT_ID\}\}/g, account?.projectId ?? "YOUR_PROJECT_ID")
    .replace(/\{\{CONFIG_DIR\}\}/g, account?.configDir ?? "~/.config/gws_ACCOUNT")
    .replace(/\{\{ALIAS\}\}/g, `gws${slug}`)
    .replace(/\{\{SLUG\}\}/g, slug)

  return <CodeBlock code={code} lang={lang} filename={filename} />
}
