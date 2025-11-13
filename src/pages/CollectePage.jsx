import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CollectesList from '../components/CollectesList'; // Assurez-vous que le chemin est correct
import AlertDialog from '../components/AlertDialog';
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
    FaPlug,
    FaConnectdevelop,
    FaDirections,
    FaSignal
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
    { id: 1, name: 'Yaoundé - Biyem', clientId: '1' },
    { id: 2, name: 'Douala - Bonanjo', clientId: '1' },
    { id: 3, name: 'Yaoundé - Bastos', clientId: '2' },
    { id: 4, name: 'Datacenter - Kribi', clientId: '3' },
];

const mockClients = [
    { id: "1", name: "CAMTEL" },
    { id: "2", name: "MTN Cameroon" },
    { id: "3", name: "Orange Cameroun" },
    { id: "4", name: "ENEO" }
];

const marquesTypes = [
    { id: 'all', name: 'Toutes les marques' },
    { id: 'APC', name: 'APC' },
    { id: 'Eaton', name: 'Eaton' },
    { id: 'Vertiv', name: 'Vertiv' },
];

const RessourcesName = [
    { id: '1', name: 'groupes_electrognes' },
    { id: '2', name: 'energies' },
    { id: '3', name: 'incendies' },
    { id: '4', name: 'sat_client_and_pretreat' },
    { id: '5', name: 'alert_wiser_and_pretreat' },
    { id: '6', name: 'ups_data_logs' },
    { id: '7', name: 'ups_data_event' },
    { id: '8', name: 'ping' },
];

// MOCK des équipements mis à jour avec Client, Marque et Statut de Collecte
const mockEquipments = [
    { id: 1, name: 'UPS-001', type: 'ups', marque: 'APC', address: '192.168.1.10', site: 'Yaoundé - Biyem', clientId: '1', clientName: 'CAMTEL', status: 'online', accessible: true, collectedStatus: true, lastUpdate: '2025-11-02 10:30:25' },
    { id: 2, name: 'GEN-001', type: 'generator', marque: 'CAT', address: '192.168.1.20', site: 'Yaoundé - Biyem', clientId: '1', clientName: 'CAMTEL', status: 'online', accessible: true, collectedStatus: true, lastUpdate: '2025-11-02 10:30:22' },
    { id: 3, name: 'FIRE-DET-001', type: 'fire', marque: 'N/A', address: '192.168.1.30', site: 'Douala - Bonanjo', clientId: '1', clientName: 'CAMTEL', status: 'warning', accessible: true, collectedStatus: false, lastUpdate: '2025-11-02 10:29:45' },
    { id: 4, name: 'UPS-002', type: 'ups', marque: 'Eaton', address: '192.168.2.10', site: 'Datacenter - Kribi', clientId: '3', clientName: 'Orange Cameroun', status: 'offline', accessible: false, collectedStatus: false, lastUpdate: '2025-11-02 09:15:12' },
    { id: 5, name: 'SEC-001', type: 'security', marque: 'Hik', address: '192.168.2.15', site: 'Datacenter - Kribi', clientId: '3', clientName: 'Orange Cameroun', status: 'online', accessible: true, collectedStatus: true, lastUpdate: '2025-11-02 11:00:00' },
];

// Composant principal de collecte
const CollectePage = () => {
    // États pour la sélection des filtres
    const [selectedClient, setSelectedClient] = useState('all');
    const [selectedSite, setSelectedSite] = useState('all');
    const [selectedEquipmentType, setSelectedEquipmentType] = useState('all');
    const [selectedMarque, setSelectedMarque] = useState('all');
    const [selectedResourceName, setSelectedResourceName] = useState('all');

    // États de la collecte
    const [isCollecting, setIsCollecting] = useState(false);
    const [collectedData, setCollectedData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [filterOpen, setFilterOpen] = useState(true);
    const [progress, setProgress] = useState(0);
     
    const [isAlertOpen, setIsAlertOpen] = useState(false);
const [alertTitle, setAlertTitle] = useState('');
const [alertMessage, setAlertMessage] = useState('');
const [alertType, setAlertType] = useState('warning');

const showAlert = (title, message, type = 'warning') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertOpen(true);
};

const closeAlert = () => {
    setIsAlertOpen(false);
};
    // Sites filtrés en fonction du client sélectionné
    const sitesFilteredByClient = useMemo(() => {
        if (selectedClient === 'all') {
            return mockSites;
        }
        return mockSites.filter(site => site.clientId === selectedClient);
    }, [selectedClient]);

    // Réinitialiser le site si le client change et que le site sélectionné n'appartient plus au client
    useEffect(() => {
        if (selectedSite !== 'all' && !sitesFilteredByClient.find(site => site.name === selectedSite)) {
            setSelectedSite('all');
        }
    }, [selectedClient, selectedSite, sitesFilteredByClient]);

    // Déterminer si le type d'équipement est UPS
    const isEquipmentTypeUPS = selectedEquipmentType === 'ups';
    
    // Déterminer si le bouton "Démarrer la collecte" ou "Démarrer le Ping" est disabled
    const isStartDisabled = useMemo(() => {
        const isClientOrSiteMissing = selectedClient === 'all' || selectedSite === 'all';
        const isResourceMissing = selectedResourceName === 'all';
        const isMarqueMissingForUPS = isEquipmentTypeUPS && selectedMarque === 'all';

        return isCollecting || isClientOrSiteMissing || isResourceMissing || isMarqueMissingForUPS;
    }, [isCollecting, selectedClient, selectedSite, selectedResourceName, isEquipmentTypeUPS, selectedMarque]);

    // Fonction de simulation de collecte
    const handleCollect = (isPing) => {
        if (isStartDisabled) return;

        setIsCollecting(true);
        setProgress(0);
        setCollectedData([]);
        
        // 1. Filtrage initial des équipements basé sur tous les filtres
        const filteredEquipments = mockEquipments.filter(eq => {
            const clientMatch = selectedClient === 'all' || eq.clientId === selectedClient;
            const siteMatch = selectedSite === 'all' || eq.site === selectedSite;
            const typeMatch = selectedEquipmentType === 'all' || eq.type === selectedEquipmentType;
            const marqueMatch = selectedMarque === 'all' || eq.marque === selectedMarque;
            
            return clientMatch && siteMatch && typeMatch && marqueMatch;
        });

        // 2. Logique de simulation pour la collecte/ping
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < filteredEquipments.length) {
                // Simuler l'état de collecte basé sur l'accessibilité ou un état aléatoire
                const isCollected = filteredEquipments[currentIndex].accessible && Math.random() > 0.1;
                
                setCollectedData(prev => [...prev, {
                    ...filteredEquipments[currentIndex],
                    collectedAt: new Date().toISOString(),
                    // Mettre à jour collectedStatus pour l'affichage
                    collectedStatus: isCollected 
                }]);
                setProgress(((currentIndex + 1) / filteredEquipments.length) * 100);
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsCollecting(false);
            }
        }, 800);
    };

const handleStartPing = () => {
        // Ping est spécifique au Ressource Name 'ping'
        if (selectedResourceName !== 'ping') {
            showAlert(
                "Ressource Incompatible",
                "Veuillez sélectionner 'ping' dans Ressources Name pour démarrer le Ping.",
                'error'
            );
            return;
        }
        handleCollect(true);
    };

    const handleStartCollecte = () => {
        // Collecte est pour tout sauf 'ping'
        if (selectedResourceName === 'ping') {
            showAlert(
                "Ressource Incompatible",
                "Veuillez sélectionner une autre ressource que 'ping' pour démarrer la Collecte.",
                'error'
            );
            return;
        }
        handleCollect(false);
    };

    const stopCollection = () => {
        setIsCollecting(false);
    };

    const saveToDatabase = () => {
        if (selectedItems.length === 0) {
            showAlert(
                "Sélection Requise",
                'Veuillez sélectionner au moins un équipement à sauvegarder.',
                'warning'
            );
            return;
        }
        // Logique de sauvegarde
        // ...
        showAlert(
            "Sauvegarde Réussie",
            `${selectedItems.length} équipement(s) sauvegardé(s) dans la base de données (Simulation).`,
            'success'
        );
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = (data) => {
        setSelectedItems(data.map(item => item.id));
    };

    const deselectAll = () => {
        setSelectedItems([]);
    };

    // Fonctions d'aide (inchangées)
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
            {/* ... En-tête avec statistiques (inchangé) ... */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className=" bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
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
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Actif</p>
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
                            <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-5">
                                {/* Filtre Client (Obligatoire) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client *
                                    </label>
                                    <select
                                        value={selectedClient}
                                        onChange={(e) => setSelectedClient(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        disabled={isCollecting}
                                    >
                                        <option value="all">-- Choisir un client --</option>
                                        {mockClients.map(client => (
                                            <option key={client.id} value={client.id}>{client.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Filtre Site (Obligatoire) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site *
                                    </label>
                                    <select
                                        value={selectedSite}
                                        onChange={(e) => setSelectedSite(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        disabled={isCollecting || selectedClient === 'all'}
                                    >
                                        <option value="all">-- Choisir un site --</option>
                                        {sitesFilteredByClient.map(site => (
                                            <option key={site.id} value={site.name}>{site.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre Type d'équipement */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type d'équipement
                                    </label>
                                    <select
                                        value={selectedEquipmentType}
                                        onChange={(e) => {
                                            setSelectedEquipmentType(e.target.value);
                                            // Réinitialiser la marque si le type n'est plus UPS
                                            if(e.target.value !== 'ups') setSelectedMarque('all');
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        disabled={isCollecting}
                                    >
                                        {equipmentTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre Marque (Obligatoire si UPS) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Marque {isEquipmentTypeUPS ? '*' : '(optionnel)'}
                                    </label>
                                    <select
                                        value={selectedMarque}
                                        onChange={(e) => setSelectedMarque(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        disabled={isCollecting || (isEquipmentTypeUPS && selectedEquipmentType !== 'ups')}
                                    >
                                        <option value="all">{isEquipmentTypeUPS ? '-- Choisir une marque --' : 'Toutes les marques'}</option>
                                        {marquesTypes.filter(m => m.id !== 'all').map(marque => (
                                            <option key={marque.id} value={marque.name}>{marque.name}</option>
                                        ))}
                                    </select>
                                    {isEquipmentTypeUPS && selectedMarque === 'all' && <p className='text-xs text-red-500 mt-1'>Choix de marque obligatoire pour UPS.</p>}
                                </div>

                                {/* Filtre Ressource Name (Obligatoire) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ressources Name *
                                    </label>
                                    <select
                                        value={selectedResourceName}
                                        onChange={(e) => setSelectedResourceName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        disabled={isCollecting}
                                    >
                                        <option value="all">-- Choisir une ressource --</option>
                                        {RessourcesName.map(r => (
                                            <option key={r.id} value={r.name}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Boutons d'action Collecte / Ping */}
                            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="w-full">
                                 
                                        <button
                                            onClick={handleStartCollecte}
                                            disabled={isStartDisabled}
                                            className={`w-full text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                                                isStartDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700'
                                            }`}
                                        >
                                            {isCollecting ? <FaSpinner className='animate-spin' /> : <FaPlay />} Démarrer la Collecte
                                        </button>
                                  

                                   
                                </div>
                                          
                                         
                                  <div className='w-full'>
                                                    <button
                                            onClick={handleStartPing}
                                            disabled={isStartDisabled}
                                            className={`w-full text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                                                isStartDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700'
                                            }`}
                                        >
                                            {isCollecting ? <FaSpinner className='animate-spin' /> : <FaSignal />} Démarrer le Ping
                                        </button>
                                          </div>
                                <div className="w-full">
                                    {isCollecting && (
                                        <button
                                            onClick={stopCollection}
                                            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <FaStop /> Arrêter la collecte
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Liste des collectes - NOUVEAU COMPOSANT/PROPS */}
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
                isPingMode={selectedResourceName === 'ping'}
            />

            <AlertDialog
    title={alertTitle}
    message={alertMessage}
    isOpen={isAlertOpen}
    onClose={closeAlert}
    type={alertType}
/>
        </div>
    );
};

export default CollectePage;