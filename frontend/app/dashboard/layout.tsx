import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stellar (XLM) Crowdfunding DApp - Dashboard',
  description: 'Decentralized crowdfunding platform built on Stellar (XLM) blockchain',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 