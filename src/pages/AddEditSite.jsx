import React, { useState, useEffect } from "react";

export default function AddEditSite({ onClose, onSave, siteToEdit, equipmentTypes }) {
  // Site info state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");

  // Equipment items state (array of objects)
  const [equipments, setEquipments] = useState([
    { type: "", ip: "", status: "active", date: new Date().toISOString().slice(0, 16).replace("T", " ") },
  ]);

  // Populate fields if editing
  useEffect(() => {
    if (siteToEdit) {
      setName(siteToEdit.name);
      setAddress(siteToEdit.address);
      setManager(siteToEdit.manager);
      setPhone(siteToEdit.phone);
      setEquipments(
        siteToEdit.equipments?.map(e => ({
          type: e.type || "",
          ip: e.ip || "",
          status: e.status || "active",
          date: e.date || new Date().toISOString().slice(0, 16).replace("T", " "),
        })) || [{ type: "", ip: "", status: "active", date: new Date().toISOString().slice(0, 16).replace("T", " ") }]
      );
    }
  }, [siteToEdit]);

  // Handle adding a new equipment row
  const handleAddEquipment = () => {
    setEquipments([
      ...equipments,
      { type: "", ip: "", status: "active", date: new Date().toISOString().slice(0, 16).replace("T", " ") },
    ]);
  };

  // Handle removing an equipment row
  const handleRemoveEquipment = (index) => {
    const newEquipments = equipments.filter((_, i) => i !== index);
    setEquipments(newEquipments);
  };

  // Handle input change for equipment rows
  const handleEquipmentChange = (index, field, value) => {
    const newEquipments = [...equipments];
    newEquipments[index][field] = value;
    setEquipments(newEquipments);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !address || !manager || !phone) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Validate equipment items
    for (let i = 0; i < equipments.length; i++) {
      if (!equipments[i].type || !equipments[i].ip) {
        alert(`Veuillez remplir tous les champs pour l'équipement ${i + 1}`);
        return;
      }
    }

    const newSite = {
      id: siteToEdit ? siteToEdit.id : Date.now(),
      name,
      address,
      manager,
      phone,
      lastUpdate: new Date().toISOString().slice(0, 16).replace("T", " "),
      equipments,
    };

    onSave(newSite);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {siteToEdit ? "Modifier un Site" : "Ajouter un Site"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Site Info */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nom du Site</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Adresse</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Responsable</label>
          <input
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Téléphone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Equipment List */}
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Équipements</h3>

          {equipments.map((equip, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end">
              {/* Type */}
              <div className="col-span-4">
                <label className="block text-gray-700 font-medium mb-1">Type d'équipement</label>
                <select
                  value={equip.type}
                  onChange={(e) => handleEquipmentChange(index, "type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Sélectionner le type</option>
                  {equipmentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* IP Address */}
              <div className="col-span-4">
                <label className="block text-gray-700 font-medium mb-1">IP Address</label>
                <input
                  type="text"
                  value={equip.ip}
                  onChange={(e) => handleEquipmentChange(index, "ip", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Status */}
              <div className="col-span-3">
                <label className="block text-gray-700 font-medium mb-1">Statut</label>
                <select
                  value={equip.status}
                  onChange={(e) => handleEquipmentChange(index, "status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-end">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEquipment(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <button
            type="button"
            onClick={handleAddEquipment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Ajouter un équipement
          </button>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold hover:from-blue-600 hover:to-green-600 transition"
          >
            {siteToEdit ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
