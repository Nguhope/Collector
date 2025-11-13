import React from "react";
import { Server, Cpu, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function StatsCardsEquipment({ stats }) {
  const defaultStats = [
    {
      title: "Total Equipments",
      value: stats?.totalEquipments || 0,
      icon: Server,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Active Equipments",
      value: stats?.activeEquipments || 0,
      icon: CheckCircle,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Inactive Equipments",
      value: stats?.inactiveEquipments || 0,
      icon: XCircle,
      color: "from-red-500 to-red-700",
    },
    {
      title: "Alert Equipments",
      value: stats?.alertEquipments || 0,
      icon: AlertTriangle,
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      {defaultStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`rounded-xl shadow-md border border-gray-100 p-5 flex items-center justify-between
            bg-gradient-to-r ${stat.color} text-white hover:shadow-lg transition-all`}
          >
            <div>
              <p className="text-sm opacity-80">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>

            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
