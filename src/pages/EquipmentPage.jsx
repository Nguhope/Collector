/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import AddEquipment from "../components/AddEquipment";
import { motion, AnimatePresence } from "framer-motion";

import {
  useListEquipementsQuery,
  useDeleteEquipementMutation,
  useRegisterEquipementMutation,
  useUpdateEquipementMutation,
} from "../services/api/equipementsApi";

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
  /** UI STATE */
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /** BACKEND PAGINATION */
  const [page, setPage] = useState(1);
  const size = 10;

  /** API CALL */
  const {
    data: apiResponse,
    error,
    isLoading,
    refetch,
  } = useListEquipementsQuery({ page, size });

  /** MUTATIONS */
  const [deleteEquipement] = useDeleteEquipementMutation();
  const [updateEquipement] = useUpdateEquipementMutation();
  const [registerEquipement] = useRegisterEquipementMutation();

  /** MOCK DATA (fallback or merge preview) */
  const mockEquipments = [
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
      port: "8080",
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
      port: "9090",
      status: "inactive",
      lastUpdate: "2025-10-31 14:40",
    },
  ];

  /** TRANSFORM API RESPONSE TO MATCH UI SHAPE */
  const apiEquipments =
    apiResponse?.items?.map((eq) => ({
      id: eq.equipement_id,
      ip: eq.ip,
      marque: eq.marque,
      modele: eq.modele,
      sources: eq.sources?.join(", "),
      port: eq.port,
      username: eq.username,
      password: eq.password,
      description: eq.description,
      site_id: eq.client_site?.name || "—",
      status: "active",
      lastUpdate: eq.timestamp,
    })) || [];

  /** MERGE: API FIRST, fallback to mock if empty */
  const equipments = apiEquipments.length > 0 ? apiEquipments : mockEquipments;

  /** FILTERING */
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

  /** PAGINATION */
  const totalPages = apiResponse?.pages || 1;

  const handleOpenModal = (mode, equipment = null) => {
    setModalMode(mode);
    setSelectedEquipment(equipment || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEquipment(null);
  };

  /** SUBMIT (ADD or EDIT) — API + fallback mock mode */
  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      if (modalMode === "add") {
        await registerEquipement(formData).unwrap();
      } else if (modalMode === "edit") {
        await updateEquipement(formData).unwrap();
      }

      refetch();
      handleCloseModal();
    } catch (err) {
      console.error("API error:", err);
      alert("Erreur API — Les données mock sont affichées.");
    }
  };

  /** DELETE */
  const handleDeleteRequest = (id) => {
    setDeleteId(id);
    setCountdown(5);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEquipement(deleteId).unwrap();
      refetch();
    } catch (err) {
      console.log("Erreur API suppression:", err);
    }

    setShowDeleteModal(false);
  };

  /** COUNTDOWN */
  useEffect(() => {
    if (!showDeleteModal || countdown === 0) return;

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showDeleteModal, countdown]);

  /** UI */
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

      {/* SEARCH + ADD */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">Tous</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal("add")}
          className="ml-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <FaPlus /> Nouvel Équipement
        </motion.button>
      </div>

      {/* TABLE */}
      <motion.div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-500">Chargement...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">IP</th>
                  <th className="p-4">Marque</th>
                  <th className="p-4">Modèle</th>
                  <th className="p-4">Port</th>
                  <th className="p-4 text-center">Site</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                <AnimatePresence>
                  {filteredEquipments.map((eq) => (
                    <motion.tr
                      key={eq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <td className="p-4">{eq.ip}</td>
                      <td>{eq.marque}</td>
                      <td>{eq.modele}</td>
                      <td>{eq.port}</td>
                      <td className="text-center">{eq.site_id}</td>
                      <td className="text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            eq.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {eq.status}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal("view", eq)}
                            className="p-2 bg-blue-100 text-blue-600 rounded"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() => handleOpenModal("edit", eq)}
                            className="p-2 bg-yellow-100 text-yellow-600 rounded"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDeleteRequest(eq.id)}
                            className="p-2 bg-red-100 text-red-600 rounded"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 py-6">
        <button
          className="px-3 py-1 border rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Précédent
        </button>

        <span className="px-4 py-1">
          Page {page} / {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Suivant
        </button>
      </div>

      {/* MODAL ADD/EDIT/VIEW */}
      <AddEquipment
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        modalMode={modalMode}
        selectedEquipment={selectedEquipment}
        onSubmit={handleSubmit}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
                <h2 className="text-xl font-bold">
                  Confirmation de suppression
                </h2>
              </div>

              <div className="p-6 text-center">
                <FaTrash className="text-red-500 text-4xl mx-auto mb-3" />

                <p className="text-gray-700 mb-4">
                  Êtes-vous sûr de vouloir supprimer cet équipement ?
                  <br />
                  <span className="text-red-500 font-semibold">
                    Cette action est irréversible.
                  </span>
                </p>

                <div className="text-gray-500 flex justify-center items-center gap-2 text-sm mb-4">
                  <FaClock /> Attendez encore {countdown}s...
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border py-2 rounded"
                  >
                    Annuler
                  </button>

                  <button
                    disabled={countdown > 0}
                    onClick={handleConfirmDelete}
                    className={`flex-1 py-2 rounded text-white ${
                      countdown > 0
                        ? "bg-gray-400"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Confirmer
                  </button>
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

