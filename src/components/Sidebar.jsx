
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FaPlug,
  FaSignOutAlt,
  FaUserAlt,
  FaUsers,
  FaUserCheck
} from 'react-icons/fa';


const Sidebar = ({ isOpen, toggleSidebar, activeItem, setActiveItem }) => {
   const navigate = useNavigate()
  const menuItems = [
    { icon: <FaServer size={20} />, title: 'Accueil', id: 'accueil' },
    { icon: <FaMapMarkerAlt size={20} />, title: 'Sites', id: 'sites' },
    { icon: <FaClock size={20} />, title: 'Planification', id: 'planification' },
    { icon: <FaDatabase size={20} />, title: 'Collecte', id: 'collecte' },
       { icon: <FaUserCheck size={20} />, title: 'Gestion des clients', id: 'client' },
    { icon: <FaUsers size={20} />, title: 'Utilisateur systéme', id: 'gestion' },
  
      { icon: <FaShieldAlt size={20} />, title: 'Paramètres', id: 'parametres' },
  
  ];
const handleLogout = () => {

        navigate('/'); // Redirect to login page
    };
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed h-full z-50 w-64 bg-gradient-to-br from-green-600 to-cyan-600 shadow-2xl"
      >
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold text-white">
            Collector
          </h1>
          <p className="text-xs text-white/80 mt-1">by ElecIT</p>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveItem(item.id);
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.id 
                      ? 'bg-white text-green-600 shadow-lg' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="ml-3 font-medium">{item.title}</span>
                  {activeItem === item.id && (
                    <span className="ml-auto w-1.5 h-6 rounded-full bg-green-500"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
         <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button
              onClick={handleLogout}
                      className="flex items-center p-3 text-white rounded-lg hover:bg-red-400 transition-all duration-200"
          >
            <span className="text-white"><FaSignOutAlt size={20} /></span>
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
