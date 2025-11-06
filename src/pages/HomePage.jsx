import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome,
  FaServer,
  FaBolt,
  FaFire,
  FaShieldAlt,
  FaPlug,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaClock,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaWifi,
  FaNetworkWired,
  FaSave,
  FaTimes
} from 'react-icons/fa';

// ==================== PAGE ACCUEIL ====================
const HomePage = () => {
  const stats = {
    totalSites: 3,
    totalEquipments: 24,
    online: 18,
    warning: 4,
    offline: 2,
    lastCollection: '2025-11-02 10:30:25'
  };

  const recentActivities = [
    { id: 1, type: 'success', message: 'Collecte réussie sur Site Principal - Yaoundé', time: '10:30', equipments: 8 },
    { id: 2, type: 'warning', message: 'Avertissement détecté sur UPS-003', time: '10:15', equipments: 1 },
    { id: 3, type: 'info', message: 'Nouvelle planification créée', time: '09:45', equipments: 0 },
    { id: 4, type: 'success', message: 'Collecte réussie sur Datacenter - Kribi', time: '09:00', equipments: 6 },
  ];

  const sitesSummary = [
    { name: 'Site Principal - Yaoundé', total: 10, online: 8, warning: 2, offline: 0, status: 'good' },
    { name: 'Site Secondaire - Douala', total: 8, online: 6, warning: 1, offline: 1, status: 'warning' },
    { name: 'Datacenter - Kribi', total: 6, online: 4, warning: 1, offline: 1, status: 'warning' },
  ];

  const quickActions = [
    { icon: <FaPlus />, title: 'Nouvelle collecte', color: 'from-green-500 to-green-600', action: 'collect' },
    { icon: <FaClock />, title: 'Planifier', color: 'from-blue-500 to-blue-600', action: 'schedule' },
    { icon: <FaMapMarkerAlt />, title: 'Ajouter site', color: 'from-purple-500 to-purple-600', action: 'addSite' },
    { icon: <FaServer />, title: 'Ajouter équipement', color: 'from-orange-500 to-orange-600', action: 'addEquipment' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue sur Collector</h1>
            <p className="text-white/90">Tableau de bord - Gestion des équipements intelligents</p>
          </div>
          <FaHome size={60} className="opacity-20" />
        </div>
      </motion.div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <FaBuilding className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSites}</p>
              <p className="text-xs text-gray-500">Sites</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <FaServer className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEquipments}</p>
              <p className="text-xs text-gray-500">Équipements</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.online}</p>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.warning}</p>
              <p className="text-xs text-gray-500">Alertes</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.offline}</p>
              <p className="text-xs text-gray-500">Hors ligne</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg flex items-center justify-center">
              <FaClock className="text-cyan-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">10:30</p>
              <p className="text-xs text-gray-500">Dernière</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center gap-3`}
            >
              <div className="text-3xl">{action.icon}</div>
              <span className="font-medium text-sm">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Résumé des sites */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-50 to-cyan-50 p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">État des sites</h2>
          </div>
          <div className="p-6 space-y-4">
            {sitesSummary.map((site, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-600" />
                    <span className="font-medium text-gray-800">{site.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    site.status === 'good' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {site.total} équipements
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">{site.online}</p>
                    <p className="text-xs text-gray-500">En ligne</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-600">{site.warning}</p>
                    <p className="text-xs text-gray-500">Alertes</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">{site.offline}</p>
                    <p className="text-xs text-gray-500">Hors ligne</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-50 to-cyan-50 p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Activités récentes</h2>
          </div>
          <div className="p-6 space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-100' :
                  activity.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {activity.type === 'success' ? <FaCheckCircle className="text-green-600" /> :
                   activity.type === 'warning' ? <FaExclamationTriangle className="text-yellow-600" /> :
                   <FaClock className="text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;