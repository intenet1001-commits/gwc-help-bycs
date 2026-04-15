"use client"

import { createContext, useContext, useEffect, useState } from "react"

type OS = "mac" | "windows"

interface OSContextValue {
  os: OS
  setOs: (os: OS) => void
}

const OSContext = createContext<OSContextValue>({
  os: "mac",
  setOs: () => {},
})

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [os, setOsState] = useState<OS>("mac")

  useEffect(() => {
    const stored = localStorage.getItem("gws-guide-os") as OS | null
    if (stored === "mac" || stored === "windows") {
      setOsState(stored)
    } else {
      // Auto-detect
      const isMac = navigator.platform.toLowerCase().includes("mac") ||
        navigator.userAgent.toLowerCase().includes("mac")
      setOsState(isMac ? "mac" : "windows")
    }
  }, [])

  const setOs = (newOs: OS) => {
    setOsState(newOs)
    localStorage.setItem("gws-guide-os", newOs)
  }

  return <OSContext.Provider value={{ os, setOs }}>{children}</OSContext.Provider>
}

export function useOS() {
  return useContext(OSContext)
}
