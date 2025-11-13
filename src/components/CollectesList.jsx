import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaDatabase, 
    FaCheckCircle, 
    FaExclamationTriangle,
    FaTimesCircle,
    FaSpinner,
    FaDownload,
    FaWifi,
    FaSearch,
    FaAngleLeft,
    FaAngleRight,
} from 'react-icons/fa';
import { Mail, Briefcase, MapPin } from 'lucide-react'; // Ajout d'icônes Luide

// Fonction d'aide pour formatter les données en CSV et déclencher le téléchargement
const exportToCSV = (data, fileName) => {
    if (data.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const headers = [
        "ID", "Nom", "Type", "Marque", "Adresse IP", "Client", "Site", 
        "Statut", "Accessible", "État Collecte", "Dernière Mise à Jour", "Collecté à"
    ];
    
    // Simplification des données pour l'export
    const csvData = data.map(item => ({
        ID: item.id,
        Nom: item.name,
        Type: item.type,
        Marque: item.marque,
        "Adresse IP": item.address,
        Client: item.clientName,
        Site: item.site,
        Statut: item.status,
        Accessible: item.accessible ? 'Oui' : 'Non',
        "État Collecte": item.collectedStatus ? 'Oui' : 'Non',
        "Dernière Mise à Jour": item.lastUpdate,
        "Collecté à": item.collectedAt,
    }));

    // Création du contenu CSV
    const csvContent = [
        headers.join(';'),
        ...csvData.map(row => headers.map(header => row[header]).join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


const CollectesList = ({
    equipmentData = [],
    isLoading = false,
    progress = 0,
    selectedItems = [],
    toggleSelectItem,
    selectAll: selectAllProp, // Renommé pour éviter le conflit
    deselectAll,
    saveToDatabase,
    getStatusBadge,
    getEquipmentIcon,
    isPingMode = false
}) => {
    // --- États pour la recherche et la pagination ---
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // ------------------------------------------------

    // Fonction pour afficher Oui/Non dans la colonne État-Collecte
    const getCollectionStatusDisplay = (collectedStatus) => {
        return collectedStatus ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                <FaCheckCircle /> Oui
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                <FaTimesCircle /> Non
            </span>
        );
    };

    // --- LOGIQUE DE RECHERCHE ET FILTRAGE DU TABLEAU ---
    const filteredAndSearchedData = useMemo(() => {
        let computedData = [...equipmentData];
        const lowerCaseSearch = searchTerm.toLowerCase();

        if (searchTerm) {
            computedData = computedData.filter(item => 
                item.name.toLowerCase().includes(lowerCaseSearch) ||
                item.address.toLowerCase().includes(lowerCaseSearch) ||
                item.clientName.toLowerCase().includes(lowerCaseSearch) ||
                item.site.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // Réinitialiser la pagination si les données changent
        setCurrentPage(1); 
        return computedData;
    }, [equipmentData, searchTerm]);
    
    // --- PAGINATION ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredAndSearchedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAndSearchedData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    // ------------------
    
    // Fonction d'appel pour l'export
    const handleExport = () => {
        const resourceName = isPingMode ? 'ping' : 'collecte';
        exportToCSV(filteredAndSearchedData, `${resourceName}_export`);
    };

    return (
        <div className="space-y-6">
            {/* Barre de progression */}
            {isLoading && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                            {isPingMode ? 'Ping en cours...' : 'Collecte en cours...'}
                        </span>
                        <span className="text-sm font-bold text-green-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-green-500 to-cyan-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Résultats de la collecte */}
            {equipmentData.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                    {/* Barre d'action et de recherche */}
                    <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-grow max-w-sm relative">
                            <input
                                type="text"
                                placeholder="Rechercher équipement, IP, client ou site..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={() => selectAllProp(filteredAndSearchedData)}
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
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                            >
                                <FaDatabase /> Sauvegarder ({selectedItems.length})
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={filteredAndSearchedData.length === 0}
                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                                title="Exporter les données filtrées au format CSV"
                            >
                                <FaDownload /> Exporter CSV
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
                                            checked={selectedItems.length > 0 && selectedItems.length === filteredAndSearchedData.length}
                                            onChange={() => selectedItems.length === filteredAndSearchedData.length ? deselectAll() : selectAllProp(filteredAndSearchedData)}
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Équipement
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Site
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Adresse IP
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        État-Collecte
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Accessible
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dernière MAJ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentData.map((item, index) => {
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
                                                        <div className="text-xs text-gray-500 capitalize">{item.type} ({item.marque})</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                                    {item.clientName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    <MapPin className="w-4 h-4 text-orange-500" />
                                                    {item.site}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <FaWifi className="text-cyan-500" />
                                                    {item.address}
                                                </div>
                                            </td>
                                            {/* Colonne État-Collecte : Oui/Non */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getCollectionStatusDisplay(item.collectedStatus)}
                                            </td>
                                            {/* Colonne Accessible : Oui/Non */}
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
                                {currentData.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                            Aucun équipement trouvé avec ces critères de recherche.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Affichage de **{indexOfFirstItem + 1}** à **{Math.min(indexOfLastItem, filteredAndSearchedData.length)}** sur **{filteredAndSearchedData.length}** résultats.
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-200 transition-colors text-gray-700"
                            >
                                <FaAngleLeft className='w-4 h-4' />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => paginate(page)}
                                    className={`px-3 py-1 rounded-lg transition-colors font-medium text-sm ${
                                        currentPage === page
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'hover:bg-gray-200 border border-gray-300 text-gray-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-200 transition-colors text-gray-700"
                            >
                                <FaAngleRight className='w-4 h-4' />
                            </button>
                        </div>
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
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune donnée de collecte</h3>
                    <p className="text-gray-500">
                        Veuillez configurer et **démarrer le Ping** ou **la Collecte** pour afficher les résultats.
                    </p>
                    <p className='text-sm text-orange-500 mt-2'>
                        Les champs Client, Site, et Ressource Name sont obligatoires avant de commencer.
                    </p>
                </motion.div>
            )}
        </div>
    );
}

export default CollectesList;