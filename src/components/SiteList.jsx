// src/components/SiteList.jsx
import React, { useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Server,
  XCircle,
  ChevronDown,
  AlertCircle,
  Edit,
} from "lucide-react";

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

export default function SiteList({
  sites = [],
  isLoading = false,
  error = null,
  onDelete,
  onEdit,
}) {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-green-700";
      case "inactive":
        return "bg-red-500 text-red-700";
      case "warning":
        return "bg-yellow-400 text-yellow-700";
      default:
        return "bg-gray-300 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (!sites || sites.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Aucun site trouvé. Ajoutez-en un !
      </div>
    );
  }

  return (
    <m.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
      layout="position"
    >
      {sites.map((site) => {
        const isExpanded = expandedId === site.id;

        return (
          <m.div
            key={site.id}
            layout="position"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all ${
              isExpanded
                ? "md:col-span-2 lg:col-span-3 shadow-lg ring-2 ring-green-200"
                : "hover:shadow-lg"
            }`}
          >
            {/* Header */}
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleToggle(site.id)}
            >
              {/* Left section */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <MapPin className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {site.name}
                  </h3>
                  <p className="text-sm text-gray-500">{site.address}</p>
                </div>
              </div>

              {/* Right section: status + actions + expand */}
              <div className="flex items-center gap-2">
                {/* Status Badge */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    site.status
                  )} bg-opacity-20 border border-current`}
                >
                  {site.status}
                </span>

                {/* Edit/Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(site);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-full"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(site.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                >
                  <XCircle className="w-4 h-4" />
                </button>

                {/* Expand arrow */}
                <m.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </m.div>
              </div>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <m.div
                  variants={expandVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="px-6 pb-5 border-t border-gray-100 space-y-3"
                >
                  <p className="text-sm text-gray-700">
                    <strong>Responsable:</strong> {site.manager || "N/A"}
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Téléphone:</strong> {site.phone || "—"}
                  </p>

                  <p className="text-sm text-gray-700">
                    <strong>Dernière mise à jour:</strong>{" "}
                    {site.lastUpdate || "—"}
                  </p>

                  {/* Equipments List */}
                  <div>
                    <h4 className="font-semibold mt-2 flex items-center gap-2 text-gray-800 text-sm">
                      <Server className="w-4 h-4 text-gray-600" /> Équipements
                    </h4>

                    {site.equipments && site.equipments.length > 0 ? (
                      <ul className="list-disc ml-6 text-sm text-gray-700">
                        {site.equipments.map((eq, index) => (
                          <li key={index}>
                            {eq.type} — {eq.ip} (
                            <span
                              className={`font-medium ${
                                eq.status === "active"
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {eq.status}
                            </span>
                            )
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 ml-6">
                        Aucun équipement
                      </p>
                    )}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        );
      })}
    </m.div>
  );
}
