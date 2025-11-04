import React from "react";
import {
  LayoutDashboard,
  Cpu,
  Flame,
  Zap,
  Battery,
  MapPin,
  Activity,
  FileText,
  AlertCircle,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  username = "Utilisateur",
  activeMenu,
  setActiveMenu,
  expandedMenu,
  toggleSubmenu,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "equipements",
      label: "Équipements",
      icon: Cpu,
      submenu: [
        { id: "wiser", label: "Systèmes Wiser", count: 2 },
        { id: "alarms", label: "Alarmes Incendie", count: 2 },
        { id: "generators", label: "Groupes Électrogènes", count: 1 },
        { id: "ups", label: "Onduleurs", count: 1 },
      ],
    },
    { id: "sites", label: "Sites & Localisations", icon: MapPin },
    { id: "realtime", label: "Données Temps Réel", icon: Activity },
    { id: "history", label: "Historique & Rapports", icon: FileText },
    { id: "alerts", label: "Alertes", icon: AlertCircle },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "settings", label: "Configuration", icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col relative">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {username.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">Administrateur</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 overflow-y-auto flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  setActiveMenu(item.id);
                  if (item.submenu) toggleSubmenu(item.id);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                  activeMenu === item.id
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.submenu &&
                    (expandedMenu[item.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </div>
              </button>

              {/* Submenu */}
              {item.submenu && expandedMenu[item.id] && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveMenu(sub.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition text-sm ${
                        activeMenu === sub.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>{sub.label}</span>
                      </div>
                      {sub.count && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
                          {sub.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center mt-4">
          <p className="font-semibold text-gray-700">Collector v1.0</p>
          <p>© 2024 ElecIT - Tous droits réservés</p>
        </div>
      </div>
    </aside>
  );
}
