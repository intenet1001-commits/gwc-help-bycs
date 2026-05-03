"use client"

import { createContext, useContext, useEffect, useState } from "react"

export interface GWSAccount {
  id: string
  email: string
  suffix: string      // gws_ 뒤 폴더명 (예: "8821", "1002", "intenet1")
  configDir: string   // derived: isDefault → "~/.config/gws", else "~/.config/gws_${suffix}"
  projectId: string
  isDefault: boolean
  isExisting: boolean
}

function emailToSuffix(email: string): string {
  return email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase()
}

function deriveConfigDir(suffix: string, isDefault: boolean): string {
  return isDefault ? "~/.config/gws" : `~/.config/gws_${suffix}`
}

function defaultProjectId(suffix: string): string {
  return `workspace-${suffix}`
}

interface AccountsContextValue {
  accounts: GWSAccount[]
  addAccount: (email: string, suffix?: string, isExisting?: boolean) => void
  removeAccount: (id: string) => void
  updateAccount: (id: string, patch: Partial<GWSAccount>) => void
  setDefault: (id: string) => void
  defaultAccount: GWSAccount | undefined
}

const AccountsContext = createContext<AccountsContextValue>({
  accounts: [],
  addAccount: () => {},
  removeAccount: () => {},
  updateAccount: () => {},
  setDefault: () => {},
  defaultAccount: undefined,
})

const STORAGE_KEY = "gws-guide-accounts"

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<GWSAccount[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: GWSAccount[] = JSON.parse(stored)
        // backfill suffix for legacy data without suffix field
        const migrated = parsed.map((a) => ({
          ...a,
          suffix: a.suffix ?? (a.configDir.match(/\/gws_(.+)$/)?.[1] ?? emailToSuffix(a.email)),
        }))
        setAccounts(migrated)
      }
    } catch {}
  }, [])

  const save = (next: GWSAccount[]) => {
    setAccounts(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const addAccount = (email: string, customSuffix?: string, isExisting = false) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || accounts.some((a) => a.email === trimmed)) return
    const isFirst = accounts.length === 0
    const suffix = customSuffix?.trim() || emailToSuffix(trimmed)
    const newAccount: GWSAccount = {
      id: crypto.randomUUID(),
      email: trimmed,
      suffix,
      configDir: deriveConfigDir(suffix, isFirst),
      projectId: defaultProjectId(suffix),
      isDefault: isFirst,
      isExisting,
    }
    save(isFirst ? [newAccount] : [...accounts, newAccount])
  }

  const removeAccount = (id: string) => {
    const next = accounts.filter((a) => a.id !== id)
    if (next.length > 0 && !next.some((a) => a.isDefault)) {
      next[0].isDefault = true
      next[0].configDir = "~/.config/gws"
    }
    save(next)
  }

  const updateAccount = (id: string, patch: Partial<GWSAccount>) => {
    save(
      accounts.map((a) => {
        if (a.id !== id) return a
        const next = { ...a, ...patch }
        // If suffix changed, re-derive configDir
        if (patch.suffix !== undefined) {
          next.configDir = deriveConfigDir(next.suffix, next.isDefault)
          if (!patch.projectId) next.projectId = defaultProjectId(next.suffix)
        }
        return next
      })
    )
  }

  const setDefault = (id: string) => {
    save(
      accounts.map((a) => ({
        ...a,
        isDefault: a.id === id,
        configDir: deriveConfigDir(a.suffix, a.id === id),
      }))
    )
  }

  const defaultAccount = accounts.find((a) => a.isDefault)

  return (
    <AccountsContext.Provider
      value={{ accounts, addAccount, removeAccount, updateAccount, setDefault, defaultAccount }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export function useAccounts() {
  return useContext(AccountsContext)
}
