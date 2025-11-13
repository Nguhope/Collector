import React from "react";
import { MapPin, Users, Radio, Building } from "lucide-react"; // beautiful icons

export default function StatsCards({ sites = [] }) {
  // ✅ Basic computed values
  const totalSites = sites.length;
  const totalClients = new Set(sites.map((s) => s.client)).size;
  const totalCities = new Set(sites.map((s) => s.location)).size;

  const stats = [
    {
      title: "Total Sites",
      value: totalSites,
      icon: <Building className="w-6 h-6 text-blue-500" />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Clients",
      value: totalClients,
      icon: <Users className="w-6 h-6 text-green-500" />,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Cities Covered",
      value: totalCities,
      icon: <MapPin className="w-6 h-6 text-pink-500" />,
      color: "from-pink-500 to-pink-700",
    },
    {
      title: "Active Equipments",
      value: Math.floor(totalSites * 3 + 2), // demo value
      icon: <Radio className="w-6 h-6 text-yellow-500" />,
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between border border-gray-100 hover:shadow-lg transition-all"
        >
          <div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>

          <div
            className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
