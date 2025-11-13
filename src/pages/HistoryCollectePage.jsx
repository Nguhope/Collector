import React, { useState, useMemo } from 'react';
import { Trash2, Eye, Calendar, Clock, MapPin, Building2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { FaEye, FaSearch, FaTrash } from 'react-icons/fa';

const HistoryCollectePage = () => {
  // Données de démonstration
  const mockCollects = [
    {
      collect_id: "b4f607d5-09c6-47b9-999d-e2ab2cbcc9b7",
      actor_id: "lucrece tankoua",
      job_id: "71ba42fc-4f87-4689-8c31-a1662937a973",
      resource: "ping",
      client: {
        nom: "BICEC Bank",
        code: 984,
        status: "Activated",
        client_id: "48f41668-650f-4179-9a8e-a00945bda333"
      },
      sites: [{ name: "YASSA", site_id: "22e308e7-4869-484d-bd86-233f5c4816c5", latitude: 48.56, longitude: 27.45 }],
      collect_type: "schedule",
      description: "test de programmation de collecte de ping",
      debut: "2025-09-11T18:00:00",
      fin: "2025-09-11T19:00:00",
      status: "pending"
    },
    {
      collect_id: "a3e507c4-08b5-46a8-888c-d1ab1cabc8a6",
      actor_id: "marie dupont",
      job_id: "82ca53ed-5f98-5790-9d42-b2773048e084",
      resource: "bandwidth",
      client: {
        nom: "Orange Cameroun",
        code: 123,
        status: "Activated",
        client_id: "59f52779-761g-5280-0f9f-b11056ceb444"
      },
      sites: [{ name: "Bonaberi", site_id: "33f419f8-5970-595e-ce97-344g6d5927d6", latitude: 4.05, longitude: 9.70 }],
      collect_type: "manual",
      description: "Collecte de données bandwidth",
      debut: "2025-08-15T10:00:00",
      fin: "2025-08-15T12:00:00",
      status: "completed"
    },
    {
      collect_id: "c5g718e6-10d7-58c0-000e-f3bc3dccda8-1",
      actor_id: "paul kamdem",
      job_id: "93db64fe-6g09-6801-0e53-c3884159f195",
      resource: "latency",
      client: {
        nom: "MTN Cameroon",
        code: 456,
        status: "Activated",
        client_id: "60g63880-872h-6391-1g0g-c22167def555"
      },
      sites: [{ name: "Akwa", site_id: "44g520g9-6081-606f-df08-455h7e6038e7", latitude: 4.06, longitude: 9.71 }],
      collect_type: "schedule",
      description: "Surveillance latence réseau",
      debut: "2025-07-20T14:00:00",
      fin: "2025-07-20T16:00:00",
      status: "failed"
    },
    {
      collect_id: "c5g718e6-10d7-58c0-000e-f3bc3dccda8-2",
      actor_id: "paul kamdem",
      job_id: "93db64fe-6g09-6801-0e53-c3884159f195",
      resource: "ping",
      client: {
        nom: "MTN Cameroon",
        code: 456,
        status: "Activated",
        client_id: "60g63880-872h-6391-1g0g-c22167def555"
      },
      sites: [{ name: "Akwa", site_id: "44g520g9-6081-606f-df08-455h7e6038e7", latitude: 4.06, longitude: 9.71 }],
      collect_type: "manual",
      description: "Surveillance ping réseau",
      debut: "2025-10-01T14:00:00",
      fin: "2025-10-01T16:00:00",
      status: "completed"
    },
    {
      collect_id: "d6h829f7-11e8-69d1-111f-g4cd4eccdb9",
      actor_id: "sophie martin",
      job_id: "a4ec75gf-7h10-7912-1f64-d499526ag2a6",
      resource: "bandwidth",
      client: {
        nom: "Express Union",
        code: 789,
        status: "Activated",
        client_id: "71h74991-983i-7402-2h1h-d33278heg666"
      },
      sites: [{ name: "Ndola", site_id: "55h631h0-7192-717g-eg19-566i8f7149f8", latitude: 3.99, longitude: 10.00 }],
      collect_type: "schedule",
      description: "Test de bande passante",
      debut: "2025-11-05T08:00:00",
      fin: "2025-11-05T09:00:00",
      status: "pending"
    }
  ];

  const [collects] = useState(mockCollects);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollect, setSelectedCollect] = useState(null);
  const itemsPerPage = 5;

  // 1. États pour les filtres
  const [resourceFilter, setResourceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState(''); // Format 'YYYY-MM-DD'
  const [endDateFilter, setEndDateFilter] = useState('');     // Format 'YYYY-MM-DD'

  // Récupération des options uniques pour les filtres
  const uniqueResources = [...new Set(collects.map(c => c.resource))];
  const uniqueTypes = [...new Set(collects.map(c => c.collect_type))];

  // 2. Logique de filtrage
  const filteredCollects = useMemo(() => {
    let filtered = collects;

    // Filtre par Ressource
    if (resourceFilter) {
      filtered = filtered.filter(collect => collect.resource === resourceFilter);
    }

    // Filtre par Type de Collecte
    if (typeFilter) {
      filtered = filtered.filter(collect => collect.collect_type === typeFilter);
    }

    // Filtre par Date de Début (>= startDateFilter)
    if (startDateFilter) {
      const startFilterTime = new Date(startDateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(collect => {
        const collectStartTime = new Date(collect.debut).getTime();
        return collectStartTime >= startFilterTime;
      });
    }

    // Filtre par Date de Fin (<= endDateFilter)
    if (endDateFilter) {
      // Pour inclure toute la journée, on met l'heure à 23:59:59
      const endFilterTime = new Date(endDateFilter).setHours(23, 59, 59, 999);
      filtered = filtered.filter(collect => {
        const collectEndTime = new Date(collect.fin).getTime();
        return collectEndTime <= endFilterTime;
      });
    }

    return filtered;
  }, [collects, resourceFilter, typeFilter, startDateFilter, endDateFilter]);

  // Réinitialiser la page courante lorsque les filtres changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredCollects]);

  // Calcul de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollects = filteredCollects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCollects.length / itemsPerPage);


  const handleDelete = (collectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette collecte ?')) {
      console.log('Suppression de la collecte:', collectId);
      // Logique de suppression ici
    }
  };

  const handleDetails = (collect) => {
    setSelectedCollect(collect);
  };

  const closeDetails = () => {
    setSelectedCollect(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Historique des Collectes</h1>
          <p className="text-slate-600">Gérez et consultez toutes vos collectes de données</p>
        </div>

        {/* --- Filtres de Recherche --- */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2"><Filter className="w-5 h-5" /> Filtres de Recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtre par Ressource */}
            <div>
              <label htmlFor="resourceFilter" className="block text-sm font-medium text-slate-700 mb-1">Ressource</label>
              <select
                id="resourceFilter"
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              >
                <option value="">Toutes les ressources</option>
                {uniqueResources.map(resource => (
                  <option key={resource} value={resource}>{resource.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Filtre par Type */}
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-slate-700 mb-1">Type de Collecte</label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              >
                <option value="">Tous les types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Filtre Date de Début */}
            <div>
              <label htmlFor="startDateFilter" className="block text-sm font-medium text-slate-700 mb-1">Date de Début (Min)</label>
              <input
                type="date"
                id="startDateFilter"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* Filtre Date de Fin */}
            <div>
              <label htmlFor="endDateFilter" className="block text-sm font-medium text-slate-700 mb-1">Date de Fin (Max)</label>
              <input
                type="date"
                id="endDateFilter"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>
        </div>
        {/* --- Fin des Filtres de Recherche --- */}

        {/* Tableau des collectes */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Site</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ressource</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCollects.length > 0 ? (
                  currentCollects.map((collect) => (
                    <tr key={collect.collect_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900">{collect.client.nom}</div>
                            <div className="text-xs text-slate-500">Code: {collect.client.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{collect.sites[0]?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {collect.resource}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700 capitalize">{collect.collect_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(collect.debut)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(collect.debut)} - {formatTime(collect.fin)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collect.status)}`}>
                          {getStatusText(collect.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDetails(collect)}
                            className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-105 shadow-sm hover:shadow-md"
                            title="Voir les détails"
                          >
                            <FaSearch className="w-5 h-5" />
                            <span>Détails</span>
                          </button>

                          <button
                            onClick={() => handleDelete(collect.collect_id)}
                            className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-105 shadow-sm hover:shadow-md"
                            title="Supprimer cet élément"
                          >
                            <FaTrash className="w-5 h-5" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                      Aucune collecte trouvée pour les critères de recherche spécifiés.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCollects.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredCollects.length)} sur {filteredCollects.length} collectes (filtrées)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white'
                          : 'hover:bg-white border border-slate-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails (inchangé) */}
      {selectedCollect && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Détails de la Collecte</h2>
              <button
                onClick={closeDetails}
                className="text-white hover:bg-slate-700 rounded-lg p-2 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-slate-800">Informations Générales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">ID Collecte</p>
                    <p className="font-mono text-sm text-slate-800">{selectedCollect.collect_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Acteur</p>
                    <p className="text-slate-800">{selectedCollect.actor_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Ressource</p>
                    <p className="text-slate-800 capitalize">{selectedCollect.resource}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Type de Collecte</p>
                    <p className="text-slate-800 capitalize">{selectedCollect.collect_type}</p>
                  </div>
                </div>
              </div>

              {/* Client */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-slate-800">Client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Nom</p>
                    <p className="text-slate-800 font-medium">{selectedCollect.client.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Code</p>
                    <p className="text-slate-800">{selectedCollect.client.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Statut</p>
                    <p className="text-slate-800">{selectedCollect.client.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">ID Client</p>
                    <p className="font-mono text-xs text-slate-800">{selectedCollect.client.client_id}</p>
                  </div>
                </div>
              </div>

              {/* Sites */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-slate-800">Sites</h3>
                {selectedCollect.sites.map((site, index) => (
                  <div key={site.site_id} className="mb-3 last:mb-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Nom du Site</p>
                        <p className="text-slate-800 font-medium">{site.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Coordonnées</p>
                        <p className="text-slate-800">{site.latitude}, {site.longitude}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Planning */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-slate-800">Planning</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Date de Début</p>
                    <p className="text-slate-800">{formatDate(selectedCollect.debut)} à {formatTime(selectedCollect.debut)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date de Fin</p>
                    <p className="text-slate-800">{formatDate(selectedCollect.fin)} à {formatTime(selectedCollect.fin)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-500">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedCollect.status)}`}>
                      {getStatusText(selectedCollect.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 text-slate-800">Description</h3>
                <p className="text-slate-700">{selectedCollect.description}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeDetails}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => handleDelete(selectedCollect.collect_id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCollectePage;