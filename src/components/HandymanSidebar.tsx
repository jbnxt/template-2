'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/hooks/useAuth';
import { LogOut, Briefcase, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function HandymanSidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/'); // Redirect to the login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between">
      <nav>
        <Link href="/handyman" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <Briefcase className="inline-block mr-2 h-4 w-4" />
          My Tasks
        </Link>
        <Link href="/handyman/profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
          <UserCircle className="inline-block mr-2 h-4 w-4" />
          Profile
        </Link>
      </nav>
      <div className="px-4">
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}