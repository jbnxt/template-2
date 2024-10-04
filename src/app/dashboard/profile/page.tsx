'use client'

import { UserProfile } from '@/components/UserProfile'

export default function ProfilePage() {
  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
      <UserProfile />
    </div>
  )
}