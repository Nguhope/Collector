import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaStop, 
  FaFilter, 
  FaDatabase, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaTimesCircle,
  FaSpinner,
  FaDownload,
  FaEye,
  FaBolt,
  FaFire,
  FaShieldAlt,
  FaServer,
  FaMapMarkerAlt,
  FaClock,
  FaWifi,
  FaPlug
} from 'react-icons/fa';
import PlanificationList from '../components/PlanificationList';

const PlanificationPage = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'Collecte matinale - Site Principal',
      site: 'Site Principal - Yaoundé',
      equipmentType: 'all',
      startTime: '08:00',
      duration: 30,
      nextRun: '2025-11-03 08:00',
      isActive: true,
      frequency: 'daily'
    },
    {
      id: 2,
      name: 'Collecte après-midi - Datacenter',
      site: 'Datacenter - Kribi',
      equipmentType: 'ups',
      startTime: '14:00',
      duration: 15,
      nextRun: '2025-11-02 14:00',
      isActive: true,
      frequency: 'daily'
    },
  ]);

  const equipmentTypes = [
    { id: 'all', name: 'Tous les équipements', icon: <FaServer />, color: 'gray' },
    { id: 'ups', name: 'Onduleurs', icon: <FaBolt />, color: 'yellow' },
    { id: 'generator', name: 'Groupes électrogènes', icon: <FaPlug />, color: 'orange' },
    { id: 'fire', name: 'Détecteurs incendie', icon: <FaFire />, color: 'red' },
    { id: 'security', name: 'Systèmes de sécurité', icon: <FaShieldAlt />, color: 'blue' },
  ];

  const marquesTypes = [{id:'all', name : 'toutes les marques', icon: <FaEye />, color: 'gray' },
    {id:'all', name : ' marque &', icon: <FaEye />, color: 'gray' },
    {id:'marque 1', name : ' marque &', icon: <FaEye />, color: 'gray' },
    {id:'marque 2', name : ' marque &', icon: <FaEye />, color: 'gray' },
  ]
  
  // Données mockées pour la démonstration
  const mockSites = [
    { id: 1, name: 'Site Principal - Yaoundé' },
    { id: 2, name: 'Site Secondaire - Douala' },
    { id: 3, name: 'Datacenter - Kribi' },
  ];
  
  const mockEquipments = [
    { 
      id: 1, 
      name: 'UPS-001', 
      type: 'ups', 
      address: '192.168.1.10', 
      site: 'Site Principal - Yaoundé',
      status: 'online',
      accessible: true,
      lastUpdate: '2025-11-02 10:30:25'
    },
    { 
      id: 2, 
      name: 'GEN-001', 
      type: 'generator', 
      address: '192.168.1.20', 
      site: 'Site Principal - Yaoundé',
      status: 'online',
      accessible: true,
      lastUpdate: '2025-11-02 10:30:22'
    },
    { 
      id: 3, 
      name: 'FIRE-DET-001', 
      type: 'fire', 
      address: '192.168.1.30', 
      site: 'Site Secondaire - Douala',
      status: 'warning',
      accessible: true,
      lastUpdate: '2025-11-02 10:29:45'
    },
    { 
      id: 4, 
      name: 'UPS-002', 
      type: 'ups', 
      address: '192.168.2.10', 
      site: 'Datacenter - Kribi',
      status: 'offline',
      accessible: false,
      lastUpdate: '2025-11-02 09:15:12'
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    site: 'all',
    equipmentType: 'all',
    marqueType: 'all',
    startTime: '',
    duration: 30,
    frequency: 'daily',
    isActive: true
  });

  const frequencies = [
    { value: 'once', label: 'Une seule fois' },
    { value: 'daily', label: 'Quotidienne' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuelle' },
  ];

  const openModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        name: schedule.name,
        site: schedule.site,
        equipmentType: schedule.equipmentType,
        startTime: schedule.startTime,
        duration: schedule.duration,
        frequency: schedule.frequency,
        isActive: schedule.isActive
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        name: '',
        site: 'all',
        equipmentType: 'all',
        startTime: '',
        duration: 30,
        frequency: 'daily',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSchedule) {
      setSchedules(schedules.map(s => 
        s.id === editingSchedule.id 
          ? { ...s, ...formData, nextRun: calculateNextRun(formData.startTime) }
          : s
      ));
    } else {
      const newSchedule = {
        id: Date.now(),
        ...formData,
        nextRun: calculateNextRun(formData.startTime)
      };
      setSchedules([...schedules, newSchedule]);
    }
    
    closeModal();
  };

  const calculateNextRun = (time) => {
    const today = new Date();
    const [hours, minutes] = time.split(':');
    const nextRun = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    
    if (nextRun < today) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun.toLocaleString('fr-FR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleScheduleStatus = (id) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const deleteSchedule = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette planification ?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const getFrequencyBadge = (frequency) => {
    const badges = {
      once: { color: 'bg-gray-100 text-gray-700 border-gray-300', text: 'Une fois' },
      daily: { color: 'bg-blue-100 text-blue-700 border-blue-300', text: 'Quotidien' },
      weekly: { color: 'bg-purple-100 text-purple-700 border-purple-300', text: 'Hebdomadaire' },
      monthly: { color: 'bg-indigo-100 text-indigo-700 border-indigo-300', text: 'Mensuel' },
    };
    return badges[frequency] || badges.daily;
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Planification des collectes</h1>
          <p className="text-gray-500 mt-1">Automatisez vos collectes de données</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-green-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <FaClock /> Nouvelle planification
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total planifications</p>
              <p className="text-3xl font-bold mt-1">{schedules.length}</p>
            </div>
            <FaClock size={40} className="opacity-30" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Actives</p>
              <p className="text-3xl font-bold mt-1">
                {schedules.filter(s => s.isActive).length}
              </p>
            </div>
            <FaCheckCircle size={40} className="opacity-30" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Prochaine collecte</p>
              <p className="text-lg font-bold mt-1">
                {schedules.filter(s => s.isActive).length > 0 
                  ? schedules.filter(s => s.isActive)[0].startTime 
                  : 'N/A'}
              </p>
            </div>
            <FaPlay size={40} className="opacity-30" />
          </div>
        </motion.div>
      </div>

      {/* Liste des planifications */}
        <PlanificationList
        schedules={schedules}
        getFrequencyBadge={getFrequencyBadge}
        toggleScheduleStatus={toggleScheduleStatus}
        openModal={openModal}
        deleteSchedule={deleteSchedule}
      />

      {/* Modal de création/modification */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-green-600 to-cyan-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingSchedule ? 'Modifier la planification' : 'Nouvelle planification'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la planification *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Collecte matinale - Site principal"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site *
                    </label>
                    <select
                      required
                      value={formData.site}
                      onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">Tous les sites</option>
                      {mockSites.map(site => (
                        <option key={site.id} value={site.name}>{site.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'équipement *
                    </label>
                    <select
                      required
                      value={formData.equipmentType}
                      onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {equipmentTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de marque *
                    </label>
                    <select
                      required
                      value={formData.marqueType}
                      onChange={(e) => setFormData({ ...formData, marqueType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {marquesTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de démarrage *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="1440"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence *
                  </label>
                  <select
                    required
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Activer cette planification immédiatement
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-cyan-700 transition-all shadow-lg"
                  >
                    {editingSchedule ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanificationPage
