/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaEye,
} from "react-icons/fa";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({ nom: "", code: "" });

  //pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;

  //pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 🌀 Load Clients (Simulation)
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockClients = [
        {
          client_id: "1",
          nom: "CAMTEL",
          code: 101,
          sites: 5,
          equipements: 45,
          status: "actif",
          timestamp: "2025-01-15T10:30:00Z",
        },
        {
          client_id: "2",
          nom: "MTN Cameroon",
          code: 102,
          sites: 8,
          equipements: 72,
          status: "actif",
          timestamp: "2025-02-20T14:15:00Z",
        },
        {
          client_id: "3",
          nom: "Orange Cameroun",
          code: 103,
          sites: 6,
          equipements: 58,
          status: "inactif",
          timestamp: "2025-03-10T09:45:00Z",
        },
        {
          client_id: "4",
          nom: "ENEO",
          code: 104,
          sites: 12,
          equipements: 95,
          status: "actif",
          timestamp: "2025-04-05T11:20:00Z",
        },
        {
          client_id: "5",
          nom: "CAMTEL",
          code: 101,
          sites: 5,
          equipements: 45,
          status: "actif",
          timestamp: "2025-01-15T10:30:00Z",
        },
        {
          client_id: "6",
          nom: "MTN Cameroon",
          code: 102,
          sites: 8,
          equipements: 72,
          status: "actif",
          timestamp: "2025-02-20T14:15:00Z",
        },
        {
          client_id: "7",
          nom: "Orange Cameroun",
          code: 103,
          sites: 6,
          equipements: 58,
          status: "inactif",
          timestamp: "2025-03-10T09:45:00Z",
        },
        {
          client_id: "8",
          nom: "ENEO",
          code: 104,
          sites: 12,
          equipements: 95,
          status: "actif",
          timestamp: "2025-04-05T11:20:00Z",
        },
      ];
      setClients(mockClients);
      setLoading(false);
    }, 1000);
  };

  // 🟢 Modal Management
  const handleOpenModal = (mode, client = null) => {
    setModalMode(mode);
    if (mode === "edit" && client) {
      setFormData({ nom: client.nom, code: client.code });
      setSelectedClient(client);
    } else {
      setFormData({ nom: "", code: "" });
      setSelectedClient(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ nom: "", code: "" });
    setSelectedClient(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newClient = {
        client_id: Date.now().toString(),
        nom: formData.nom,
        code: parseInt(formData.code),
        sites: 0,
        equipements: 0,
        status: "actif",
        timestamp: new Date().toISOString(),
      };
      setClients([...clients, newClient]);
    } else {
      const updatedClients = clients.map((client) =>
        client.client_id === selectedClient.client_id
          ? { ...client, nom: formData.nom, code: parseInt(formData.code) }
          : client
      );
      setClients(updatedClients);
    }
    handleCloseModal();
  };

  // 🧨 Delete with confirmation modal
  const confirmDeleteClient = () => {
    if (confirmDelete) {
      setClients((prev) =>
        prev.filter((c) => c.client_id !== confirmDelete.client_id)
      );
      setConfirmDelete(null);
    }
  };

  const handleDelete = (client) => {
    setConfirmDelete(client);
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  // Filtering logic
  const filteredClients = clients.filter((client) => {
    const matchSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toString().includes(searchTerm);
    const matchStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 📊 Stats
  const stats = {
    totalClients: clients.length,
    totalSites: clients.reduce((sum, c) => sum + c.sites, 0),
    totalEquipements: clients.reduce((sum, c) => sum + c.equipements, 0),
    clientsActifs: clients.filter((c) => c.status === "actif").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Clients</h1>
            <p className="text-white/90">
              Vue d'ensemble et administration des clients
            </p>
          </div>
          <FaUsers size={60} className="opacity-20" />
        </div>
      </motion.div>

      {/* Search, Filter & Add Button Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <input
          type="text"
          placeholder="Rechercher par Nom ou Code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-400 rounded focus:ring-2 focus:ring-green-500 focus:outline-none transition"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">Tous statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal("add")}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
        >
          <FaPlus /> Nouveau Client
        </motion.button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Liste des Clients</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-gray-500 mt-4">Chargement des clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun client trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Client",
                    "Code",
                    "Sites",
                    "Équipements",
                    "Statut",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentClients.map((client, index) => (
                  <motion.tr
                    key={client.client_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-green-100 rounded-lg flex items-center justify-center">
                          <FaBuilding className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {client.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            Créé le{" "}
                            {new Date(client.timestamp).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        {client.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span className="font-bold text-gray-800">
                          {client.sites}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FaServer className="text-cyan-500" />
                        <span className="font-bold text-gray-800">
                          {client.equipements}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          client.status === "actif"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          icon={<FaEye />}
                          color="blue"
                          tooltip="Voir détails"
                          onClick={() => handleViewDetails(client)}
                        />
                        <IconButton
                          icon={<FaEdit />}
                          color="yellow"
                          tooltip="Modifier"
                          onClick={() => handleOpenModal("edit", client)}
                        />
                        <IconButton
                          icon={<FaTrash />}
                          color="red"
                          tooltip="Supprimer"
                          onClick={() => handleDelete(client)}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-blue-600 border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  Précédent
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-blue-600 border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 🟩 Add/Edit Modal */}
      <AddEditModal
        show={showModal}
        mode={modalMode}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />

      {/* 👁️ View Details Modal */}
      <ViewModal
        show={showDetails}
        client={selectedClient}
        onClose={() => setShowDetails(false)}
      />

      {/* 🧨 Countdown Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
            >
              <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirmation de suppression
              </h3>
              <p className="text-gray-600 mb-6">
                Vous êtes sur le point de supprimer{" "}
                <span className="font-semibold text-red-600">
                  {confirmDelete.nom}
                </span>
                .<br />
                Cette action est irréversible.
              </p>
              <CountdownDeleteButton
                onCancel={() => setConfirmDelete(null)}
                onConfirm={confirmDeleteClient}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 🧱 Small Components
const StatCard = ({ icon: Icon, color, title, value }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-xl p-6 shadow-lg"
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-12 h-12 bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-lg flex items-center justify-center`}
      >
        <Icon className={`text-${color}-600 text-xl`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{title}</p>
      </div>
    </div>
  </motion.div>
);

const IconButton = ({ icon, color, tooltip, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`p-2 bg-${color}-100 text-${color}-600 rounded-lg hover:bg-${color}-200 transition`}
    title={tooltip}
  >
    {icon}
  </motion.button>
);

// 🧭 Countdown Delete Button
const CountdownDeleteButton = ({ onCancel, onConfirm }) => {
  const [count, setCount] = useState(5);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer =
      count > 0
        ? setTimeout(() => setCount((c) => c - 1), 1000)
        : setActive(true);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="flex justify-center gap-3 items-center">
      <button
        onClick={onCancel}
        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
      >
        Annuler
      </button>

      <button
        onClick={active ? onConfirm : null}
        disabled={!active}
        className={`px-4 py-2 rounded-lg text-white transition-all shadow-lg ${
          active
            ? "bg-gradient-to-r from-blue-600 to-green-600 hover:shadow-xl"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {active ? "Supprimer" : `Actif dans ${count}s`}
      </button>
    </div>
  );
};

// 🧩 Add/Edit Modal
const AddEditModal = ({
  show,
  mode,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
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
              {mode === "add" ? "Nouveau Client" : "Modifier Client"}
            </h2>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du client *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 101"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <FaTimes /> Annuler
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition"
              >
                <FaSave /> {mode === "add" ? "Créer" : "Modifier"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// 👁️ View Details Modal
const ViewModal = ({ show, client, onClose }) => (
  <AnimatePresence>
    {show && client && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
            <h2 className="text-2xl font-bold">{client.nom}</h2>
            <p className="text-white/90">Informations détaillées</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InfoCard title="Code Client" value={client.code} />
              <InfoCard
                title="Statut"
                value={client.status}
                color={client.status === "actif" ? "green" : "red"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatBox
                icon={FaBuilding}
                label="Nombre de Sites"
                value={client.sites}
              />
              <StatBox
                icon={FaServer}
                label="Équipements"
                value={client.equipements}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date de création:</span>{" "}
                {new Date(client.timestamp).toLocaleString("fr-FR", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
            >
              Fermer
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const InfoCard = ({ title, value, color }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    {color ? (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-700`}
      >
        {value}
      </span>
    ) : (
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    )}
  </div>
);

// eslint-disable-next-line no-unused-vars
const StatBox = ({ icon: Icon, label, value }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-center gap-3 mb-2">
      <Icon className="text-blue-600 text-xl" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

export default ClientsPage;
