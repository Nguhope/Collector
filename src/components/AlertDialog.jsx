import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const AlertDialog = ({ title, message, isOpen, onClose, type = 'warning' }) => {
    if (!isOpen) return null;

    const baseStyle = "bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100";
    let icon = <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    let headerStyle = "bg-yellow-100 text-yellow-800";

    if (type === 'error') {
        icon = <X className="w-6 h-6 text-red-600" />;
        headerStyle = "bg-red-100 text-red-800";
    } else if (type === 'success') {
        icon = <AlertTriangle className="w-6 h-6 text-green-600" />; // Utilisé ici pour l'icône de succès par convention de Lucide
        headerStyle = "bg-green-100 text-green-800";
    }

    return (
        <div className="fixed inset-0  backdrop-blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className={baseStyle}>
                
                {/* Header */}
                <div className={`flex items-center justify-between p-4 rounded-t-xl border-b ${headerStyle}`}>
                    <div className="flex items-center gap-3">
                        {icon}
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-700">{message}</p>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                                   ${type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                    >
                        Compris
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;