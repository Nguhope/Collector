import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CollectesList from '../components/CollectesList';
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
// Types d'équipements avec icônes
const equipmentTypes = [
  { id: 'all', name: 'Tous les équipements', icon: <FaServer />, color: 'gray' },
  { id: 'ups', name: 'Onduleurs', icon: <FaBolt />, color: 'yellow' },
  { id: 'generator', name: 'Groupes électrogènes', icon: <FaPlug />, color: 'orange' },
  { id: 'fire', name: 'Détecteurs incendie', icon: <FaFire />, color: 'red' },
  { id: 'security', name: 'Systèmes de sécurité', icon: <FaShieldAlt />, color: 'blue' },
];

// Données mockées pour la démonstration
const mockSites = [
  { id: 1, name: 'Site Principal - Yaoundé' },
  { id: 2, name: 'Site Secondaire - Douala' },
  { id: 3, name: 'Datacenter - Kribi' },
];

const mockEquipments = [
  { 
    id: 1, 
    name: 'UPS-001', 
    type: 'ups', 
    address: '192.168.1.10', 
    site: 'Site Principal - Yaoundé',
    status: 'online',
    accessible: true,
    lastUpdate: '2025-11-02 10:30:25'
  },
  { 
    id: 2, 
    name: 'GEN-001', 
    type: 'generator', 
    address: '192.168.1.20', 
    site: 'Site Principal - Yaoundé',
    status: 'online',
    accessible: true,
    lastUpdate: '2025-11-02 10:30:22'
  },
  { 
    id: 3, 
    name: 'FIRE-DET-001', 
    type: 'fire', 
    address: '192.168.1.30', 
    site: 'Site Secondaire - Douala',
    status: 'warning',
    accessible: true,
    lastUpdate: '2025-11-02 10:29:45'
  },
  { 
    id: 4, 
    name: 'UPS-002', 
    type: 'ups', 
    address: '192.168.2.10', 
    site: 'Datacenter - Kribi',
    status: 'offline',
    accessible: false,
    lastUpdate: '2025-11-02 09:15:12'
  },
];

// Composant principal de collecte
const CollectePage = () => {
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('all');
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectedData, setCollectedData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterOpen, setFilterOpen] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulation de collecte
  const startCollection = () => {
    setIsCollecting(true);
    setProgress(0);
    setCollectedData([]);
    
    const filteredEquipments = mockEquipments.filter(eq => {
      const siteMatch = selectedSite === 'all' || eq.site === selectedSite;
      const typeMatch = selectedEquipmentType === 'all' || eq.type === selectedEquipmentType;
      return siteMatch && typeMatch;
    });

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < filteredEquipments.length) {
        setCollectedData(prev => [...prev, {
          ...filteredEquipments[currentIndex],
          collectedAt: new Date().toISOString()
        }]);
        setProgress(((currentIndex + 1) / filteredEquipments.length) * 100);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsCollecting(false);
      }
    }, 1500);
  };

  const stopCollection = () => {
    setIsCollecting(false);
  };

  const saveToDatabase = () => {
    if (selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un équipement');
      return;
    }
    alert(`${selectedItems.length} équipement(s) sauvegardé(s) dans la base de données`);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(collectedData.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const getStatusBadge = (status) => {
    const badges = {
      online: { color: 'bg-green-100 text-green-700 border-green-300', icon: <FaCheckCircle />, text: 'En ligne' },
      warning: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: <FaExclamationTriangle />, text: 'Avertissement' },
      offline: { color: 'bg-red-100 text-red-700 border-red-300', icon: <FaTimesCircle />, text: 'Hors ligne' },
    };
    return badges[status] || badges.offline;
  };

  const getEquipmentIcon = (type) => {
    const equipment = equipmentTypes.find(eq => eq.id === type);
    return equipment ? equipment.icon : <FaServer />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Équipements</p>
              <p className="text-3xl font-bold mt-1">{mockEquipments.length}</p>
            </div>
            <FaServer size={40} className="opacity-30" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">En ligne</p>
              <p className="text-3xl font-bold mt-1">
                {mockEquipments.filter(e => e.status === 'online').length}
              </p>
            </div>
            <FaCheckCircle size={40} className="opacity-30" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avertissements</p>
              <p className="text-3xl font-bold mt-1">
                {mockEquipments.filter(e => e.status === 'warning').length}
              </p>
            </div>
            <FaExclamationTriangle size={40} className="opacity-30" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Hors ligne</p>
              <p className="text-3xl font-bold mt-1">
                {mockEquipments.filter(e => e.status === 'offline').length}
              </p>
            </div>
            <FaTimesCircle size={40} className="opacity-30" />
          </div>
        </motion.div>
      </div>

      {/* Panneau de filtres */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FaFilter className="text-green-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Filtres de collecte</h2>
          </div>
          <motion.div
            animate={{ rotate: filterOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.div>
        </button>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un site
                  </label>
                  <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={isCollecting}
                  >
                    <option value="all">Tous les sites</option>
                    {mockSites.map(site => (
                      <option key={site.id} value={site.name}>{site.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'équipement
                  </label>
                  <select
                    value={selectedEquipmentType}
                    onChange={(e) => setSelectedEquipmentType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={isCollecting}
                  >
                    {equipmentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                {!isCollecting ? (
                  <button
                    onClick={startCollection}
                    className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaPlay /> Démarrer la collecte
                  </button>
                ) : (
                  <button
                    onClick={stopCollection}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaStop /> Arrêter la collecte
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

<CollectesList
  equipmentData={collectedData}
  isLoading={isCollecting}
  progress={progress}
  selectedItems={selectedItems}
  toggleSelectItem={toggleSelectItem}
  selectAll={selectAll}
  deselectAll={deselectAll}
  saveToDatabase={saveToDatabase}
  getStatusBadge={getStatusBadge}
  getEquipmentIcon={getEquipmentIcon}
/>

    </div>
  );
};

export default CollectePage
