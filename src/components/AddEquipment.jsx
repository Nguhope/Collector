/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSave,
  FaTimes,
  FaEye,
  FaMapMarkerAlt,
  FaServer,
  FaMicrochip,
  FaWifi,
  FaUser,
  FaKey,
  FaInfoCircle,
  FaLink,
} from "react-icons/fa";

const AddEquipment = ({
  showModal,
  handleCloseModal,
  handleSubmit,
  formData,
  setFormData,
  modalMode = "add", // "add" | "edit" | "view"
}) => {
  const isView = modalMode === "view";
  const isEdit = modalMode === "edit";

  const clients = [
    { id: "1", name: "Site A" },
    { id: "2", name: "Site B" },
    { id: "3", name: "Site C" },
  ];

  const title =
    modalMode === "add"
      ? "Nouvel Équipement"
      : modalMode === "edit"
      ? "Modifier Équipement"
      : "Détails de l'Équipement";

  const fieldIcons = {
    ip: <FaWifi className="text-blue-500" />,
    site_id: <FaMapMarkerAlt className="text-green-600" />,
    marque: <FaServer className="text-indigo-500" />,
    sources: <FaLink className="text-cyan-500" />,
    username: <FaUser className="text-amber-500" />,
    password: <FaKey className="text-rose-500" />,
    modele: <FaMicrochip className="text-purple-500" />,
    description: <FaInfoCircle className="text-gray-500" />,
  };

  const fields = [
    { label: "Adresse IP", key: "ip", placeholder: "Adresse IP" },
    { label: "Site associé", key: "site_id", type: "select" },
    { label: "Marque", key: "marque", placeholder: "Marque" },
    { label: "Sources", key: "sources", placeholder: "Sources" },
    {
      label: "Nom d'utilisateur",
      key: "username",
      placeholder: "Nom d'utilisateur",
    },
    {
      label: "Mot de passe",
      key: "password",
      placeholder: "Mot de passe",
      type: "password",
    },
    { label: "Modèle", key: "modele", placeholder: "Modèle" },
  ];

  return (
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
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
          >
            {/* HEADER */}
            <div
              className={`p-6 text-white ${
                isView
                  ? "bg-gradient-to-r from-blue-700 to-green-600"
                  : "bg-gradient-to-r from-green-600 to-blue-600"
              }`}
            >
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {isView && <FaEye className="text-white/90" />}
                {title}
              </h2>
            </div>

            {/* BODY */}
            <div className="p-6">
              {isView ? (
                // VIEW MODE DESIGN
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="flex items-start gap-3 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="mt-1">{fieldIcons[field.key]}</div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          {field.label}
                        </p>
                        <p className="font-semibold text-gray-800 mt-1">
                          {formData[field.key] || "—"}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Description full width */}
                  <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{fieldIcons.description}</div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          Description
                        </p>
                        <p className="text-gray-800 mt-1 leading-relaxed">
                          {formData.description || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // FORM MODE DESIGN (add/edit)
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} *
                      </label>

                      {field.type === "select" ? (
                        <select
                          value={formData[field.key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="">-- Sélectionner un site --</option>
                          {clients.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          value={formData[field.key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                          placeholder={field.placeholder}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      )}
                    </div>
                  ))}

                  {/* Description full width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Brève description"
                    ></textarea>
                  </div>

                  {/* BUTTONS */}
                  <div className="md:col-span-2 flex gap-3 pt-2">
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
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      {isEdit ? "Mettre à jour" : "Créer"}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>

            {/* FOOTER FOR VIEW MODE */}
            {isView && (
              <div className="p-5 border-t border-gray-100 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg font-medium shadow hover:shadow-md transition-all"
                >
                  Fermer
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEquipment;
