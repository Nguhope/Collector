import React, { useState } from "react";
import { Plus, MapPin, Server, CheckCircle, AlertCircle, User, Phone, Clock } from "lucide-react";

// Sample data
const sampleSites = [
  { id: 1, name: "Site A", address: "123 Rue principale", status: "active", manager: "Jean Dupont", phone: "+237 6 XX XX XX XX", lastUpdate: "2025-10-31 14:30", equipments: [
      { type: "Temperature Sensor", ip: "192.168.1.10", status: "active", date: "2025-10-31 14:32" },
      { type: "Pressure Sensor", ip: "192.168.1.11", status: "inactive", date: "2025-10-31 14:40" },
    ] },
  { id: 2, name: "Site B", address: "456 Avenue du Commerce", status: "warning", manager: "Marie Kamga", phone: "+237 6 XX XX XX XX", lastUpdate: "2025-10-31 14:28", equipments: [
      { type: "Humidity Sensor", ip: "192.168.1.12", status: "inactive", date: "2025-10-31 14:42" },
    ] },
];

export default function Dashboard() {
  const [sites, setSites] = useState(sampleSites);

  // Calculate summary stats
  const totalSites = sites.length;
  const totalEquipment = sites.reduce((acc, site) => acc + site.equipments.length, 0);
  const totalActiveEquipment = sites.reduce(
    (acc, site) => acc + site.equipments.filter(e => e.status === "active").length,
    0
  );
  const totalInactiveEquipment = totalEquipment - totalActiveEquipment;

  // Gather recent equipment updates
  const recentEquipments = sites.flatMap(site =>
    site.equipments.map(e => ({ ...e, siteName: site.name }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

  return (
    <div className="flex flex-col p-6 bg-gray-100 min-h-screen space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
          <MapPin className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-gray-600 text-sm">Total Sites</p>
          <p className="text-2xl font-bold text-gray-900">{totalSites}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
          <Server className="w-8 h-8 text-gray-500 mb-2" />
          <p className="text-gray-600 text-sm">Total Equipment</p>
          <p className="text-2xl font-bold text-gray-900">{totalEquipment}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center">
          <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-green-700 text-sm">Active Equipment</p>
          <p className="text-2xl font-bold text-green-900">{totalActiveEquipment}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow p-5 flex flex-col items-center">
          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-red-700 text-sm">Inactive Equipment</p>
          <p className="text-2xl font-bold text-red-900">{totalInactiveEquipment}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 shadow font-semibold">
          <Plus className="w-5 h-5" />
          Add Site
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 shadow font-semibold">
          <Server className="w-5 h-5" />
          Add Equipment
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Equipment Updates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border-b text-gray-700">Site</th>
                <th className="p-2 border-b text-gray-700">Equipment</th>
                <th className="p-2 border-b text-gray-700">IP</th>
                <th className="p-2 border-b text-gray-700">Status</th>
                <th className="p-2 border-b text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEquipments.map((eq, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-2 border-b">{eq.siteName}</td>
                  <td className="p-2 border-b">{eq.type}</td>
                  <td className="p-2 border-b">{eq.ip}</td>
                  <td className="p-2 border-b">
                    <span className={`inline-block w-3 h-3 rounded-full ${eq.status === "active" ? "bg-green-500" : "bg-red-500"}`}></span>
                  </td>
                  <td className="p-2 border-b">{eq.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
