/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import AddEquipment from "../components/AddEquipment";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCogs,
  FaEye,
  FaTimes,
  FaClock,
} from "react-icons/fa";

const EquipmentsPage = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentsPerPage = 5;

  const [formData, setFormData] = useState({
    ip: "",
    site_id: "",
    marque: "",
    sources: "",
    username: "",
    password: "",
    description: "",
    modele: "",
    status: "active",
  });

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setEquipments([
        {
          id: 1,
          ip: "192.168.1.10",
          site_id: "Site A",
          marque: "Cisco",
          sources: "SNMP",
          username: "admin",
          password: "••••••",
          description: "Capteur principal",
          modele: "XRT-200",
          status: "active",
          lastUpdate: "2025-10-31 14:32",
        },
        {
          id: 2,
          ip: "192.168.1.11",
          site_id: "Site B",
          marque: "Huawei",
          sources: "API REST",
          username: "root",
          password: "••••••",
          description: "Capteur secondaire",
          modele: "HP-900",
          status: "inactive",
          lastUpdate: "2025-10-31 14:40",
        },
        {
          id: 3,
          ip: "192.168.1.10",
          site_id: "Site A",
          marque: "Cisco",
          sources: "SNMP",
          username: "admin",
          password: "••••••",
          description: "Capteur principal",
          modele: "XRT-200",
          status: "active",
          lastUpdate: "2025-10-31 14:32",
        },
        {
          id: 4,
          ip: "192.168.1.11",
          site_id: "Site B",
          marque: "Huawei",
          sources: "API REST",
          username: "root",
          password: "••••••",
          description: "Capteur secondaire",
          modele: "HP-900",
          status: "inactive",
          lastUpdate: "2025-10-31 14:40",
        },
         
        {
          id: 5,
          ip: "192.168.1.10",
          site_id: "Site A",
          marque: "Cisco",
          sources: "SNMP",
          username: "admin",
          password: "••••••",
          description: "Capteur principal",
          modele: "XRT-200",
          status: "active",
          lastUpdate: "2025-10-31 14:32",
        },
        {
          id: 6,
          ip: "192.168.1.11",
          site_id: "Site B",
          marque: "Huawei",
          sources: "API REST",
          username: "root",
          password: "••••••",
          description: "Capteur secondaire",
          modele: "HP-900",
          status: "inactive",
          lastUpdate: "2025-10-31 14:40",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // Filtering equipments
  const filteredEquipments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return equipments.filter((eq) => {
      const matchesSearch =
        eq.ip.toLowerCase().includes(term) ||
        eq.marque.toLowerCase().includes(term) ||
        eq.modele.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" || eq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [equipments, searchTerm, statusFilter]);

  // ✅ Pagination logic
  const indexOfLastEquipment = currentPage * equipmentsPerPage;
  const indexOfFirstEquipment = indexOfLastEquipment - equipmentsPerPage;
  const currentEquipments = filteredEquipments.slice(
    indexOfFirstEquipment,
    indexOfLastEquipment
  );
  const totalPages = Math.ceil(filteredEquipments.length / equipmentsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  // ✅ Modal Logic
  const handleOpenModal = (mode, equipment = null) => {
    setModalMode(mode);
    if (equipment) {
      setSelectedEquipment(equipment);
      setFormData({ ...equipment });
    } else {
      setFormData({
        ip: "",
        site_id: "",
        marque: "",
        sources: "",
        username: "",
        password: "",
        description: "",
        modele: "",
        status: "active",
      });
      setSelectedEquipment(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEquipment(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newEquipment = {
        id: Date.now(),
        ...formData,
        lastUpdate: new Date().toLocaleString(),
      };
      setEquipments([...equipments, newEquipment]);
    } else if (modalMode === "edit" && selectedEquipment) {
      setEquipments(
        equipments.map((eq) =>
          eq.id === selectedEquipment.id ? { ...eq, ...formData } : eq
        )
      );
    }
    handleCloseModal();
  };

  // 🗑️ Delete Confirmation
  const handleDeleteRequest = (id) => {
    setDeleteId(id);
    setCountdown(5);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setEquipments(equipments.filter((eq) => eq.id !== deleteId));
    setShowDeleteModal(false);
  };

  // ⏳ Countdown timer
  useEffect(() => {
    if (!showDeleteModal) return;
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, showDeleteModal]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Équipements</h1>
            <p className="text-white/90">
              Surveillance et administration du matériel
            </p>
          </div>
          <FaCogs size={60} className="opacity-20" />
        </div>
      </motion.div>

      {/* SEARCH + FILTER + ADD */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher par IP, Marque ou Modèle"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
        >
          <option value="all">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal("add")}
          className="ml-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
        >
          <FaPlus />
          Nouvel Équipement
        </motion.button>
      </div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Liste des Équipements
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-gray-500 mt-4">Chargement des équipements...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["IP", "Marque", "Modèle", "Site", "Statut", "Actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence mode="wait">
                  {currentEquipments.length === 0 ? (
                    <motion.tr
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        Aucun équipement trouvé.
                      </td>
                    </motion.tr>
                  ) : (
                    currentEquipments.map((eq) => (
                      <motion.tr
                        key={eq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">{eq.ip}</td>
                        <td className="px-6 py-4">{eq.marque}</td>
                        <td className="px-6 py-4">{eq.modele}</td>
                        <td className="px-6 py-4 text-center">{eq.site_id}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              eq.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {eq.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal("view", eq)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal("edit", eq)}
                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                            title="Modifier"
                          >
                            <FaEdit />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteRequest(eq.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ✅ NEW PAGINATION CONTROLS */}
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

      {/* MODALS */}
      <AddEquipment
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        modalMode={modalMode}
        selectedEquipment={selectedEquipment}
      />

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
                <h2 className="text-xl font-bold">
                  Confirmation de suppression
                </h2>
              </div>

              <div className="p-6 space-y-5 text-center">
                <FaTrash className="text-red-500 text-4xl mx-auto mb-2" />
                <p className="text-gray-700 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer cet équipement ?<br />
                  Cette action est{" "}
                  <span className="font-semibold text-red-500">
                    irréversible
                  </span>
                  .
                </p>

                <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
                  <FaClock /> Attendez encore {countdown}s avant de confirmer.
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Annuler
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: countdown === 0 ? 1.05 : 1 }}
                    whileTap={{ scale: countdown === 0 ? 0.95 : 1 }}
                    disabled={countdown > 0}
                    onClick={handleConfirmDelete}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all ${
                      countdown > 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-red-700 hover:to-red-600 shadow-lg"
                    }`}
                  >
                    <FaTrash />
                    {countdown > 0 ? "Veuillez patienter..." : "Confirmer"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EquipmentsPage;

