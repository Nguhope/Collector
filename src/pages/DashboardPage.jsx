import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddEditSite from "./AddEditSite";
import Dashboard from "../features/dashboard/Dashboard";
import { MapPin, Plus, Edit, Trash2, User, Phone, Clock } from "lucide-react";

const sampleDevices = [
  { id: 1, date: "2025-10-31 14:32", site: "Site A", electronic: "Temperature Sensor", ip: "192.168.1.10", status: "active" },
  { id: 2, date: "2025-10-31 14:40", site: "Site A", electronic: "Pressure Sensor", ip: "192.168.1.11", status: "inactive" },
  { id: 3, date: "2025-10-31 14:42", site: "Site B", electronic: "Humidity Sensor", ip: "192.168.1.12", status: "inactive" },
];

const sampleSites = [
  { id: 1, name: "Site A", address: "123 Rue principale", status: "active", manager: "Jean Dupont", phone: "+237 6 XX XX XX XX", lastUpdate: "2025-10-31 14:30", equipments: [
      { type: "Temperature Sensor", ip: "192.168.1.10", status: "active", date: "2025-10-31 14:32" },
      { type: "Pressure Sensor", ip: "192.168.1.11", status: "inactive", date: "2025-10-31 14:40" },
    ] },
  { id: 2, name: "Site B", address: "456 Avenue du Commerce", status: "warning", manager: "Marie Kamga", phone: "+237 6 XX XX XX XX", lastUpdate: "2025-10-31 14:28", equipments: [
      { type: "Humidity Sensor", ip: "192.168.1.12", status: "inactive", date: "2025-10-31 14:42" },
    ] },
];

// Example equipment types for dropdown
const equipmentTypes = ["Temperature Sensor", "Pressure Sensor", "Humidity Sensor", "Smoke Detector", "Light Sensor"];

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard"); // Dashboard is default landing view
  const [expandedMenu, setExpandedMenu] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sites, setSites] = useState(sampleSites);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const toggleSubmenu = (id) => setExpandedMenu(prev => ({ ...prev, [id]: !prev[id] }));
  
  const handleDeleteSite = (id) => {
    setSites(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveSite = (newSite) => {
    setSites(prev => {
      const exists = prev.find(s => s.id === newSite.id);
      if (exists) {
        return prev.map(s => s.id === newSite.id ? newSite : s);
      } else {
        return [...prev, newSite];
      }
    });
    setShowAddSiteModal(false);
  };

  if (!isLoggedIn) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-xl text-gray-700">Vous êtes déconnecté</h1>
    </div>
  );

  // Filtered sites
  const filteredSites = sites.filter(
    s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
         (statusFilter ? s.status === statusFilter : true)
  );

  const totalSites = filteredSites.length;
  const totalEquipment = filteredSites.reduce(
    (acc, site) => acc + (site.equipments ? site.equipments.length : 0),
    0
  );
  const totalActiveEquipment = filteredSites.reduce(
    (acc, site) => acc + (site.equipments ? site.equipments.filter(e => e.status === "active").length : 0),
    0
  );
  const totalInactiveEquipment = totalEquipment - totalActiveEquipment;

  // Example logged-in user
  const user = "Jean Dupont";

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebarOpen && <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} expandedMenu={expandedMenu} toggleSubmenu={toggleSubmenu} />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} setIsLoggedIn={setIsLoggedIn} />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeMenu === "dashboard" && (
            <Dashboard user={user} totalSites={totalSites} totalEquipment={totalEquipment} totalActiveEquipment={totalActiveEquipment} totalInactiveEquipment={totalInactiveEquipment} />
          )}

          {activeMenu === "sites" && (
            <div>
              {/* Sites & Localisations content */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">Sites & Localisations</h2>
                  <p className="text-gray-600">Gérez tous vos sites et leurs équipements</p>
                </div>
                <button
                  onClick={() => setShowAddSiteModal(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition shadow-lg font-semibold"
                >
                  <Plus className="w-5 h-5" /> Ajouter un Site
                </button>
              </div>

              {/* Search/Filter */}
              <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
                <input type="text" placeholder="Rechercher un site..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"/>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
                  <option value="">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="warning">Alertes</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                  <p className="text-gray-700 font-semibold">Total Sites</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSites}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow flex flex-col items-center">
                  <p className="text-green-700 font-semibold">Active Equipment</p>
                  <p className="text-2xl font-bold text-green-900">{totalActiveEquipment}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg shadow flex flex-col items-center">
                  <p className="text-red-700 font-semibold">Inactive Equipment</p>
                  <p className="text-2xl font-bold text-red-900">{totalInactiveEquipment}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow flex flex-col items-center">
                  <p className="text-blue-700 font-semibold">Total Equipment</p>
                  <p className="text-2xl font-bold text-blue-900">{totalEquipment}</p>
                </div>
              </div>

              {/* Sites Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSites.map(site => {
                  const siteDevices = site.equipments || [];
                  const activeEquipment = siteDevices.filter(e => e.status === "active").length;
                  const inactiveEquipment = siteDevices.length - activeEquipment;

                  return (
                    <div key={site.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
                      <div className={`p-4 ${site.status === "active" ? "bg-green-50 border-b-2 border-green-500" : site.status === "warning" ? "bg-yellow-50 border-b-2 border-yellow-500" : "bg-gray-50 border-b-2 border-gray-500"}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${site.status === "active" ? "bg-green-500" : site.status === "warning" ? "bg-yellow-500" : "bg-gray-500"}`}>
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
                              <p className="text-sm text-gray-600">{site.address}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-white rounded-lg transition"><Edit className="w-4 h-4 text-gray-700"/></button>
                            <button onClick={() => handleDeleteSite(site.id)} className="p-2 hover:bg-white rounded-lg transition"><Trash2 className="w-4 h-4 text-red-600"/></button>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-700">{siteDevices.length}</p>
                            <p className="text-xs text-blue-600 font-medium">Équipements</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-700">{activeEquipment}</p>
                            <p className="text-xs text-green-600 font-medium">Actifs</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-2xl font-bold text-red-700">{inactiveEquipment}</p>
                            <p className="text-xs text-red-600 font-medium">Inactifs</p>
                          </div>
                        </div>

                        <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Responsable:</span>
                            <span className="font-semibold text-gray-900">{site.manager}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Téléphone:</span>
                            <span className="font-semibold text-gray-900">{site.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Dernière mise à jour:</span>
                            <span className="font-semibold text-gray-900">{site.lastUpdate}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedSite(selectedSite?.id === site.id ? null : site)}
                          className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition font-semibold text-sm"
                        >
                          Voir les Équipements
                        </button>

                        {selectedSite?.id === site.id && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Équipements</h4>
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="p-2 border-b text-gray-700">Nom</th>
                                  <th className="p-2 border-b text-gray-700">IP</th>
                                  <th className="p-2 border-b text-gray-700">Status</th>
                                  <th className="p-2 border-b text-gray-700">Date/Time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {siteDevices.map((d, i) => (
                                  <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="p-2 border-b">{d.type}</td>
                                    <td className="p-2 border-b">{d.ip}</td>
                                    <td className="p-2 border-b">
                                      <span className={`inline-block w-3 h-3 rounded-full ${d.status === "active" ? "bg-green-500" : "bg-red-500"}`}></span>
                                    </td>
                                    <td className="p-2 border-b">{d.date || site.lastUpdate}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showAddSiteModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl mx-auto">
                    <AddEditSite
                      onClose={() => setShowAddSiteModal(false)}
                      onSave={handleSaveSite}
                      equipmentTypes={equipmentTypes}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
