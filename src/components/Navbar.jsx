import React from 'react'
import { FaBars, FaBell, FaCog , FaServer} from 'react-icons/fa';

const NavBar = ({ title, setSidebarOpen }) => {
  return (
    <div className="bg-white shadow-md sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
         
         
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(prev => !prev)}
          >
            <FaServer size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <p className="text-xs text-gray-500">Gestion des équipements</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-cyan-600 flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
            <span className="text-sm font-medium text-gray-700">Utilisateur</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar
