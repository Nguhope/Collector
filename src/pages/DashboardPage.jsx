import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../features/dashboard/Dashboard";
import SitePage from "./SitePage"; // ✅ Corrected import

const sampleSites = [
  {
    id: 1,
    name: "Site A",
    address: "123 Rue principale",
    status: "active",
    manager: "Jean Dupont",
    phone: "+237 6 XX XX XX XX",
    lastUpdate: "2025-10-31 14:30",
    equipments: [
      { type: "Temperature Sensor", ip: "192.168.1.10", status: "active", date: "2025-10-31 14:32" },
      { type: "Pressure Sensor", ip: "192.168.1.11", status: "inactive", date: "2025-10-31 14:40" },
    ],
  },
  {
    id: 2,
    name: "Site B",
    address: "456 Avenue du Commerce",
    status: "warning",
    manager: "Marie Kamga",
    phone: "+237 6 XX XX XX XX",
    lastUpdate: "2025-10-31 14:28",
    equipments: [
      { type: "Humidity Sensor", ip: "192.168.1.12", status: "inactive", date: "2025-10-31 14:42" },
    ],
  },
];

const equipmentTypes = [
  "Temperature Sensor",
  "Pressure Sensor",
  "Humidity Sensor",
  "Smoke Detector",
  "Light Sensor",
];

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard"); // Default view
  const [expandedMenu, setExpandedMenu] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [sites, setSites] = useState(sampleSites);

  const toggleSubmenu = (id) =>
    setExpandedMenu((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSaveSite = (newSite) => {
    setSites((prev) => {
      const exists = prev.find((s) => s.id === newSite.id);
      if (exists) {
        return prev.map((s) => (s.id === newSite.id ? newSite : s));
      } else {
        return [...prev, newSite];
      }
    });
  };

  if (!isLoggedIn)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-xl text-gray-700">Vous êtes déconnecté</h1>
      </div>
    );

  // Stats for Dashboard
  const totalSites = sites.length;
  const totalEquipment = sites.reduce(
    (acc, site) => acc + (site.equipments ? site.equipments.length : 0),
    0
  );
  const totalActiveEquipment = sites.reduce(
    (acc, site) =>
      acc +
      (site.equipments
        ? site.equipments.filter((e) => e.status === "active").length
        : 0),
    0
  );
  const totalInactiveEquipment = totalEquipment - totalActiveEquipment;
  const user = "Jean Dupont";

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebarOpen && (
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          expandedMenu={expandedMenu}
          toggleSubmenu={toggleSubmenu}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setIsLoggedIn={setIsLoggedIn}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard View */}
          {activeMenu === "dashboard" && (
            <Dashboard
              user={user}
              totalSites={totalSites}
              totalEquipment={totalEquipment}
              totalActiveEquipment={totalActiveEquipment}
              totalInactiveEquipment={totalInactiveEquipment}
            />
          )}

          {/* Sites Management View */}
          {activeMenu === "sites" && (
            <SitePage
              sites={sites}
              setSites={setSites}
              handleSaveSite={handleSaveSite}
              equipmentTypes={equipmentTypes}
            />
          )}
        </main>
      </div>
    </div>
  );
}
