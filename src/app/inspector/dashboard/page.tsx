'use client'

import { Page as InspectorDashboard } from '@/components/app-inspector-dashboard-page'
import { Sidebar } from '@/components/Sidebar'
import { Footer } from '@/components/Footer'

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <InspectorDashboard />
        </main>
        <Footer />
      </div>
    </div>
  )
}