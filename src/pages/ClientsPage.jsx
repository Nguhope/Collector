import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers,
  FaBuilding,
  FaServer,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaChartLine,
  FaEye
} from 'react-icons/fa';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    code: ''
  });

  // Simulation de chargement des données
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    // Simulation d'appel API
    setTimeout(() => {
      const mockClients = [
        {
          client_id: "1",
          nom: "CAMTEL",
          code: 101,
          sites: 5,
          equipements: 45,
          status: "actif",
          timestamp: "2025-01-15T10:30:00Z"
        },
        {
          client_id: "2",
          nom: "MTN Cameroon",
          code: 102,
          sites: 8,
          equipements: 72,
          status: "actif",
          timestamp: "2025-02-20T14:15:00Z"
        },
        {
          client_id: "3",
          nom: "Orange Cameroun",
          code: 103,
          sites: 6,
          equipements: 58,
          status: "actif",
          timestamp: "2025-03-10T09:45:00Z"
        },
        {
          client_id: "4",
          nom: "ENEO",
          code: 104,
          sites: 12,
          equipements: 95,
          status: "actif",
          timestamp: "2025-04-05T11:20:00Z"
        }
      ];
      setClients(mockClients);
      setLoading(false);
    }, 1000);
  };

  const handleOpenModal = (mode, client = null) => {
    setModalMode(mode);
    if (mode === 'edit' && client) {
      setFormData({
        nom: client.nom,
        code: client.code
      });
      setSelectedClient(client);
    } else {
      setFormData({ nom: '', code: '' });
      setSelectedClient(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ nom: '', code: '' });
    setSelectedClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Simulation POST /clients/register
      const newClient = {
        client_id: Date.now().toString(),
        nom: formData.nom,
        code: parseInt(formData.code),
        sites: 0,
        equipements: 0,
        status: "actif",
        timestamp: new Date().toISOString()
      };
      setClients([...clients, newClient]);
    } else {
      // Simulation PUT /clients/update
      const updatedClients = clients.map(client =>
        client.client_id === selectedClient.client_id
          ? { ...client, nom: formData.nom, code: parseInt(formData.code) }
          : client
      );
      setClients(updatedClients);
    }
    
    handleCloseModal();
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver ce client ?')) {
      // Simulation DELETE /clients/{client_id}
      setClients(clients.filter(client => client.client_id !== clientId));
    }
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  // Statistiques globales
  const stats = {
    totalClients: clients.length,
    totalSites: clients.reduce((sum, c) => sum + c.sites, 0),
    totalEquipements: clients.reduce((sum, c) => sum + c.equipements, 0),
    clientsActifs: clients.filter(c => c.status === 'actif').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Clients</h1>
            <p className="text-white/90">Vue d'ensemble et administration des clients</p>
          </div>
          <FaUsers size={60} className="opacity-20" />
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-200 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClients}</p>
              <p className="text-xs text-gray-500">Clients</p>
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
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg flex items-center justify-center">
              <FaServer className="text-cyan-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEquipements}</p>
              <p className="text-xs text-gray-500">Équipements</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.clientsActifs}</p>
              <p className="text-xs text-gray-500">Actifs</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bouton d'ajout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal('add')}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
        >
          <FaPlus />
          Nouveau Client
        </motion.button>
      </motion.div>

      {/* Liste des clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Liste des Clients</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
            <p className="text-gray-500 mt-4">Chargement des clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun client enregistré</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sites</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Équipements</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client, index) => (
                  <motion.tr
                    key={client.client_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-green-100 rounded-lg flex items-center justify-center">
                          <FaBuilding className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{client.nom}</p>
                          <p className="text-xs text-gray-500">
                            Créé le {new Date(client.timestamp).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {client.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500 text-sm" />
                        <span className="font-bold text-gray-800">{client.sites}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FaServer className="text-cyan-500 text-sm" />
                        <span className="font-bold text-gray-800">{client.equipements}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.status === 'actif' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(client)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Voir détails"
                        >
                          <FaEye />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenModal('edit', client)}
                          className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                          title="Modifier"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(client.client_id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal Ajout/Édition */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold">
                  {modalMode === 'add' ? 'Nouveau Client' : 'Modifier Client'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: CAMTEL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="number"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: 101"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FaTimes />
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    {modalMode === 'add' ? 'Créer' : 'Modifier'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Détails */}
      <AnimatePresence>
        {showDetails && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
                <h2 className="text-2xl font-bold">{selectedClient.nom}</h2>
                <p className="text-white/90">Informations détaillées</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Code Client</p>
                    <p className="text-2xl font-bold text-gray-800">{selectedClient.code}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedClient.status === 'actif' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBuilding className="text-blue-600 text-xl" />
                      <p className="text-sm text-gray-500">Nombre de Sites</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{selectedClient.sites}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaServer className="text-cyan-600 text-xl" />
                      <p className="text-sm text-gray-500">Équipements</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{selectedClient.equipements}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date de création:</span>{' '}
                    {new Date(selectedClient.timestamp).toLocaleString('fr-FR', {
                      dateStyle: 'long',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDetails(false)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientsPage;