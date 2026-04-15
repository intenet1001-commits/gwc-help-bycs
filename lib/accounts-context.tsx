"use client"

import { createContext, useContext, useEffect, useState } from "react"

export interface GWSAccount {
  id: string
  email: string
  configDir: string
  projectId: string
  isDefault: boolean
  isExisting: boolean   // 이미 설치/인증 완료된 계정
}

function emailToSlug(email: string): string {
  return email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase()
}

function defaultConfigDir(email: string, isDefault: boolean): string {
  if (isDefault) return "~/.config/gws"
  return `~/.config/gws_${emailToSlug(email)}`
}

function defaultProjectId(email: string): string {
  return `workspace-${emailToSlug(email)}`
}

interface AccountsContextValue {
  accounts: GWSAccount[]
  addAccount: (email: string, isExisting?: boolean) => void
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
      if (stored) setAccounts(JSON.parse(stored))
    } catch {}
  }, [])

  const save = (next: GWSAccount[]) => {
    setAccounts(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const addAccount = (email: string, isExisting = false) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || accounts.some((a) => a.email === trimmed)) return
    const isFirst = accounts.length === 0
    const newAccount: GWSAccount = {
      id: crypto.randomUUID(),
      email: trimmed,
      configDir: defaultConfigDir(trimmed, isFirst),
      projectId: defaultProjectId(trimmed),
      isDefault: isFirst,
      isExisting,
    }
    // If first account, set as default and update others
    const next = isFirst
      ? [newAccount]
      : [...accounts, newAccount]
    save(next)
  }

  const removeAccount = (id: string) => {
    const next = accounts.filter((a) => a.id !== id)
    // Re-assign default if needed
    if (next.length > 0 && !next.some((a) => a.isDefault)) {
      next[0].isDefault = true
      next[0].configDir = "~/.config/gws"
    }
    save(next)
  }

  const updateAccount = (id: string, patch: Partial<GWSAccount>) => {
    save(accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  const setDefault = (id: string) => {
    save(
      accounts.map((a) => ({
        ...a,
        isDefault: a.id === id,
        configDir:
          a.id === id
            ? "~/.config/gws"
            : defaultConfigDir(a.email, false),
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
