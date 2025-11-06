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
const PlanificationList = ({
  schedules = [],
  getFrequencyBadge = () => {},
  toggleScheduleStatus = () => {},
  openModal = () => {},
  deleteSchedule = () => {},
}) => {
  return (
    <div>
        <div className="grid grid-cols-1 gap-4">
        {schedules.map((schedule, index) => {
          const freqBadge = getFrequencyBadge(schedule.frequency);
          return (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                schedule.isActive ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${schedule.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <h3 className="text-lg font-bold text-gray-800">{schedule.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${freqBadge.color}`}>
                        {freqBadge.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Site</p>
                          <p className="font-medium">{schedule.site === 'all' ? 'Tous les sites' : schedule.site}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaServer className="text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-medium capitalize">
                            {schedule.equipmentType === 'all' ? 'Tous' : schedule.equipmentType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-cyan-600" />
                        <div>
                          <p className="text-xs text-gray-500">Démarrage</p>
                          <p className="font-medium">{schedule.startTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaSpinner className="text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-500">Durée</p>
                          <p className="font-medium">{schedule.duration} minutes</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Prochaine exécution :</span>
                        <span className="font-medium text-green-600">{schedule.nextRun}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => toggleScheduleStatus(schedule.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        schedule.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {schedule.isActive ? 'Actif' : 'Inactif'}
                    </button>
                    <button
                      onClick={() => openModal(schedule)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {schedules.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <FaClock size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune planification</h3>
          <p className="text-gray-500 mb-6">Créez votre première planification pour automatiser vos collectes</p>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-green-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-cyan-700 transition-all"
          >
            Créer une planification
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default PlanificationList
