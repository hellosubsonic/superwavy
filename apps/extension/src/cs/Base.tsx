import React from "react"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { localExtStorage } from "@webext-core/storage"
import { Toaster } from "sonner"

import "@repo/ui/styles.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24
    }
  }
})

const persister = createAsyncStoragePersister({
  storage: localExtStorage
})

interface BaseAppProps {
  children: React.ReactNode
}

export function BaseApp({ children }: BaseAppProps) {
  return (
    <React.StrictMode>
      <Toaster richColors />
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}>
        {children}
      </PersistQueryClientProvider>
    </React.StrictMode>
  )
}

export { queryClient }
