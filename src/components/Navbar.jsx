import React from 'react';
import { Menu, X, Activity, Bell, LogOut } from 'lucide-react';

export default function Navbar({ isSidebarOpen, setIsSidebarOpen, setIsLoggedIn }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* --- Left Section --- */}
        <div className="flex items-center gap-4">
          {/* Sidebar toggle button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Collector <span className="text-sm font-normal text-blue-600">by ElecIT</span>
              </h1>
              <p className="text-xs text-gray-500">Système de Collecte de Données</p>
            </div>
          </div>
        </div>

        {/* --- Right Section --- */}
        <div className="flex items-center gap-4">
          {/* Live status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">En Direct</span>
          </div>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile / Logout */}
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
