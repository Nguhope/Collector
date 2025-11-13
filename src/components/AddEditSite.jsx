/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion as m } from "framer-motion";
import { Save } from "lucide-react";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function AddEditSite({ onSave, onCancel, site = null }) {
  // Site form state
  const [siteName, setSiteName] = useState("");
  const [clientName, setClientName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState({});

  // Simulated registered clients (replace later with API fetch)
  const registeredClients = [
    { id: 1, name: "MTN Cameroon" },
    { id: 2, name: "Orange Cameroon" },
    { id: 3, name: "Nexttel" },
    { id: 4, name: "Camtel" },
  ];

  // Validation
  const validateForm = () => {
    const requiredFields = { siteName, clientName, latitude, longitude, address };
    const newTouched = Object.keys(requiredFields).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(newTouched);
    return Object.values(requiredFields).every((value) => value.trim());
  };

  // Prefill when editing
  useEffect(() => {
    if (site) {
      setSiteName(site.name || "");
      setClientName(site.client?.name || "");
      setLatitude(site.latitude || "");
      setLongitude(site.longitude || "");
      setAddress(site.address || "");
      setDescription(site.description || "");
    } else {
      setSiteName("");
      setClientName("");
      setLatitude("");
      setLongitude("");
      setAddress("");
      setDescription("");
    }
  }, [site]);

  // Save handler
  const handleSave = () => {
    if (!validateForm()) return;

    const payload = {
      name: siteName,
      client: { name: clientName },
      latitude,
      longitude,
      address,
      description,
      timestamp: new Date().toISOString(),
      status: "active",
    };

    if (site?.id) payload.id = site.id;
    onSave(payload);
  };

  return (
    <m.div
      className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={modalVariants}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add / Edit Site
      </h2>

      {/* SITE INFO FORM */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Site Name */}
        <div>
          <input
            type="text"
            placeholder="Site Name*"
            className={`w-full border rounded-lg px-3 py-2 text-sm transition ${
              touched?.siteName && !siteName
                ? "border-red-500 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            } focus:outline-none`}
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            onBlur={() => setTouched({ ...touched, siteName: true })}
          />
          {touched?.siteName && !siteName && (
            <p className="mt-1 text-xs text-red-500">Site name is required</p>
          )}
        </div>

        {/* Client Selection */}
        <div>
          <select
            className={`w-full border rounded-lg px-3 py-2 text-sm transition ${
              touched?.clientName && !clientName
                ? "border-red-500 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            } focus:outline-none`}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            onBlur={() => setTouched({ ...touched, clientName: true })}
          >
            <option value="">Select Client*</option>
            {registeredClients.map((client) => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
          {touched?.clientName && !clientName && (
            <p className="mt-1 text-xs text-red-500">Client name is required</p>
          )}
        </div>

        {/* Latitude */}
        <div>
          <input
            type="text"
            placeholder="Latitude*"
            className={`w-full border rounded-lg px-3 py-2 text-sm transition ${
              touched?.latitude && !latitude
                ? "border-red-500 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            } focus:outline-none`}
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            onBlur={() => setTouched({ ...touched, latitude: true })}
          />
          {touched?.latitude && !latitude && (
            <p className="mt-1 text-xs text-red-500">Latitude is required</p>
          )}
        </div>

        {/* Longitude */}
        <div>
          <input
            type="text"
            placeholder="Longitude*"
            className={`w-full border rounded-lg px-3 py-2 text-sm transition ${
              touched?.longitude && !longitude
                ? "border-red-500 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            } focus:outline-none`}
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            onBlur={() => setTouched({ ...touched, longitude: true })}
          />
          {touched?.longitude && !longitude && (
            <p className="mt-1 text-xs text-red-500">Longitude is required</p>
          )}
        </div>

        {/* Address */}
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Address*"
            className={`w-full border rounded-lg px-3 py-2 text-sm transition ${
              touched?.address && !address
                ? "border-red-500 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-400"
            } focus:outline-none`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setTouched({ ...touched, address: true })}
          />
          {touched?.address && !address && (
            <p className="mt-1 text-xs text-red-500">Address is required</p>
          )}
        </div>

        {/* Description */}
        <div className="col-span-2">
          <textarea
            placeholder="Description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <Save className="w-4 h-4" /> Save Site
        </button>
      </div>
    </m.div>
  );
}
