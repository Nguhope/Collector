import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaStop, 
  FaFilter, 
  FaDatabase, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaTimesCircle,
  FaSpinner,
  FaDownload,
  FaEye,
  FaBolt,
  FaFire,
  FaShieldAlt,
  FaServer,
  FaMapMarkerAlt,
  FaClock,
  FaWifi,
  FaPlug
} from 'react-icons/fa';

const EquipementsList = (  {equipmentData = [],
  isLoading = false,
  progress = 0,
  selectedItems = [],
  toggleSelectItem,
  selectAll,
  deselectAll,
  saveToDatabase,
  getStatusBadge,
  getEquipmentIcon
}) => {
  return (
    <div>
       {/* Barre de progression */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Collecte en cours...</span>
            <span className="text-sm font-bold text-green-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-cyan-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Résultats de la collecte */}
      {equipmentData.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Données collectées</h2>
              <p className="text-sm text-gray-500 mt-1">{equipmentData.length} équipement(s) détecté(s)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Tout sélectionner
              </button>
              <button
                onClick={deselectAll}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Tout désélectionner
              </button>
              <button
                onClick={saveToDatabase}
                disabled={selectedItems.length === 0}
                className="px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-lg hover:from-green-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaDatabase /> Sauvegarder ({selectedItems.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === equipmentData.length}
                      onChange={() => selectedItems.length === equipmentData.length ? deselectAll() : selectAll()}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Équipement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accessible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière mise à jour
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipmentData.map((item, index) => {
                  const statusBadge = getStatusBadge(item.status);
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl text-gray-400">
                            {getEquipmentIcon(item.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FaWifi className="text-cyan-500" />
                          {item.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{item.site}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.accessible ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                            <FaCheckCircle /> Oui
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                            <FaTimesCircle /> Non
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastUpdate}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Message si aucune donnée */}
      {!isLoading && equipmentData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <FaDatabase size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune collecte en cours</h3>
          <p className="text-gray-500">Configurez vos filtres et démarrez la collecte pour afficher les données</p>
        </motion.div>
      )}
    </div>
  )
}

export default EquipementsList
