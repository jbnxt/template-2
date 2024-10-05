'use client'

import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md h-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li><Link href="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-100">Dashboard</Link></li>
            <li><Link href="/admin/tasks" className="block py-2 px-4 hover:bg-gray-100">Tasks</Link></li>
            <li><Link href="/admin/handymen" className="block py-2 px-4 hover:bg-gray-100">Handymen</Link></li>
            <li><Link href="/admin/properties" className="block py-2 px-4 hover:bg-gray-100">Properties</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}