import React from "react";

export default function StatsCard({ title, value, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    red: "from-red-500 to-red-700",
    yellow: "from-yellow-400 to-yellow-600",
    cyan: "from-cyan-500 to-cyan-700",
  };

  return (
    <div
      className={`rounded-xl shadow-md border border-gray-100 p-5 flex items-center justify-between 
      bg-gradient-to-r ${colorClasses[color]} text-white hover:shadow-lg transition-all`}
    >
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>

      <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
        {Icon && <Icon className="w-6 h-6 text-white" />}
      </div>
    </div>
  );
}
