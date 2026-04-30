"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">CollegeConnect</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/colleges" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Colleges
              </Link>
              <Link href="/compare" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Compare
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/saved" className="text-gray-500 hover:text-gray-700 font-medium text-sm">
                  Saved Colleges
                </Link>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span>{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center">
                  Log in
                </Link>
                <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
