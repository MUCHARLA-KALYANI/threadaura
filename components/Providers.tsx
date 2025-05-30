'use client'

import { SessionProvider } from 'next-auth/react'
import ClientProviders from './ClientProviders'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>
    <ClientProviders>{children}</ClientProviders></SessionProvider>
}
