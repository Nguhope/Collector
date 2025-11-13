import React, { useState, useMemo } from "react";
import {
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Building2,
} from "lucide-react";
import StatsCard from "../components/StatsCards.jsx";
import SiteList from "../components/SiteList.jsx";
import AddEditSite from "../components/AddEditSite.jsx";
import { sampleSites } from "../data/sampleSite.js";

export default function SitePage() {
  const [sites, setSites] = useState(sampleSites);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 6;

  const HeaderSection = () => (
    <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-xl p-6 flex justify-between items-center shadow-md">
      <div>
        <h2 className="text-2xl font-bold">Gestion des Sites</h2>
        <p className="text-sm opacity-90">
          Supervision et administration des emplacements
        </p>
      </div>
      <Building2 className="w-12 h-12 opacity-20" />
    </div>
  );

  // ✅ Filtering logic
  const filteredSites = useMemo(() => {
    return sites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === "all" || site.status === statusFilter)
    );
  }, [sites, searchQuery, statusFilter]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredSites.length / sitesPerPage);
  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ✅ Compute Stats dynamically
  const filteredStats = useMemo(() => {
    const totalEquip = filteredSites.reduce(
      (sum, s) => sum + (s.equipments?.length || 0),
      0
    );
    const activeEquip = filteredSites.reduce(
      (sum, s) =>
        sum + (s.equipments?.filter((e) => e.status === "active").length || 0),
      0
    );
    const inactiveEquip = totalEquip - activeEquip;
    return { totalEquip, activeEquip, inactiveEquip };
  }, [filteredSites]);

  // ✅ Handlers
  const handleSaveSite = (newSite) => {
    setSites((prev) => {
      const exists = prev.find((s) => s.id === newSite.id);
      return exists
        ? prev.map((s) => (s.id === newSite.id ? newSite : s))
        : [...prev, { ...newSite, id: Date.now() }];
    });
    setShowAddSiteModal(false);
    setSelectedSite(null);
  };

  const handleDeleteSite = (id) => {
    setSites((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      {/* 🔹 Gradient Header */}
      <HeaderSection />

      {/* 🔹 Search + Filter + Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
        <input
          type="text"
          placeholder="🔍 Rechercher un site..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="warning">Alertes</option>
        </select>

        <button
          onClick={() => setShowAddSiteModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter un site
        </button>
      </div>

      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Sites" value={filteredSites.length} icon={MapPin} color="blue" />
        <StatsCard title="Actifs" value={filteredStats.activeEquip} icon={CheckCircle} color="green" />
        <StatsCard title="Inactifs" value={filteredStats.inactiveEquip} icon={XCircle} color="red" />
        <StatsCard title="Total Équipements" value={filteredStats.totalEquip} icon={AlertTriangle} color="cyan" />
      </div>

      {/* 🔹 Site List */}
      <SiteList
        sites={currentSites}
        onDelete={handleDeleteSite}
        onEdit={(s) => {
          setSelectedSite(s);
          setShowAddSiteModal(true);
        }}
      />

      {/* 🔹 Pagination Controls (Same design as ClientPage.jsx) */}
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

      {/* 🔹 Modal */}
      {showAddSiteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            <AddEditSite
              site={selectedSite}
              onCancel={() => {
                setShowAddSiteModal(false);
                setSelectedSite(null);
              }}
              onSave={(site) => handleSaveSite(site)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
